import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
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
  deleteChatMessageApi,
  editChatMessageApi,
  getChatListApi,
  getChatMessagesApi,
  markChatRoomAsReadApi,
  sendChatMessageApi,
} from '@/shared/api/chat.api';
import {
  emitStopTyping,
  emitTyping,
  getSocket,
  joinChatRoom,
  leaveChatRoom,
  subscribeToIncomingMessages,
  subscribeToMessageUpdates,
  subscribeToPresence,
  subscribeToTyping,
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
  const [editingMessage, setEditingMessage] = useState(null);
  const [replyToMessage, setReplyToMessage] = useState(null);
  const [showMobileThread, setShowMobileThread] = useState(
    Boolean(initialRoomId),
  );
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [onlineUserIds, setOnlineUserIds] = useState(() => new Set());
  const [peerIsTyping, setPeerIsTyping] = useState(false);
  const typingIdleTimerRef = useRef(null);
  const isTypingRef = useRef(false);
  const peerTypingTimerRef = useRef(null);

  // Connect socket + track presence as soon as chat page opens
  useEffect(() => {
    getSocket();
    return subscribeToPresence({
      onOnlineUsers: (ids) => setOnlineUserIds(new Set(ids.map(String))),
      onUserOnline: (userId) =>
        setOnlineUserIds((prev) => {
          const next = new Set(prev);
          next.add(String(userId));
          return next;
        }),
      onUserOffline: (userId) =>
        setOnlineUserIds((prev) => {
          const next = new Set(prev);
          next.delete(String(userId));
          return next;
        }),
    });
  }, []);

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

      const peerId = user.id ? String(user.id) : '';
      return {
        id: item.roomId,
        roomId: item.roomId,
        targetUserId: user.id,
        name: user.name || user.username || 'User',
        handle: user.username ? `@${user.username}` : '@user',
        avatar: user.avatar || '/assets/home/avatar-anna.webp',
        online: Boolean(user.isOnline) || (peerId && onlineUserIds.has(peerId)),
        time,
        preview,
        unread: 0,
      };
    });
  }, [rawChatList, onlineUserIds]);

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

  // 2. Fetch messages for active room (poll as fallback if socket drops)
  const { data: messagesData, isLoading: isLoadingMessages } = useQuery({
    queryKey: CHAT_MESSAGES_QUERY_KEY(activeId),
    queryFn: () => getChatMessagesApi({ roomId: activeId, page: 1, limit: 50 }),
    enabled: Boolean(activeId),
    staleTime: 5 * 1000,
    refetchInterval: 8 * 1000,
  });

  // Mark room as read when activeId changes
  useEffect(() => {
    if (!activeId) return;
    markChatRoomAsReadApi({ roomId: activeId }).catch(() => {});
  }, [activeId]);

  // 3. Socket.io real-time listener for current room
  useEffect(() => {
    if (!activeId) return;

    joinChatRoom(activeId);

    setPeerIsTyping(false);

    const unsubscribeMessages = subscribeToIncomingMessages((incoming) => {
      const incomingRoomId = incoming?.roomId || incoming?.room;
      // If message belongs to active room
      if (incomingRoomId === activeId) {
        setPeerIsTyping(false);
        if (peerTypingTimerRef.current) {
          window.clearTimeout(peerTypingTimerRef.current);
          peerTypingTimerRef.current = null;
        }
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

        // Mark as read in backend
        markChatRoomAsReadApi({ roomId: activeId }).catch(() => {});
      }

      // Invalidate chat list so lastMessage and timestamp refresh
      queryClient.invalidateQueries({ queryKey: CHAT_LIST_QUERY_KEY });
    });

    const unsubscribeTyping = subscribeToTyping({
      onTyping: (payload) => {
        const roomId = payload?.roomId;
        const userId = String(payload?.userId || '');
        if (roomId && String(roomId) !== String(activeId)) return;
        if (userId && currentUserId && userId === String(currentUserId)) return;
        setPeerIsTyping(true);
        if (peerTypingTimerRef.current) {
          window.clearTimeout(peerTypingTimerRef.current);
        }
        peerTypingTimerRef.current = window.setTimeout(() => {
          setPeerIsTyping(false);
        }, 2500);
      },
      onStopTyping: (payload) => {
        const roomId = payload?.roomId;
        const userId = String(payload?.userId || '');
        if (roomId && String(roomId) !== String(activeId)) return;
        if (userId && currentUserId && userId === String(currentUserId)) return;
        setPeerIsTyping(false);
        if (peerTypingTimerRef.current) {
          window.clearTimeout(peerTypingTimerRef.current);
          peerTypingTimerRef.current = null;
        }
      },
    });

    // Real-time edits, deletes, and read updates
    const unsubscribeUpdates = subscribeToMessageUpdates({
      onEdit: (updated) => {
        if (!updated?.id) return;
        queryClient.setQueryData(CHAT_MESSAGES_QUERY_KEY(activeId), (old) => {
          if (!old) return old;
          const list = Array.isArray(old.messages) ? old.messages : [];
          return {
            ...old,
            messages: list.map((m) =>
              m.id === updated.id
                ? {
                    ...m,
                    content: updated.content ?? m.content,
                    isEdited: true,
                  }
                : m,
            ),
          };
        });
        queryClient.invalidateQueries({ queryKey: CHAT_LIST_QUERY_KEY });
      },
      onDelete: (deleted) => {
        const deletedId = deleted?.id || deleted?.messageId || deleted;
        if (!deletedId) return;
        queryClient.setQueryData(CHAT_MESSAGES_QUERY_KEY(activeId), (old) => {
          if (!old) return old;
          const list = Array.isArray(old.messages) ? old.messages : [];
          return {
            ...old,
            messages: list.map((m) =>
              m.id === deletedId
                ? { ...m, isDeleted: true, content: 'This message was deleted' }
                : m,
            ),
          };
        });
        queryClient.invalidateQueries({ queryKey: CHAT_LIST_QUERY_KEY });
      },
      onRead: () => {
        queryClient.setQueryData(CHAT_MESSAGES_QUERY_KEY(activeId), (old) => {
          if (!old) return old;
          const list = Array.isArray(old.messages) ? old.messages : [];
          return {
            ...old,
            messages: list.map((m) => ({ ...m, isRead: true })),
          };
        });
      },
    });

    return () => {
      unsubscribeMessages();
      unsubscribeUpdates();
      unsubscribeTyping();
      if (isTypingRef.current) {
        emitStopTyping(activeId);
        isTypingRef.current = false;
      }
      if (typingIdleTimerRef.current) {
        window.clearTimeout(typingIdleTimerRef.current);
        typingIdleTimerRef.current = null;
      }
      if (peerTypingTimerRef.current) {
        window.clearTimeout(peerTypingTimerRef.current);
        peerTypingTimerRef.current = null;
      }
      leaveChatRoom(activeId);
    };
  }, [activeId, queryClient, currentUserId]);

  const handleDraftChange = useCallback(
    (value) => {
      const nextValue =
        typeof value === 'string' ? value : value?.target?.value || '';
      setDraft(nextValue);

      if (!activeId || editingMessage) return;

      if (nextValue.trim()) {
        if (!isTypingRef.current) {
          isTypingRef.current = true;
          emitTyping(activeId);
        }
        if (typingIdleTimerRef.current) {
          window.clearTimeout(typingIdleTimerRef.current);
        }
        typingIdleTimerRef.current = window.setTimeout(() => {
          if (isTypingRef.current) {
            isTypingRef.current = false;
            emitStopTyping(activeId);
          }
        }, 1200);
      } else if (isTypingRef.current) {
        isTypingRef.current = false;
        emitStopTyping(activeId);
        if (typingIdleTimerRef.current) {
          window.clearTimeout(typingIdleTimerRef.current);
          typingIdleTimerRef.current = null;
        }
      }
    },
    [activeId, editingMessage],
  );

  // 4. Send Message Mutation (supports multipart text and file attachments)
  const sendMutation = useMutation({
    mutationFn: sendChatMessageApi,
    onSuccess: (response, variables) => {
      let newMsg = response?.data || response;
      // If API omitted nested replyTo, rebuild it from the message we replied to
      if (newMsg && variables?.replyToId && !newMsg.replyTo) {
        const parent =
          replyToMessage?.id === variables.replyToId
            ? replyToMessage
            : (queryClient.getQueryData(CHAT_MESSAGES_QUERY_KEY(activeId))
                ?.messages || []
              ).find((m) => m.id === variables.replyToId);

        if (parent) {
          newMsg = {
            ...newMsg,
            replyToId: variables.replyToId,
            replyTo: {
              id: parent.id,
              content: parent.content ?? parent.text ?? null,
              fileUrl: parent.fileUrl ?? null,
              fileType: parent.fileType ?? null,
              fileName: parent.fileName ?? null,
              isDeleted: Boolean(parent.isDeleted),
              senderId: parent.senderId || parent.sender?.id || null,
              sender: parent.sender || null,
            },
          };
        }
      }

      if (newMsg && activeId) {
        queryClient.setQueryData(CHAT_MESSAGES_QUERY_KEY(activeId), (old) => {
          if (!old) return { messages: [newMsg], total: 1, page: 1, limit: 50 };
          const prevList = Array.isArray(old.messages) ? old.messages : [];
          if (newMsg.id && prevList.some((m) => m.id === newMsg.id)) {
            // Socket may have inserted first — still merge reply metadata
            return {
              ...old,
              messages: prevList.map((m) =>
                m.id === newMsg.id
                  ? {
                      ...m,
                      ...newMsg,
                      replyTo: newMsg.replyTo || m.replyTo || null,
                      replyToId: newMsg.replyToId || m.replyToId || null,
                    }
                  : m,
              ),
            };
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
      setReplyToMessage(null);
      if (isTypingRef.current && activeId) {
        isTypingRef.current = false;
        emitStopTyping(activeId);
      }
      if (typingIdleTimerRef.current) {
        window.clearTimeout(typingIdleTimerRef.current);
        typingIdleTimerRef.current = null;
      }
      queryClient.invalidateQueries({ queryKey: CHAT_LIST_QUERY_KEY });
    },
    onError: (error) => {
      toast.error(error?.message || 'Failed to send message');
    },
  });

  // 5. Edit Message Mutation
  const editMutation = useMutation({
    mutationFn: editChatMessageApi,
    onSuccess: (response, variables) => {
      const updated = response?.data || response;
      queryClient.setQueryData(CHAT_MESSAGES_QUERY_KEY(activeId), (old) => {
        if (!old) return old;
        const list = Array.isArray(old.messages) ? old.messages : [];
        return {
          ...old,
          messages: list.map((msg) =>
            msg.id === variables.messageId
              ? {
                  ...msg,
                  content: variables.content,
                  isEdited: true,
                  ...(typeof updated === 'object' ? updated : {}),
                }
              : msg,
          ),
        };
      });
      setEditingMessage(null);
      setDraft('');
      queryClient.invalidateQueries({ queryKey: CHAT_LIST_QUERY_KEY });
      toast.success('Message updated');
    },
    onError: (error) => {
      toast.error(error?.message || 'Failed to edit message');
    },
  });

  // 6. Delete Message Mutation
  const deleteMutation = useMutation({
    mutationFn: deleteChatMessageApi,
    onSuccess: (_response, variables) => {
      queryClient.setQueryData(CHAT_MESSAGES_QUERY_KEY(activeId), (old) => {
        if (!old) return old;
        const list = Array.isArray(old.messages) ? old.messages : [];
        return {
          ...old,
          messages: list.map((msg) =>
            msg.id === variables.messageId
              ? { ...msg, isDeleted: true, content: 'This message was deleted' }
              : msg,
          ),
        };
      });
      if (editingMessage?.id === variables.messageId) {
        setEditingMessage(null);
        setDraft('');
      }
      queryClient.invalidateQueries({ queryKey: CHAT_LIST_QUERY_KEY });
      toast.success('Message deleted');
    },
    onError: (error) => {
      toast.error(error?.message || 'Failed to delete message');
    },
  });

  const handleSelect = (conversationId) => {
    setActiveId(conversationId);
    setSearchParams({ room: conversationId }, { replace: true });
    setShowMobileThread(true);
    setDraft('');
    setSelectedFile(null);
    setEditingMessage(null);
    setReplyToMessage(null);
  };

  const handleStartEdit = (message) => {
    setReplyToMessage(null);
    setEditingMessage(message);
    setDraft(message.text || '');
    setSelectedFile(null);
  };

  const handleCancelEdit = () => {
    setEditingMessage(null);
    setDraft('');
  };

  const handleStartReply = (message) => {
    if (!message?.id || message.isDeleted) return;
    setEditingMessage(null);
    setReplyToMessage(message);
  };

  const handleCancelReply = () => {
    setReplyToMessage(null);
  };

  const handleDeleteMessage = (messageId) => {
    if (!messageId) return;
    deleteMutation.mutate({ messageId });
  };

  const handleSend = () => {
    if (editingMessage) {
      const text = draft.trim();
      if (!text) return;
      editMutation.mutate({
        messageId: editingMessage.id,
        content: text,
      });
      return;
    }

    const text = draft.trim();
    if ((!text && !selectedFile) || !activeId) return;

    sendMutation.mutate({
      roomId: activeId,
      content: text,
      file: selectedFile,
      replyToId: replyToMessage?.id || null,
    });
  };

  // Normalize messages for ChatMessageBubble (oldest → newest, latest at bottom)
  const messages = useMemo(() => {
    const rawMessages = Array.isArray(messagesData?.messages)
      ? [...messagesData.messages]
      : [];

    rawMessages.sort((a, b) => {
      const aTime = new Date(a?.createdAt || 0).getTime();
      const bTime = new Date(b?.createdAt || 0).getTime();
      return aTime - bTime;
    });

    const normalized = rawMessages.map((msg) => {
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
        isEdited: Boolean(msg.isEdited),
        isDeleted: Boolean(msg.isDeleted),
        sender: msg.sender,
        replyTo: msg.replyTo
          ? {
              id: msg.replyTo.id,
              text: msg.replyTo.content,
              fileUrl: msg.replyTo.fileUrl,
              fileType: msg.replyTo.fileType,
              fileName: msg.replyTo.fileName,
              isDeleted: Boolean(msg.replyTo.isDeleted),
              sender: msg.replyTo.sender,
              senderId: msg.replyTo.senderId,
            }
          : null,
      };
    });

    if (peerIsTyping) {
      normalized.push({ id: 'peer-typing', type: 'typing' });
    }
    return normalized;
  }, [messagesData, currentUserId, peerIsTyping]);

  const handleRoomCreated = (newRoomId) => {
    setActiveId(newRoomId);
    setSearchParams({ room: newRoomId }, { replace: true });
    setShowMobileThread(true);
    queryClient.invalidateQueries({ queryKey: CHAT_LIST_QUERY_KEY });
  };

  return (
    <div className="mx-auto flex h-full min-h-0 w-full max-w-395 flex-col">
      <div className="flex min-h-0 flex-1 overflow-hidden rounded-[20px] border border-[#ececf0] bg-white shadow-[0_8px_30px_rgba(15,23,42,0.06)]">
        {/* < xl: Messenger-style list OR thread. xl+: list + panel split. */}
        <div
          className={`h-full min-h-0 w-full min-w-0 xl:w-auto xl:shrink-0 ${
            showMobileThread ? 'hidden xl:flex' : 'flex'
          }`}
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

        {/* < xl: full-width thread after select. xl+: always right panel. */}
        <div
          className={`min-h-0 min-w-0 flex-1 flex-col ${
            showMobileThread ? 'flex' : 'hidden xl:flex'
          }`}
        >
          {activeConversation ? (
            <ChatMessageArea
              conversation={activeConversation}
              messages={messages}
              draft={draft}
              onDraftChange={handleDraftChange}
              onSend={handleSend}
              selectedFile={selectedFile}
              onFileSelect={setSelectedFile}
              onFileRemove={() => setSelectedFile(null)}
              isSending={
                sendMutation.isPending ||
                editMutation.isPending ||
                deleteMutation.isPending
              }
              isLoadingMessages={isLoadingMessages}
              editingMessage={editingMessage}
              onStartEdit={handleStartEdit}
              onCancelEdit={handleCancelEdit}
              replyToMessage={replyToMessage}
              onStartReply={handleStartReply}
              onCancelReply={handleCancelReply}
              onDeleteMessage={handleDeleteMessage}
              currentUserId={currentUserId}
              onBack={() => setShowMobileThread(false)}
            />
          ) : (
            <div className="hidden flex-1 flex-col items-center justify-center bg-[#f8fafc] px-6 text-center text-[15px] text-[#6b7280] xl:flex">
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
                  className="mt-4 rounded-full border border-[#c7d2fe] bg-[#eef2ff] px-5 py-2 text-[14px] font-semibold text-[#4048cd] transition hover:bg-[#ecedfa]"
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
