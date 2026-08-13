import React, { memo, useMemo, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import ChatConversationList from '@/portals/member/components/member-chat/ChatConversationList';
import ChatMessageArea from '@/portals/member/components/member-chat/ChatMessageArea';
import {
  CHAT_CONVERSATIONS,
  CHAT_TOTAL_UNREAD,
  getChatMessages,
  getDefaultChatConversationId,
} from '@/portals/member/data/chatMessagesData';

const MemberChatContent = memo(() => {
  const { t } = useTranslation();
  const [activeId, setActiveId] = useState(getDefaultChatConversationId);
  const [searchQuery, setSearchQuery] = useState('');
  const [draft, setDraft] = useState('');
  const [showMobileThread, setShowMobileThread] = useState(false);
  const [localMessages, setLocalMessages] = useState({});

  const activeConversation = useMemo(
    () => CHAT_CONVERSATIONS.find((conversation) => conversation.id === activeId) ?? null,
    [activeId],
  );

  const messages = useMemo(() => {
    const base = getChatMessages(activeId);
    const extra = localMessages[activeId] ?? [];
    return [...base, ...extra];
  }, [activeId, localMessages]);

  const handleSelect = (conversationId) => {
    setActiveId(conversationId);
    setShowMobileThread(true);
  };

  const handleSend = () => {
    const text = draft.trim();
    if (!text || !activeId) return;

    setLocalMessages((current) => ({
      ...current,
      [activeId]: [
        ...(current[activeId] ?? []),
        {
          type: 'sent',
          variant: 'text',
          text,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          read: true,
        },
      ],
    }));
    setDraft('');
  };

  return (
    <div className="mx-auto flex h-full min-h-0 w-full max-w-[1580px] flex-col">
      <div className="flex min-h-0 flex-1 overflow-hidden rounded-[20px] border border-[#ececf0] bg-white shadow-[0_8px_30px_rgba(15,23,42,0.06)]">
        <div className={`${showMobileThread ? 'hidden' : 'flex'} h-full min-h-0 lg:flex`}>
          <ChatConversationList
            conversations={CHAT_CONVERSATIONS}
            activeId={activeId}
            totalUnread={CHAT_TOTAL_UNREAD}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onSelect={handleSelect}
            onCompose={() => {}}
          />
        </div>

        <div className={`${showMobileThread ? 'flex' : 'hidden'} min-h-0 min-w-0 flex-1 flex-col lg:flex`}>
          {activeConversation ? (
            <>
              <button
                type="button"
                onClick={() => setShowMobileThread(false)}
                className="inline-flex items-center gap-2 border-b border-[#ececf0] px-4 py-3 text-[14px] font-medium text-[#494453] lg:hidden"
              >
                <ArrowLeft size={18} strokeWidth={2} aria-hidden="true" />
                {t('memberChat.backToList')}
              </button>
              <div className="flex min-h-0 flex-1 flex-col">
                <ChatMessageArea
                  conversation={activeConversation}
                  messages={messages}
                  draft={draft}
                  onDraftChange={setDraft}
                  onSend={handleSend}
                />
              </div>
            </>
          ) : (
            <div className="flex flex-1 items-center justify-center bg-[#f8fafc] px-6 text-center text-[15px] text-[#6b7280]">
              {t('memberChat.selectConversation')}
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

MemberChatContent.displayName = 'MemberChatContent';

export default MemberChatContent;
