import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, SquarePen } from 'lucide-react';

const formatUnread = (count) => {
  if (count > 999) return '999';
  return String(count);
};

const ChatConversationList = memo(({
  conversations,
  activeId,
  totalUnread,
  searchQuery,
  onSearchChange,
  onSelect,
  onCompose,
}) => {
  const { t } = useTranslation();

  const filtered = conversations.filter((conversation) => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return true;
    return (
      conversation.name.toLowerCase().includes(query) ||
      conversation.handle.toLowerCase().includes(query)
    );
  });

  return (
    <aside className="flex h-full w-full shrink-0 flex-col border-r border-[#ececf0] bg-white lg:w-[340px] xl:w-[380px]">
      <div className="flex items-center justify-between gap-3 px-5 pb-4 pt-5">
        <div className="flex items-center gap-2.5">
          <h1 className="text-[22px] font-semibold leading-none text-[#161c27]">
            {t('memberChat.title')}
          </h1>
          <span className="inline-flex min-w-[28px] items-center justify-center rounded-full bg-[#4048cd] px-2 py-0.5 text-[12px] font-bold leading-5 text-white">
            {totalUnread}
          </span>
        </div>
        <button
          type="button"
          aria-label={t('memberChat.compose')}
          onClick={onCompose}
          className="inline-flex size-10 cursor-pointer items-center justify-center rounded-xl border border-[#ececf0] bg-white text-[#494453] transition hover:border-[#4048cd]/30 hover:text-[#4048cd]"
        >
          <SquarePen size={18} strokeWidth={2} aria-hidden="true" />
        </button>
      </div>

      <div className="px-5 pb-4">
        <label className="relative block">
          <Search
            size={18}
            strokeWidth={2}
            aria-hidden="true"
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#9ca3af]"
          />
          <input
            type="search"
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder={t('memberChat.searchPlaceholder')}
            className="h-11 w-full rounded-full border border-[#ececf0] bg-[#f8fafc] py-2 pl-11 pr-4 text-[14px] text-[#161c27] placeholder:text-[#9ca3af] outline-none transition focus:border-[#4048cd]/40 focus:ring-2 focus:ring-[#4048cd]/15"
          />
        </label>
      </div>

      <ul className="scrollbar-light flex-1 overflow-y-auto px-2" aria-label={t('memberChat.listAria')}>
        {filtered.map((conversation) => {
          const isActive = conversation.id === activeId;
          return (
            <li key={conversation.id}>
              <button
                type="button"
                onClick={() => onSelect(conversation.id)}
                aria-pressed={isActive}
                className={`flex w-full cursor-pointer items-start gap-3 rounded-2xl px-3 py-3 text-left transition ${
                  isActive ? 'bg-[#ecedfa]' : 'hover:bg-[#f8fafc]'
                }`}
              >
                <img
                  src={conversation.avatar}
                  alt=""
                  width={48}
                  height={48}
                  className="size-12 shrink-0 rounded-full object-cover"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate text-[15px] font-semibold text-[#161c27]">
                      {conversation.name}
                    </span>
                    <span className="shrink-0 text-[12px] font-medium text-[#9ca3af]">
                      {conversation.time}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center justify-between gap-2">
                    <p className="truncate text-[13px] leading-5 text-[#6b7280]">
                      {t(conversation.previewKey)}
                    </p>
                    {conversation.unread > 0 ? (
                      <span className="inline-flex min-w-[22px] shrink-0 items-center justify-center rounded-full bg-[#4048cd] px-1.5 py-0.5 text-[11px] font-bold leading-4 text-white">
                        {formatUnread(conversation.unread)}
                      </span>
                    ) : null}
                  </div>
                </div>
              </button>
            </li>
          );
        })}
      </ul>

      <div className="border-t border-[#ececf0] px-5 py-4">
        <button
          type="button"
          onClick={onCompose}
          className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-full border border-[#c7d2fe] bg-[#eef2ff] px-4 py-2.5 text-[14px] font-semibold text-[#4048cd] transition hover:bg-[#ecedfa]"
        >
          {t('memberChat.addNewChat')}
        </button>
      </div>
    </aside>
  );
});

ChatConversationList.displayName = 'ChatConversationList';

export default ChatConversationList;
