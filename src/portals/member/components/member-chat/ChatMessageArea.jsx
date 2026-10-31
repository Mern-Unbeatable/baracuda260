import {
  CheckCheck,
  Download,
  FileText,
  Image as ImageIcon,
  Loader2,
  Mic,
  MoreVertical,
  Paperclip,
  Pause,
  Play,
  Send,
  Smile,
  X,
} from 'lucide-react';
import React, { memo, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '@/components/ui/Button';
import Image from '@/components/ui/Image';

const formatFileSize = (bytes) => {
  if (!bytes || Number.isNaN(bytes)) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

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
          {message.labelKey ? t(message.labelKey) : message.text}
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
  const hasFile = Boolean(message.fileUrl || message.variant === 'file');
  const isImageFile =
    hasFile &&
    (message.fileType?.startsWith('image/') ||
      /\.(jpeg|jpg|png|webp|gif|svg)$/i.test(message.fileUrl || ''));
  const isVideoFile =
    message.variant === 'video' ||
    (hasFile &&
      (message.fileType?.startsWith('video/') ||
        /\.(mp4|webm|mov)$/i.test(message.fileUrl || '')));

  if (isImageFile) {
    return (
      <div className={`flex ${isSent ? 'justify-end' : 'justify-start'}`}>
        <div
          className={`max-w-[min(100%,360px)] overflow-hidden rounded-[20px] p-2 ${
            isSent
              ? 'rounded-br-md bg-[#4048cd] text-white'
              : 'rounded-bl-md bg-white text-[#161c27] shadow-[0_1px_2px_rgba(0,0,0,0.06)] ring-1 ring-[#ececf0]'
          }`}
        >
          <a
            href={message.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative block overflow-hidden rounded-2xl bg-black/5"
          >
            <img
              src={message.fileUrl}
              alt={message.fileName || 'Image attachment'}
              className="max-h-72 w-full object-cover transition duration-300 group-hover:scale-105"
            />
          </a>
          {message.text ? (
            <p className="px-2 pt-2 text-[14px] leading-6">{message.text}</p>
          ) : null}
          <div
            className={`flex items-center gap-1 px-2 pt-1 text-[11px] ${
              isSent ? 'justify-end text-white/75' : 'text-[#9ca3af]'
            }`}
          >
            {message.time ? <span>{message.time}</span> : null}
            {isSent && message.read ? (
              <CheckCheck size={14} strokeWidth={2} aria-hidden="true" />
            ) : null}
          </div>
        </div>
      </div>
    );
  }

  if (isVideoFile) {
    return (
      <div className={`flex ${isSent ? 'justify-end' : 'justify-start'}`}>
        <div
          className={`max-w-[min(100vw-6rem,360px)] overflow-hidden rounded-[20px] ${
            isSent
              ? 'rounded-br-md bg-[#4048cd] text-white'
              : 'rounded-bl-md bg-white shadow-[0_1px_2px_rgba(0,0,0,0.06)] ring-1 ring-[#ececf0]'
          }`}
        >
          {message.fileUrl ? (
            <video
              src={message.fileUrl}
              controls
              className="aspect-video w-full rounded-t-[20px] bg-black object-cover"
            />
          ) : (
            <div className="relative aspect-video w-[min(100vw-6rem,360px)]">
              <Image
                src={message.poster}
                alt=""
                className="h-full w-full object-cover"
              />
              <Button
                unstyled
                type="button"
                aria-label={t('memberChat.playVideo')}
                className="absolute left-1/2 top-1/2 inline-flex size-14 -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/90 text-[#4048cd] shadow-lg"
              >
                <Play
                  size={24}
                  strokeWidth={2}
                  aria-hidden="true"
                  className="ml-0.5"
                />
              </Button>
            </div>
          )}
          {message.text ? (
            <p className="px-4 pt-2 text-[14px]">{message.text}</p>
          ) : null}
          {message.time ? (
            <p
              className={`px-4 py-2 text-[11px] ${isSent ? 'text-white/75' : 'text-[#9ca3af]'}`}
            >
              {message.time}
            </p>
          ) : null}
        </div>
      </div>
    );
  }

  if (hasFile) {
    return (
      <div className={`flex ${isSent ? 'justify-end' : 'justify-start'}`}>
        <div
          className={`max-w-[min(100%,360px)] rounded-[20px] px-4 py-3 ${
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
            <div className="min-w-0 flex-1">
              <p className="truncate text-[14px] font-semibold">
                {message.fileName || 'Attachment'}
              </p>
              {message.fileSize ? (
                <p
                  className={`text-[12px] ${isSent ? 'text-white/75' : 'text-[#6b7280]'}`}
                >
                  {message.fileSize}
                </p>
              ) : null}
            </div>
            {message.fileUrl ? (
              <a
                href={message.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                download={message.fileName || 'file'}
                aria-label={t('memberChat.downloadFile')}
                className={`ml-auto inline-flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full transition ${
                  isSent
                    ? 'bg-white/20 text-white hover:bg-white/30'
                    : 'bg-[#4048cd] text-white hover:bg-[#363eb8]'
                }`}
              >
                <Download size={14} strokeWidth={2} aria-hidden="true" />
              </a>
            ) : null}
          </div>
          {message.text ? (
            <p className="mt-2 text-[14px] leading-6">{message.text}</p>
          ) : null}
          <div
            className={`mt-2 flex items-center gap-1 text-[11px] ${
              isSent ? 'justify-end text-white/70' : 'text-[#9ca3af]'
            }`}
          >
            {message.time ? <span>{message.time}</span> : null}
            {isSent && message.read ? (
              <CheckCheck size={14} strokeWidth={2} aria-hidden="true" />
            ) : null}
          </div>
        </div>
      </div>
    );
  }

  if (message.variant === 'voice') {
    return (
      <div className="flex justify-end">
        <div className="inline-flex max-w-[min(100%,320px)] flex-col rounded-[20px] rounded-br-md bg-[#4048cd] px-4 py-3 text-white">
          <div className="flex items-center gap-3">
            <Button
              unstyled
              type="button"
              aria-label={t('memberChat.playVoice')}
              className="inline-flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full bg-white/15"
            >
              <Pause size={16} strokeWidth={2} aria-hidden="true" />
            </Button>
            <VoiceWaveform active />
            <div className="shrink-0 text-right text-[11px] leading-4 text-white/80">
              <p>{message.elapsed}</p>
              <p>{message.duration}</p>
            </div>
          </div>
          <div className="mt-2 flex items-center justify-end gap-1 text-[11px] text-white/75">
            <span>{message.time}</span>
            {message.read ? (
              <CheckCheck size={14} strokeWidth={2} aria-hidden="true" />
            ) : null}
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
        <p className="whitespace-pre-wrap break-words">
          {message.textKey ? t(message.textKey) : message.text}
        </p>
        <div
          className={`mt-1 flex items-center gap-1 text-[11px] ${
            isSent ? 'justify-end text-white/75' : 'text-[#9ca3af]'
          }`}
        >
          {message.time ? <span>{message.time}</span> : null}
          {isSent && message.read ? (
            <CheckCheck size={14} strokeWidth={2} aria-hidden="true" />
          ) : null}
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
        <Image
          src={conversation.avatar}
          alt=""
          width={48}
          height={48}
          className="size-12 shrink-0 rounded-full object-cover"
        />
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="truncate text-[18px] font-semibold text-[#161c27]">
              {conversation.name}
            </h2>
            {conversation.online ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-[#ecfdf3] px-2 py-0.5 text-[11px] font-semibold text-[#16a34a]">
                <span
                  className="size-1.5 rounded-full bg-[#22c55e]"
                  aria-hidden="true"
                />
                {t('memberChat.online')}
              </span>
            ) : null}
          </div>
          <p className="truncate text-[13px] text-[#4048cd]">
            {conversation.handle}
          </p>
        </div>
      </div>
      <Button
        unstyled
        type="button"
        aria-label={t('memberChat.moreActions')}
        className="inline-flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-xl text-[#6b7280] transition hover:bg-[#f3f4f6] hover:text-[#161c27]"
      >
        <MoreVertical size={20} strokeWidth={2} aria-hidden="true" />
      </Button>
    </header>
  );
});

ChatThreadHeader.displayName = 'ChatThreadHeader';

const ChatComposer = memo(
  ({
    value,
    onChange,
    onSend,
    disabled,
    selectedFile,
    onFileSelect,
    onFileRemove,
    isSending,
  }) => {
    const { t } = useTranslation();
    const fileInputRef = useRef(null);

    const handleKeyDown = (event) => {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        if (!disabled && !isSending && (value.trim() || selectedFile)) {
          onSend();
        }
      }
    };

    return (
      <div className="shrink-0 border-t border-[#ececf0] bg-white px-5 py-4">
        {selectedFile ? (
          <div className="mb-2 flex items-center justify-between gap-2 rounded-xl border border-[#c7d2fe] bg-[#f5f7ff] px-3.5 py-2 text-[12px] text-[#4048cd]">
            <div className="flex min-w-0 items-center gap-2">
              {selectedFile.type?.startsWith('image/') ? (
                <ImageIcon size={16} className="shrink-0 text-[#4048cd]" />
              ) : (
                <FileText size={16} className="shrink-0 text-[#4048cd]" />
              )}
              <span className="truncate font-semibold text-[#161c27]">
                {selectedFile.name}
              </span>
              <span className="shrink-0 text-[#6b7280]">
                ({formatFileSize(selectedFile.size)})
              </span>
            </div>
            <button
              type="button"
              onClick={onFileRemove}
              className="inline-flex size-6 cursor-pointer items-center justify-center rounded-full text-[#6b7280] transition hover:bg-[#e0e7ff] hover:text-[#dc2626]"
              aria-label="Remove attachment"
            >
              <X size={14} />
            </button>
          </div>
        ) : null}

        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) {
              onFileSelect?.(file);
            }
            event.target.value = '';
          }}
        />

        <div className="flex items-end gap-3 rounded-[24px] border border-[#ececf0] bg-white px-4 py-3 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
          <Button
            unstyled
            type="button"
            aria-label={t('memberChat.attach')}
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled || isSending}
            className="inline-flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full text-[#6b7280] transition hover:bg-[#f3f4f6] hover:text-[#4048cd] disabled:opacity-40"
          >
            <Paperclip size={18} strokeWidth={2} aria-hidden="true" />
          </Button>

          <textarea
            rows={1}
            value={value}
            onChange={(event) => onChange(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t('memberChat.inputPlaceholder')}
            disabled={disabled || isSending}
            className="max-h-28 min-h-[24px] flex-1 resize-none bg-transparent py-1 text-[14px] leading-6 text-[#161c27] placeholder:text-[#9ca3af] outline-none disabled:opacity-50"
          />

          <div className="flex shrink-0 items-center gap-1">
            <Button
              unstyled
              type="button"
              aria-label={t('memberChat.emoji')}
              className="inline-flex size-9 cursor-pointer items-center justify-center rounded-full text-[#6b7280] transition hover:bg-[#f3f4f6] hover:text-[#4048cd]"
            >
              <Smile size={18} strokeWidth={2} aria-hidden="true" />
            </Button>
            <Button
              unstyled
              type="button"
              aria-label={t('memberChat.voice')}
              className="inline-flex size-9 cursor-pointer items-center justify-center rounded-full text-[#6b7280] transition hover:bg-[#f3f4f6] hover:text-[#4048cd]"
            >
              <Mic size={18} strokeWidth={2} aria-hidden="true" />
            </Button>
            <Button
              unstyled
              type="button"
              aria-label={t('memberChat.send')}
              disabled={
                disabled || isSending || (!value.trim() && !selectedFile)
              }
              onClick={onSend}
              className="inline-flex size-10 cursor-pointer items-center justify-center rounded-full bg-[#4048cd] text-white transition hover:bg-[#363eb8] disabled:cursor-not-allowed disabled:opacity-40"
            >
              {isSending ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Send size={18} strokeWidth={2} aria-hidden="true" />
              )}
            </Button>
          </div>
        </div>
      </div>
    );
  },
);

ChatComposer.displayName = 'ChatComposer';

const ChatMessageArea = memo(
  ({
    conversation,
    messages,
    draft,
    onDraftChange,
    onSend,
    selectedFile,
    onFileSelect,
    onFileRemove,
    isSending,
    isLoadingMessages,
  }) => {
    const { t } = useTranslation();
    const messagesEndRef = useRef(null);

    useEffect(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages.length]);

    return (
      <section className="flex min-h-0 min-w-0 flex-1 flex-col bg-[#f8fafc]">
        <ChatThreadHeader conversation={conversation} />

        <div className="scrollbar-light flex-1 overflow-y-auto px-5 py-5">
          <div className="mx-auto flex max-w-[860px] flex-col gap-4">
            {isLoadingMessages ? (
              <div className="flex items-center justify-center py-12 text-[#9ca3af]">
                <Loader2 size={24} className="animate-spin mr-2" />
                <span className="text-[14px]">Loading messages...</span>
              </div>
            ) : messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center text-[#9ca3af]">
                <p className="text-[14px] font-medium text-[#6b7280]">
                  No messages yet
                </p>
                <p className="mt-1 text-[13px]">
                  Send a message or attach a file to start the conversation!
                </p>
              </div>
            ) : (
              messages.map((message, index) => (
                <ChatMessageBubble
                  key={message.id || `${message.type}-${index}`}
                  message={message}
                  t={t}
                />
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        <ChatComposer
          value={draft}
          onChange={onDraftChange}
          onSend={onSend}
          disabled={!conversation}
          selectedFile={selectedFile}
          onFileSelect={onFileSelect}
          onFileRemove={onFileRemove}
          isSending={isSending}
        />
      </section>
    );
  },
);

ChatMessageArea.displayName = 'ChatMessageArea';

export default ChatMessageArea;
