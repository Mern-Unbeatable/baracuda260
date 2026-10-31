import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
import React, { memo, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useLocation, useSearchParams } from 'react-router-dom';
import { selectUser } from '@/app/store/slices/authSlice';
import Button from '@/components/ui/Button';
import ChatConversationList from '@/portals/member/components/member-chat/ChatConversationList';
import ChatMessageArea from '@/portals/member/components/member-chat/ChatMessageArea';
import NewChatModal from '@/portals/member/components/member-chat/NewChatModal';
import {
  CHAT_LIST_QUERY_KEY,
  CHAT_MESSAGES_QUERY_KEY,
  createOrGetChatRoomApi,
  getChatListApi,
  getChatMessagesApi,
  sendChatMessageApi,
} from '@/shared/api/chat.api';
import {
  joinChatRoom,
  leaveChatRoom,
  subscribeToIncomingMessages,
} from '@/shared/lib/chatSocket';

const MemberChatContent = memo(() => {
  const { t } = useTranslation();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const currentUser = useSelector(selectUser);
  const currentUserId = currentUser?.id || currentUser?._id;

  const initialRoomId =
    searchParams.get('room') || location.state?.roomId || null;
  const initialTargetUserId =
    searchParams.get('userId') || location.state?.targetUserId || null;

  const [activeId, setActiveId] = useState(initialRoomId);
  const [searchQuery, setSearchQuery] = useState('');
  const [draft, setDraft] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [showMobileThread, setShowMobileThread] = useState(
    Boolean(initialRoomId),
  );
  const [isComposeOpen, setIsComposeOpen] = useState(false);

  // 1. Fetch chat rooms list
  const { data: rawChatList = [], isLoading: isLoadingChats } = useQuery({
    queryKey: [...CHAT_LIST_QUERY_KEY, searchQuery],
    queryFn: () => getChatListApi({ search: searchQuery }),
    staleTime: 10 * 1000,
    refetchInterval: 15 * 1000,
  });

  // Normalize conversation items from API response
  const conversations = useMemo(() => {
    return (Array.isArray(rawChatList) ? rawChatList : []).map((item) => {
      const user = item.user || {};
      const lastMsg = item.lastMessage;
      let time = '';
      const dateVal = lastMsg?.createdAt || item.updatedAt;
      if (dateVal) {
        try {
          const d = new Date(dateVal);
          const isToday = new Date().toDateString() === d.toDateString();
          time = isToday
            ? d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            : d.toLocaleDateString([], { month: 'short', day: 'numeric' });
        } catch {
          time = '';
        }
      }

      let preview = 'Started a conversation';
      if (lastMsg?.content) {
        preview = lastMsg.content;
      } else if (lastMsg?.fileName) {
        preview = `📎 ${lastMsg.fileName}`;
      } else if (lastMsg?.fileUrl) {
        preview = '📎 Attachment';
      }

      return {
        id: item.roomId,
        roomId: item.roomId,
        targetUserId: user.id,
        name: user.name || user.username || 'User',
        handle: user.username ? `@${user.username}` : '@user',
        avatar: user.avatar || '/assets/home/avatar-anna.webp',
        online: Boolean(user.isOnline),
        time,
        preview,
        unread: 0,
      };
    });
  }, [rawChatList]);

  // Handle auto-creating or opening room if targetUserId was supplied in navigation state
  useEffect(() => {
    if (!initialTargetUserId) return;

    // Check if room with targetUserId already exists in list
    const existing = conversations.find(
      (c) => c.targetUserId === initialTargetUserId,
    );
    if (existing) {
      setActiveId(existing.id);
      setShowMobileThread(true);
      return;
    }

    let isMounted = true;
    createOrGetChatRoomApi({ targetUserId: initialTargetUserId })
      .then((roomData) => {
        if (!isMounted) return;
        const newRoomId = roomData?.id || roomData?.data?.id;
        if (newRoomId) {
          setActiveId(newRoomId);
          setShowMobileThread(true);
          queryClient.invalidateQueries({ queryKey: CHAT_LIST_QUERY_KEY });
        }
      })
      .catch((err) => {
        console.warn('Could not auto-create chat room:', err?.message || err);
      });

    return () => {
      isMounted = false;
    };
  }, [initialTargetUserId, conversations, queryClient]);

  // If no room is active and conversations loaded, select the first one
  useEffect(() => {
    if (!activeId && conversations.length > 0) {
      setActiveId(conversations[0].id);
    }
  }, [activeId, conversations]);

  const activeConversation = useMemo(
    () =>
      conversations.find((conversation) => conversation.id === activeId) ??
      null,
    [conversations, activeId],
  );

  // 2. Fetch messages for active room
  const { data: messagesData, isLoading: isLoadingMessages } = useQuery({
    queryKey: CHAT_MESSAGES_QUERY_KEY(activeId),
    queryFn: () => getChatMessagesApi({ roomId: activeId, page: 1, limit: 50 }),
    enabled: Boolean(activeId),
    staleTime: 5 * 1000,
  });

  // 3. Socket.io real-time listener for current room
  useEffect(() => {
    if (!activeId) return;

    joinChatRoom(activeId);

    const unsubscribe = subscribeToIncomingMessages((incoming) => {
      const incomingRoomId = incoming?.roomId || incoming?.room;
      // If message belongs to active room
      if (incomingRoomId === activeId) {
        queryClient.setQueryData(CHAT_MESSAGES_QUERY_KEY(activeId), (old) => {
          if (!old)
            return { messages: [incoming], total: 1, page: 1, limit: 50 };
          const prevList = Array.isArray(old.messages) ? old.messages : [];
          // Prevent duplicate message
          if (incoming?.id && prevList.some((m) => m.id === incoming.id)) {
            return old;
          }
          return {
            ...old,
            messages: [...prevList, incoming],
            total: (old.total || prevList.length) + 1,
          };
        });
      }

      // Invalidate chat list so lastMessage and timestamp refresh
      queryClient.invalidateQueries({ queryKey: CHAT_LIST_QUERY_KEY });
    });

    return () => {
      unsubscribe();
      leaveChatRoom(activeId);
    };
  }, [activeId, queryClient]);

  // 4. Send Message Mutation (supports multipart text and file attachments)
  const sendMutation = useMutation({
    mutationFn: sendChatMessageApi,
    onSuccess: (response) => {
      const newMsg = response?.data || response;
      if (newMsg && activeId) {
        queryClient.setQueryData(CHAT_MESSAGES_QUERY_KEY(activeId), (old) => {
          if (!old) return { messages: [newMsg], total: 1, page: 1, limit: 50 };
          const prevList = Array.isArray(old.messages) ? old.messages : [];
          if (newMsg.id && prevList.some((m) => m.id === newMsg.id)) {
            return old;
          }
          return {
            ...old,
            messages: [...prevList, newMsg],
            total: (old.total || prevList.length) + 1,
          };
        });
      }
      setDraft('');
      setSelectedFile(null);
      queryClient.invalidateQueries({ queryKey: CHAT_LIST_QUERY_KEY });
    },
    onError: (error) => {
      toast.error(error?.message || 'Failed to send message');
    },
  });

  const handleSelect = (conversationId) => {
    setActiveId(conversationId);
    setSearchParams({ room: conversationId }, { replace: true });
    setShowMobileThread(true);
    setDraft('');
    setSelectedFile(null);
  };

  const handleSend = () => {
    const text = draft.trim();
    if ((!text && !selectedFile) || !activeId) return;

    sendMutation.mutate({
      roomId: activeId,
      content: text,
      file: selectedFile,
    });
  };

  // Normalize messages for ChatMessageBubble
  const messages = useMemo(() => {
    const rawMessages = messagesData?.messages || [];
    return rawMessages.map((msg) => {
      const isSent =
        msg.senderId === currentUserId || msg.sender?.id === currentUserId;

      let formattedTime = '';
      if (msg.createdAt) {
        try {
          formattedTime = new Date(msg.createdAt).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          });
        } catch {
          formattedTime = '';
        }
      }

      return {
        id: msg.id,
        type: isSent ? 'sent' : 'received',
        text: msg.content,
        time: formattedTime,
        createdAt: msg.createdAt,
        fileUrl: msg.fileUrl,
        fileType: msg.fileType,
        fileName: msg.fileName,
        read: Boolean(msg.isRead),
        sender: msg.sender,
      };
    });
  }, [messagesData, currentUserId]);

  const handleRoomCreated = (newRoomId) => {
    setActiveId(newRoomId);
    setSearchParams({ room: newRoomId }, { replace: true });
    setShowMobileThread(true);
    queryClient.invalidateQueries({ queryKey: CHAT_LIST_QUERY_KEY });
  };

  return (
    <div className="mx-auto flex h-full min-h-0 w-full max-w-395 flex-col">
      <div className="flex min-h-0 flex-1 overflow-hidden rounded-[20px] border border-[#ececf0] bg-white shadow-[0_8px_30px_rgba(15,23,42,0.06)]">
        <div
          className={`${showMobileThread ? 'hidden' : 'flex'} h-full min-h-0 lg:flex`}
        >
          <ChatConversationList
            conversations={conversations}
            activeId={activeId}
            totalUnread={0}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onSelect={handleSelect}
            onCompose={() => setIsComposeOpen(true)}
            isLoading={isLoadingChats}
          />
        </div>

        <div
          className={`${showMobileThread ? 'flex' : 'hidden'} min-h-0 min-w-0 flex-1 flex-col lg:flex`}
        >
          {activeConversation ? (
            <>
              <Button
                unstyled
                type="button"
                onClick={() => setShowMobileThread(false)}
                className="inline-flex items-center gap-2 border-b border-[#ececf0] px-4 py-3 text-[14px] font-medium text-[#494453] lg:hidden"
              >
                <ArrowLeft size={18} strokeWidth={2} aria-hidden="true" />
                {t('memberChat.backToList')}
              </Button>
              <div className="flex min-h-0 flex-1 flex-col">
                <ChatMessageArea
                  conversation={activeConversation}
                  messages={messages}
                  draft={draft}
                  onDraftChange={setDraft}
                  onSend={handleSend}
                  selectedFile={selectedFile}
                  onFileSelect={setSelectedFile}
                  onFileRemove={() => setSelectedFile(null)}
                  isSending={sendMutation.isPending}
                  isLoadingMessages={isLoadingMessages}
                />
              </div>
            </>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center bg-[#f8fafc] px-6 text-center text-[15px] text-[#6b7280]">
              <p className="font-medium text-[#161c27]">
                {conversations.length === 0
                  ? 'No conversations started yet'
                  : t('memberChat.selectConversation')}
              </p>
              <p className="mt-1 text-[13px] text-[#9ca3af]">
                {conversations.length === 0
                  ? 'Click "Add New Chat" to connect with a photographer!'
                  : 'Choose a chat from the left sidebar to view messages.'}
              </p>
              {conversations.length === 0 ? (
                <Button
                  unstyled
                  type="button"
                  onClick={() => setIsComposeOpen(true)}
                  className="mt-4 rounded-full border border-[#c7d2fe] bg-[#eef2ff] px-5 py-2 text-[14px] font-semibold text-[#4048cd] hover:bg-[#ecedfa] transition"
                >
                  Start a Chat
                </Button>
              ) : null}
            </div>
          )}
        </div>
      </div>

      <NewChatModal
        open={isComposeOpen}
        onClose={() => setIsComposeOpen(false)}
        onRoomCreated={handleRoomCreated}
      />
    </div>
  );
});

MemberChatContent.displayName = 'MemberChatContent';

export default MemberChatContent;
