import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  CheckCheck,
  Download,
  FileText,
  Mic,
  MoreVertical,
  Paperclip,
  Pause,
  Play,
  Send,
  Smile,
} from 'lucide-react';

const VoiceWaveform = memo(({ active = false }) => (
  <div className="flex h-8 items-end gap-0.5" aria-hidden="true">
    {[3, 6, 4, 8, 5, 9, 4, 7, 3, 8, 5, 6, 4, 7, 5].map((height, index) => (
      <span
        key={index}
        className={`w-0.5 rounded-full ${active ? 'bg-white/90' : 'bg-[#4048cd]/70'}`}
        style={{ height: `${height + 8}px` }}
      />
    ))}
  </div>
));

VoiceWaveform.displayName = 'VoiceWaveform';

const ChatMessageBubble = memo(({ message, t }) => {
  if (message.type === 'date') {
    return (
      <div className="flex justify-center py-2">
        <span className="rounded-full bg-[#f3f4f6] px-3 py-1 text-[12px] font-medium text-[#6b7280]">
          {t(message.labelKey)}
        </span>
      </div>
    );
  }

  if (message.type === 'typing') {
    return (
      <div className="flex justify-start">
        <div className="inline-flex items-center gap-1 rounded-[20px] rounded-bl-md bg-white px-4 py-3 shadow-[0_1px_2px_rgba(0,0,0,0.06)] ring-1 ring-[#ececf0]">
          <span className="size-1.5 animate-bounce rounded-full bg-[#9ca3af] [animation-delay:0ms]" />
          <span className="size-1.5 animate-bounce rounded-full bg-[#9ca3af] [animation-delay:120ms]" />
          <span className="size-1.5 animate-bounce rounded-full bg-[#9ca3af] [animation-delay:240ms]" />
        </div>
      </div>
    );
  }

  const isSent = message.type === 'sent';

  if (message.variant === 'file') {
    return (
      <div className={`flex ${isSent ? 'justify-end' : 'justify-start'}`}>
        <div
          className={`max-w-[min(100%,320px)] rounded-[20px] px-4 py-3 ${
            isSent
              ? 'rounded-br-md bg-[#4048cd] text-white'
              : 'rounded-bl-md bg-white text-[#161c27] shadow-[0_1px_2px_rgba(0,0,0,0.06)] ring-1 ring-[#ececf0]'
          }`}
        >
          <div className="flex items-center gap-3">
            <span
              className={`inline-flex size-10 shrink-0 items-center justify-center rounded-xl ${
                isSent ? 'bg-white/15' : 'bg-[#ecedfa] text-[#4048cd]'
              }`}
            >
              <FileText size={18} strokeWidth={2} aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-[14px] font-semibold">{message.fileName}</p>
              <p className={`text-[12px] ${isSent ? 'text-white/75' : 'text-[#6b7280]'}`}>
                {message.fileSize}
              </p>
            </div>
            {!isSent ? (
              <button
                type="button"
                aria-label={t('memberChat.downloadFile')}
                className="ml-auto inline-flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full bg-[#4048cd] text-white"
              >
                <Download size={14} strokeWidth={2} aria-hidden="true" />
              </button>
            ) : null}
          </div>
          {message.time ? (
            <p className={`mt-2 text-[11px] ${isSent ? 'text-white/70' : 'text-[#9ca3af]'}`}>
              {message.time}
            </p>
          ) : null}
        </div>
      </div>
    );
  }

  if (message.variant === 'video') {
    return (
      <div className="flex justify-start">
        <div className="overflow-hidden rounded-[20px] rounded-bl-md bg-white shadow-[0_1px_2px_rgba(0,0,0,0.06)] ring-1 ring-[#ececf0]">
          <div className="relative aspect-video w-[min(100vw-6rem,360px)]">
            <img src={message.poster} alt="" className="h-full w-full object-cover" />
            <button
              type="button"
              aria-label={t('memberChat.playVideo')}
              className="absolute left-1/2 top-1/2 inline-flex size-14 -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/90 text-[#4048cd] shadow-lg"
            >
              <Play size={24} strokeWidth={2} aria-hidden="true" className="ml-0.5" />
            </button>
          </div>
          {message.time ? (
            <p className="px-4 py-2 text-[11px] text-[#9ca3af]">{message.time}</p>
          ) : null}
        </div>
      </div>
    );
  }

  if (message.variant === 'voice') {
    return (
      <div className="flex justify-end">
        <div className="inline-flex max-w-[min(100%,320px)] flex-col rounded-[20px] rounded-br-md bg-[#4048cd] px-4 py-3 text-white">
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label={t('memberChat.playVoice')}
              className="inline-flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full bg-white/15"
            >
              <Pause size={16} strokeWidth={2} aria-hidden="true" />
            </button>
            <VoiceWaveform active />
            <div className="shrink-0 text-right text-[11px] leading-4 text-white/80">
              <p>{message.elapsed}</p>
              <p>{message.duration}</p>
            </div>
          </div>
          <div className="mt-2 flex items-center justify-end gap-1 text-[11px] text-white/75">
            <span>{message.time}</span>
            {message.read ? <CheckCheck size={14} strokeWidth={2} aria-hidden="true" /> : null}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex ${isSent ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[min(100%,420px)] rounded-[20px] px-4 py-3 text-[14px] leading-6 ${
          isSent
            ? 'rounded-br-md bg-[#4048cd] text-white'
            : 'rounded-bl-md bg-white text-[#161c27] shadow-[0_1px_2px_rgba(0,0,0,0.06)] ring-1 ring-[#ececf0]'
        }`}
      >
        <p>{message.textKey ? t(message.textKey) : message.text}</p>
        <div
          className={`mt-1 flex items-center gap-1 text-[11px] ${
            isSent ? 'justify-end text-white/75' : 'text-[#9ca3af]'
          }`}
        >
          {message.time ? <span>{message.time}</span> : null}
          {isSent && message.read ? <CheckCheck size={14} strokeWidth={2} aria-hidden="true" /> : null}
        </div>
      </div>
    </div>
  );
});

ChatMessageBubble.displayName = 'ChatMessageBubble';

const ChatThreadHeader = memo(({ conversation }) => {
  const { t } = useTranslation();

  if (!conversation) return null;

  return (
    <header className="flex shrink-0 items-center justify-between gap-4 border-b border-[#ececf0] bg-white px-5 py-4">
      <div className="flex min-w-0 items-center gap-3">
        <img
          src={conversation.avatar}
          alt=""
          width={48}
          height={48}
          className="size-12 shrink-0 rounded-full object-cover"
        />
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="truncate text-[18px] font-semibold text-[#161c27]">{conversation.name}</h2>
            {conversation.online ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-[#ecfdf3] px-2 py-0.5 text-[11px] font-semibold text-[#16a34a]">
                <span className="size-1.5 rounded-full bg-[#22c55e]" aria-hidden="true" />
                {t('memberChat.online')}
              </span>
            ) : null}
          </div>
          <p className="truncate text-[13px] text-[#4048cd]">{conversation.handle}</p>
        </div>
      </div>
      <button
        type="button"
        aria-label={t('memberChat.moreActions')}
        className="inline-flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-xl text-[#6b7280] transition hover:bg-[#f3f4f6] hover:text-[#161c27]"
      >
        <MoreVertical size={20} strokeWidth={2} aria-hidden="true" />
      </button>
    </header>
  );
});

ChatThreadHeader.displayName = 'ChatThreadHeader';

const ChatComposer = memo(({ value, onChange, onSend, disabled }) => {
  const { t } = useTranslation();

  return (
    <div className="shrink-0 border-t border-[#ececf0] bg-white px-5 py-4">
      <div className="flex items-end gap-3 rounded-[24px] border border-[#ececf0] bg-white px-4 py-3 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
        <button
          type="button"
          aria-label={t('memberChat.attach')}
          className="inline-flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full text-[#6b7280] transition hover:bg-[#f3f4f6] hover:text-[#4048cd]"
        >
          <Paperclip size={18} strokeWidth={2} aria-hidden="true" />
        </button>
        <textarea
          rows={1}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={t('memberChat.inputPlaceholder')}
          disabled={disabled}
          className="max-h-28 min-h-[24px] flex-1 resize-none bg-transparent py-1 text-[14px] leading-6 text-[#161c27] placeholder:text-[#9ca3af] outline-none disabled:opacity-50"
        />
        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            aria-label={t('memberChat.emoji')}
            className="inline-flex size-9 cursor-pointer items-center justify-center rounded-full text-[#6b7280] transition hover:bg-[#f3f4f6] hover:text-[#4048cd]"
          >
            <Smile size={18} strokeWidth={2} aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label={t('memberChat.voice')}
            className="inline-flex size-9 cursor-pointer items-center justify-center rounded-full text-[#6b7280] transition hover:bg-[#f3f4f6] hover:text-[#4048cd]"
          >
            <Mic size={18} strokeWidth={2} aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label={t('memberChat.send')}
            disabled={disabled || !value.trim()}
            onClick={onSend}
            className="inline-flex size-10 cursor-pointer items-center justify-center rounded-full bg-[#4048cd] text-white transition hover:bg-[#363eb8] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Send size={18} strokeWidth={2} aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
});

ChatComposer.displayName = 'ChatComposer';

const ChatMessageArea = memo(({ conversation, messages, draft, onDraftChange, onSend }) => {
  const { t } = useTranslation();

  return (
    <section className="flex min-h-0 min-w-0 flex-1 flex-col bg-[#f8fafc]">
      <ChatThreadHeader conversation={conversation} />
      <div className="scrollbar-light flex-1 overflow-y-auto px-5 py-5">
        <div className="mx-auto flex max-w-[860px] flex-col gap-4">
          {messages.map((message, index) => (
            <ChatMessageBubble key={`${message.type}-${index}`} message={message} t={t} />
          ))}
        </div>
      </div>
      <ChatComposer
        value={draft}
        onChange={onDraftChange}
        onSend={onSend}
        disabled={!conversation}
      />
    </section>
  );
});

ChatMessageArea.displayName = 'ChatMessageArea';

export default ChatMessageArea;
