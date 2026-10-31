import {
  Check,
  CheckCheck,
  Copy,
  Download,
  FileText,
  Image as ImageIcon,
  Loader2,
  Mic,
  MoreHorizontal,
  Paperclip,
  Pause,
  Pencil,
  Play,
  Send,
  Smile,
  Trash2,
  X,
} from 'lucide-react';
import React, { memo, useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
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

/**
 * Facebook-style message action menu popover
 */
const FacebookMessageMenu = memo(
  ({
    isSent,
    canEdit,
    onEdit,
    onCopy,
    onDelete,
    isOpen,
    onToggle,
    onClose,
  }) => {
    const menuRef = useRef(null);

    useEffect(() => {
      if (!isOpen) return;
      const handleClickOutside = (e) => {
        if (menuRef.current && !menuRef.current.contains(e.target)) {
          onClose();
        }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () =>
        document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen, onClose]);

    return (
      <div className="relative shrink-0 self-center" ref={menuRef}>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggle();
          }}
          title="More"
          className={`flex size-7 items-center justify-center rounded-full border border-gray-200 bg-white/95 text-gray-500 shadow-sm transition hover:bg-gray-100 hover:text-gray-800 cursor-pointer ${
            isOpen
              ? 'opacity-100 ring-2 ring-[#4048cd]/20'
              : 'opacity-0 group-hover:opacity-100'
          }`}
          aria-label="Message actions"
        >
          <MoreHorizontal size={15} />
        </button>

        {isOpen && (
          <div
            className={`absolute z-30 min-w-36 overflow-hidden rounded-xl border border-gray-100 bg-white p-1 shadow-xl animate-in fade-in zoom-in-95 duration-100 ${
              isSent ? 'right-0 top-full mt-1' : 'left-0 top-full mt-1'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {canEdit && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onEdit();
                }}
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-[13px] font-medium text-gray-700 hover:bg-gray-50 transition cursor-pointer"
              >
                <Pencil size={14} className="text-gray-500" />
                <span>Edit</span>
              </button>
            )}

            {onCopy && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onCopy();
                }}
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-[13px] font-medium text-gray-700 hover:bg-gray-50 transition cursor-pointer"
              >
                <Copy size={14} className="text-gray-500" />
                <span>Copy text</span>
              </button>
            )}

            {isSent && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onDelete();
                }}
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-[13px] font-medium text-red-600 hover:bg-red-50 transition cursor-pointer"
              >
                <Trash2 size={14} className="text-red-500" />
                <span>Unsend</span>
              </button>
            )}
          </div>
        )}
      </div>
    );
  },
);

FacebookMessageMenu.displayName = 'FacebookMessageMenu';

/**
 * Facebook-style Unsend confirmation modal
 */
const FacebookUnsendModal = memo(({ open, onClose, onConfirm, isDeleting }) => {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="unsend-modal-title"
    >
      <div
        className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl transition animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <h3
            id="unsend-modal-title"
            className="text-[17px] font-bold text-gray-900"
          >
            Unsend message?
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition cursor-pointer"
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>
        </div>

        <p className="py-4 text-[14px] leading-5 text-gray-600">
          This will permanently remove the message for everyone in this chat.
          Others may have already seen it.
        </p>

        <div className="flex items-center justify-end gap-2.5 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="rounded-xl px-4 py-2 text-[13px] font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-[13px] font-semibold text-white bg-[#dc2626] hover:bg-[#b91c1c] transition shadow-xs cursor-pointer disabled:opacity-50"
          >
            {isDeleting ? <Loader2 size={15} className="animate-spin" /> : null}
            <span>Unsend</span>
          </button>
        </div>
      </div>
    </div>
  );
});

FacebookUnsendModal.displayName = 'FacebookUnsendModal';

/**
 * Facebook-style inline message editor
 */
const InlineMessageEditor = memo(
  ({ value, onChange, onSave, onCancel, isSaving }) => {
    const textareaRef = useRef(null);

    useEffect(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(
          textareaRef.current.value.length,
          textareaRef.current.value.length,
        );
      }
    }, []);

    const handleKeyDown = (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        if (value.trim()) onSave();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onCancel();
      }
    };

    return (
      <div className="w-full max-w-[min(100%,460px)] rounded-2xl border-2 border-[#4048cd] bg-white p-3 shadow-lg transition">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={Math.min(5, Math.max(2, (value.match(/\n/g) || []).length + 1))}
          className="w-full resize-none bg-transparent text-[14px] leading-6 text-gray-900 outline-none"
          placeholder="Edit message..."
          disabled={isSaving}
        />
        <div className="mt-2 flex flex-wrap items-center justify-between gap-2 border-t border-gray-100 pt-2 text-[11px] text-gray-400">
          <span>Escape to cancel · Enter to save</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onCancel}
              disabled={isSaving}
              className="rounded-lg px-2.5 py-1 font-semibold text-gray-600 hover:bg-gray-100 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onSave}
              disabled={!value.trim() || isSaving}
              className="inline-flex items-center gap-1 rounded-lg bg-[#4048cd] px-3.5 py-1 font-semibold text-white hover:bg-[#343bb7] transition disabled:opacity-40 cursor-pointer"
            >
              {isSaving ? <Loader2 size={13} className="animate-spin" /> : null}
              <span>Save</span>
            </button>
          </div>
        </div>
      </div>
    );
  },
);

InlineMessageEditor.displayName = 'InlineMessageEditor';

const ChatMessageBubble = memo(
  ({
    message,
    t,
    onStartEdit,
    onOpenUnsend,
    editingMessage,
    draft,
    onDraftChange,
    onSend,
    onCancelEdit,
    isSending,
    activeMenuId,
    setActiveMenuId,
  }) => {
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
        <div className="flex justify-start py-1">
          <div className="inline-flex items-center gap-1 rounded-[20px] rounded-bl-md bg-white px-4 py-3 shadow-[0_1px_2px_rgba(0,0,0,0.06)] ring-1 ring-[#ececf0]">
            <span className="size-1.5 animate-bounce rounded-full bg-[#9ca3af] [animation-delay:0ms]" />
            <span className="size-1.5 animate-bounce rounded-full bg-[#9ca3af] [animation-delay:120ms]" />
            <span className="size-1.5 animate-bounce rounded-full bg-[#9ca3af] [animation-delay:240ms]" />
          </div>
        </div>
      );
    }

    const isSent = message.type === 'sent';
    const isDeleted = Boolean(message.isDeleted);
    const isEdited = Boolean(message.isEdited);
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

    const isEditingThis = editingMessage?.id === message.id;

    const handleCopy = (text) => {
      if (!text) return;
      navigator.clipboard.writeText(text);
      toast.success('Copied to clipboard');
    };

    // Facebook-style deleted message state
    if (isDeleted) {
      return (
        <div
          className={`flex ${isSent ? 'justify-end' : 'justify-start'} py-1`}
        >
          <div
            className={`max-w-[min(100%,380px)] rounded-[18px] px-3.5 py-2 text-[13px] italic border ${
              isSent
                ? 'rounded-br-md border-gray-200 bg-gray-50/60 text-gray-400'
                : 'rounded-bl-md border-gray-200 bg-gray-50/60 text-gray-400'
            }`}
          >
            <p>{isSent ? 'You unsent a message' : 'Message was unsent'}</p>
          </div>
        </div>
      );
    }

    const actionMenu = (
      <FacebookMessageMenu
        isSent={isSent}
        canEdit={isSent && Boolean(message.text) && !hasFile}
        onEdit={() => onStartEdit?.(message)}
        onCopy={message.text ? () => handleCopy(message.text) : null}
        onDelete={() => onOpenUnsend?.(message.id)}
        isOpen={activeMenuId === message.id}
        onToggle={() =>
          setActiveMenuId(activeMenuId === message.id ? null : message.id)
        }
        onClose={() => setActiveMenuId(null)}
      />
    );

    // Image Message
    if (isImageFile) {
      return (
        <div
          className={`group flex items-center gap-1.5 py-1 ${
            isSent ? 'justify-end flex-row' : 'justify-start flex-row'
          }`}
        >
          {isSent ? actionMenu : null}
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
              className={`flex items-center gap-1.5 px-2 pt-1 text-[11px] ${
                isSent ? 'justify-end text-white/75' : 'text-[#9ca3af]'
              }`}
            >
              {isEdited ? (
                <span className="italic opacity-80 text-[10px]">(edited)</span>
              ) : null}
              {message.time ? <span>{message.time}</span> : null}
              {isSent && message.read ? (
                <CheckCheck size={14} strokeWidth={2} aria-hidden="true" />
              ) : null}
            </div>
          </div>
          {!isSent ? actionMenu : null}
        </div>
      );
    }

    // Video Message
    if (isVideoFile) {
      return (
        <div
          className={`group flex items-center gap-1.5 py-1 ${
            isSent ? 'justify-end flex-row' : 'justify-start flex-row'
          }`}
        >
          {isSent ? actionMenu : null}
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
            <div
              className={`flex items-center gap-1.5 px-4 py-2 text-[11px] ${
                isSent ? 'justify-end text-white/75' : 'text-[#9ca3af]'
              }`}
            >
              {isEdited ? (
                <span className="italic opacity-80 text-[10px]">(edited)</span>
              ) : null}
              {message.time ? <span>{message.time}</span> : null}
            </div>
          </div>
          {!isSent ? actionMenu : null}
        </div>
      );
    }

    // Generic File Attachment
    if (hasFile) {
      return (
        <div
          className={`group flex items-center gap-1.5 py-1 ${
            isSent ? 'justify-end flex-row' : 'justify-start flex-row'
          }`}
        >
          {isSent ? actionMenu : null}
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
              className={`mt-2 flex items-center gap-1.5 text-[11px] ${
                isSent ? 'justify-end text-white/70' : 'text-[#9ca3af]'
              }`}
            >
              {isEdited ? (
                <span className="italic opacity-80 text-[10px]">(edited)</span>
              ) : null}
              {message.time ? <span>{message.time}</span> : null}
              {isSent && message.read ? (
                <CheckCheck size={14} strokeWidth={2} aria-hidden="true" />
              ) : null}
            </div>
          </div>
          {!isSent ? actionMenu : null}
        </div>
      );
    }

    // Voice Message
    if (message.variant === 'voice') {
      return (
        <div className="flex justify-end py-1">
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

    // Standard Text Message
    return (
      <div
        className={`group flex items-center gap-1.5 py-1 ${
          isSent ? 'justify-end flex-row' : 'justify-start flex-row'
        }`}
      >
        {isSent && !isEditingThis ? actionMenu : null}

        {isEditingThis ? (
          <InlineMessageEditor
            value={draft}
            onChange={onDraftChange}
            onSave={onSend}
            onCancel={onCancelEdit}
            isSaving={isSending}
          />
        ) : (
          <div
            className={`max-w-[min(100%,420px)] rounded-[20px] px-4 py-2.5 text-[14px] leading-6 transition ${
              isSent
                ? 'rounded-br-md bg-[#4048cd] text-white shadow-xs'
                : 'rounded-bl-md bg-white text-[#161c27] shadow-[0_1px_2px_rgba(0,0,0,0.06)] ring-1 ring-[#ececf0]'
            }`}
          >
            <p className="whitespace-pre-wrap break-words">
              {message.textKey ? t(message.textKey) : message.text}
            </p>
            <div
              className={`mt-1 flex items-center gap-1.5 text-[11px] ${
                isSent ? 'justify-end text-white/75' : 'text-[#9ca3af]'
              }`}
            >
              {isEdited ? (
                <span className="italic opacity-80 text-[10px]">(edited)</span>
              ) : null}
              {message.time ? <span>{message.time}</span> : null}
              {isSent && message.read ? (
                <CheckCheck size={14} strokeWidth={2} aria-hidden="true" />
              ) : null}
            </div>
          </div>
        )}

        {!isSent ? actionMenu : null}
      </div>
    );
  },
);

ChatMessageBubble.displayName = 'ChatMessageBubble';

const ChatThreadHeader = memo(({ conversation }) => {
  const { t } = useTranslation();

  if (!conversation) return null;

  return (
    <div className="flex h-18 shrink-0 items-center justify-between border-b border-[#ececf0] bg-white px-6">
      <div className="flex items-center gap-3">
        <div className="relative">
          <Image
            src={conversation.avatar}
            alt={conversation.name}
            width={44}
            height={44}
            className="size-11 rounded-full object-cover"
          />
          {conversation.online ? (
            <span
              className="absolute bottom-0 right-0 size-3 rounded-full border-2 border-white bg-[#10b981]"
              aria-label={t('memberChat.online')}
            />
          ) : null}
        </div>
        <div>
          <h2 className="text-[16px] font-semibold text-[#161c27]">
            {conversation.name}
          </h2>
          <p className="text-[12px] text-[#6b7280]">
            {conversation.online
              ? t('memberChat.online')
              : conversation.subtitle || t('memberChat.offline')}
          </p>
        </div>
      </div>
    </div>
  );
});

ChatThreadHeader.displayName = 'ChatThreadHeader';

const ChatComposer = memo(
  ({
    value,
    onChange,
    onSend,
    disabled = false,
    selectedFile,
    onFileSelect,
    onFileRemove,
    isSending = false,
    editingMessage,
    onCancelEdit,
  }) => {
    const { t } = useTranslation();
    const fileInputRef = useRef(null);
    const textareaRef = useRef(null);

    const isEditing = Boolean(editingMessage);

    const handleKeyDown = (event) => {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        onSend?.();
      } else if (event.key === 'Escape' && isEditing) {
        event.preventDefault();
        onCancelEdit?.();
      }
    };

    return (
      <div className="border-t border-[#ececf0] bg-white px-5 py-4">
        {/* Facebook-style Edit Banner */}
        {isEditing ? (
          <div className="mb-2 flex items-center justify-between gap-3 rounded-xl border border-[#c7d2fe] bg-[#f5f7ff] px-3.5 py-2 text-[12px] text-[#4048cd] animate-in fade-in duration-150">
            <div className="flex min-w-0 items-center gap-2">
              <Pencil size={14} className="shrink-0 text-[#4048cd]" />
              <span className="font-semibold text-[#312e81]">
                Editing message:
              </span>
              <span className="truncate italic text-[#4338ca] max-w-sm">
                "{editingMessage.text}"
              </span>
            </div>
            <button
              type="button"
              onClick={onCancelEdit}
              className="rounded-full p-1 text-[#4338ca] hover:bg-[#e0e7ff] transition cursor-pointer"
              aria-label="Cancel editing"
            >
              <X size={15} />
            </button>
          </div>
        ) : null}

        {/* Selected file preview */}
        {selectedFile && !isEditing ? (
          <div className="mb-2 flex items-center justify-between gap-2 rounded-xl border border-[#c7d2fe] bg-[#f5f7ff] px-3.5 py-2 text-[12px] text-[#4048cd] animate-in fade-in duration-150">
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

        <div
          className={`flex items-end gap-3 rounded-[24px] border bg-white px-4 py-3 shadow-[0_2px_12px_rgba(0,0,0,0.04)] transition ${
            isEditing
              ? 'border-[#4048cd] ring-2 ring-[#4048cd]/10'
              : 'border-[#ececf0]'
          }`}
        >
          {!isEditing ? (
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
          ) : null}

          <textarea
            ref={textareaRef}
            rows={1}
            value={value}
            onChange={(event) => onChange(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              isEditing
                ? 'Edit your message (Press Enter to save, Esc to cancel)...'
                : t('memberChat.inputPlaceholder')
            }
            disabled={disabled || isSending}
            className="max-h-28 min-h-[24px] flex-1 resize-none bg-transparent py-1 text-[14px] leading-6 text-[#161c27] placeholder:text-[#9ca3af] outline-none disabled:opacity-50"
          />

          <div className="flex shrink-0 items-center gap-1">
            {!isEditing ? (
              <>
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
              </>
            ) : null}
            <Button
              unstyled
              type="button"
              aria-label={isEditing ? 'Save edit' : t('memberChat.send')}
              disabled={
                disabled ||
                isSending ||
                (!value.trim() && !selectedFile && !isEditing)
              }
              onClick={onSend}
              className={`inline-flex size-10 cursor-pointer items-center justify-center rounded-full text-white transition disabled:cursor-not-allowed disabled:opacity-40 ${
                isEditing
                  ? 'bg-[#16a34a] hover:bg-[#15803d]'
                  : 'bg-[#4048cd] hover:bg-[#363eb8]'
              }`}
            >
              {isSending ? (
                <Loader2 size={18} className="animate-spin" />
              ) : isEditing ? (
                <Check size={18} strokeWidth={2} aria-hidden="true" />
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
    editingMessage,
    onStartEdit,
    onCancelEdit,
    onDeleteMessage,
  }) => {
    const { t } = useTranslation();
    const messagesEndRef = useRef(null);
    const [unsendTargetId, setUnsendTargetId] = useState(null);
    const [activeMenuId, setActiveMenuId] = useState(null);

    useEffect(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages.length]);

    const handleConfirmUnsend = () => {
      if (unsendTargetId) {
        onDeleteMessage?.(unsendTargetId);
        setUnsendTargetId(null);
      }
    };

    return (
      <section className="flex min-h-0 min-w-0 flex-1 flex-col bg-[#f8fafc]">
        <ChatThreadHeader conversation={conversation} />

        <div
          className="scrollbar-light flex-1 overflow-y-auto px-5 py-5"
          onClick={() => setActiveMenuId(null)}
        >
          <div className="mx-auto flex max-w-[860px] flex-col gap-3">
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
                  onStartEdit={onStartEdit}
                  onOpenUnsend={(id) => setUnsendTargetId(id)}
                  editingMessage={editingMessage}
                  draft={draft}
                  onDraftChange={onDraftChange}
                  onSend={onSend}
                  onCancelEdit={onCancelEdit}
                  isSending={isSending}
                  activeMenuId={activeMenuId}
                  setActiveMenuId={setActiveMenuId}
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
          editingMessage={editingMessage}
          onCancelEdit={onCancelEdit}
        />

        {/* Facebook-style Unsend Dialog */}
        <FacebookUnsendModal
          open={Boolean(unsendTargetId)}
          onClose={() => setUnsendTargetId(null)}
          onConfirm={handleConfirmUnsend}
          isDeleting={isSending}
        />
      </section>
    );
  },
);

ChatMessageArea.displayName = 'ChatMessageArea';

export default ChatMessageArea;
