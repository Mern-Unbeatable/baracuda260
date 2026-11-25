import {
  ArrowLeft,
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
  Reply,
  Send,
  Smile,
  Square,
  Trash2,
  X,
} from 'lucide-react';
import React, { memo, useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import Button from '@/components/ui/Button';
import Image from '@/components/ui/Image';

const pickSupportedAudioMime = () => {
  if (typeof MediaRecorder === 'undefined') return '';
  const candidates = [
    'audio/webm;codecs=opus',
    'audio/webm',
    'audio/mp4',
    'audio/ogg;codecs=opus',
    'audio/ogg',
  ];
  return candidates.find((type) => MediaRecorder.isTypeSupported(type)) || '';
};

const formatRecordingTime = (totalSeconds) => {
  const mins = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, '0');
  const secs = Math.floor(totalSeconds % 60)
    .toString()
    .padStart(2, '0');
  return `${mins}:${secs}`;
};

const EVERYDAY_EMOJIS = [
  '😀',
  '😃',
  '😄',
  '😁',
  '😆',
  '😅',
  '😂',
  '🤣',
  '😊',
  '😇',
  '🙂',
  '😉',
  '😌',
  '😍',
  '🥰',
  '😘',
  '😗',
  '😙',
  '😚',
  '😋',
  '😛',
  '😝',
  '😜',
  '🤪',
  '🤨',
  '🧐',
  '🤓',
  '😎',
  '🤩',
  '🥳',
  '😏',
  '😒',
  '😞',
  '😔',
  '😟',
  '😕',
  '🙁',
  '☹️',
  '😣',
  '😖',
  '😫',
  '😩',
  '🥺',
  '😢',
  '😭',
  '😤',
  '😠',
  '😡',
  '🤬',
  '🤯',
  '😳',
  '🥵',
  '🥶',
  '😱',
  '😨',
  '😰',
  '😥',
  '😓',
  '🤗',
  '🤔',
  '🤭',
  '🤫',
  '🤥',
  '😶',
  '😐',
  '😑',
  '😬',
  '🙄',
  '😯',
  '😦',
  '😧',
  '😮',
  '😲',
  '🥱',
  '😴',
  '🤤',
  '😪',
  '😵',
  '🤐',
  '🥴',
  '🤢',
  '🤮',
  '🤧',
  '😷',
  '🤒',
  '🤕',
  '🤑',
  '🤠',
  '😈',
  '👿',
  '👻',
  '💀',
  '☠️',
  '👽',
  '🤖',
  '💩',
  '😺',
  '😸',
  '😹',
  '😻',
  '👍',
  '👎',
  '👏',
  '🙌',
  '🤝',
  '✌️',
  '🤞',
  '🤟',
  '🤘',
  '👌',
  '🤌',
  '🤏',
  '👈',
  '👉',
  '👆',
  '👇',
  '☝️',
  '👋',
  '🤚',
  '🖐️',
  '✋',
  '🖖',
  '👊',
  '✊',
  '🤛',
  '🤜',
  '💪',
  '🙏',
  '🫶',
  '❤️',
  '🧡',
  '💛',
  '💚',
  '💙',
  '💜',
  '🖤',
  '🤍',
  '🤎',
  '💔',
  '❣️',
  '💕',
  '💞',
  '💓',
  '💗',
  '💖',
  '💘',
  '💝',
  '🔥',
  '✨',
  '⭐',
  '🌟',
  '💯',
  '✅',
  '❌',
  '⚠️',
  '🎉',
  '🎊',
  '🎈',
  '🎁',
  '🏆',
  '🥇',
  '🥈',
  '🥉',
  '☀️',
  '🌙',
  '⭐️',
  '🌈',
  '☁️',
  '⚡',
  '❄️',
  '🌸',
  '🌹',
  '🍀',
  '🍕',
  '🍔',
  '🍟',
  '🌮',
  '🍣',
  '🍩',
  '🍪',
  '🎂',
  '☕',
  '🍵',
  '🍺',
  '🍻',
  '🍷',
  '🍸',
  '🏠',
  '🚗',
  '✈️',
  '🚀',
  '⏰',
  '📱',
  '💻',
  '📷',
  '🎵',
  '🎧',
  '🎬',
  '🎮',
  '📎',
  '📌',
  '📍',
  '💡',
  '🔑',
  '🔒',
  '🐶',
  '🐱',
  '🐭',
  '🐹',
  '🐰',
  '🦊',
  '🐻',
  '🐼',
  '🐨',
  '🐯',
  '🦁',
  '🐮',
];

const EmojiPickerModal = memo(({ open, onClose, onSelect }) => {
  const { t } = useTranslation();
  const titleId = useId();

  useEffect(() => {
    if (!open) return undefined;
    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose?.();
    };
    document.addEventListener('keydown', onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      className="fixed inset-0 z-50 flex items-end justify-center p-3 sm:items-center sm:p-6"
    >
      <button
        type="button"
        className="absolute inset-0 bg-[#0f172a]/45 backdrop-blur-[2px]"
        onClick={onClose}
        aria-label={t('common.close', 'Close')}
      />
      <div className="relative z-10 flex max-h-[min(78vh,560px)] w-full max-w-[420px] flex-col overflow-hidden rounded-2xl border border-[#e8eaef] bg-white shadow-[0_24px_64px_-16px_rgba(15,23,42,0.28)]">
        <header className="flex items-center justify-between gap-3 border-b border-[#eceef3] px-4 py-3.5 sm:px-5">
          <div>
            <h2
              id={titleId}
              className="text-[16px] font-bold tracking-[-0.2px] text-[#161c27]"
            >
              {t('memberChat.emojiPickerTitle', 'Emojis')}
            </h2>
            <p className="mt-0.5 text-[12px] text-[#6b7280]">
              {t(
                'memberChat.emojiPickerHint',
                'Tap to add. You can select multiple.',
              )}
            </p>
          </div>
          <Button
            unstyled
            type="button"
            onClick={onClose}
            className="inline-flex size-8 cursor-pointer items-center justify-center rounded-lg text-[#6b7280] transition hover:bg-[#f3f4f6] hover:text-[#161c27]"
            aria-label={t('common.close', 'Close')}
          >
            <X size={18} />
          </Button>
        </header>

        <div className="scrollbar-light grid grid-cols-7 gap-1.5 overflow-y-auto p-3 sm:grid-cols-8 sm:gap-2 sm:p-4">
          {EVERYDAY_EMOJIS.map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => onSelect?.(emoji)}
              className="inline-flex aspect-square cursor-pointer items-center justify-center rounded-xl text-[28px] transition hover:bg-[#f3f4f6] active:scale-95 sm:text-[30px]"
              aria-label={t('memberChat.insertEmoji', 'Insert {{emoji}}', {
                emoji,
              })}
            >
              {emoji}
            </button>
          ))}
        </div>

        <footer className="flex items-center justify-end border-t border-[#eceef3] bg-[#fafbfc] px-4 py-3 sm:px-5">
          <Button
            unstyled
            type="button"
            onClick={onClose}
            className="inline-flex h-9 cursor-pointer items-center rounded-xl bg-[#4048cd] px-4 text-[13px] font-semibold text-white transition hover:bg-[#343bb0]"
          >
            {t('common.done', 'Done')}
          </Button>
        </footer>
      </div>
    </div>,
    document.body,
  );
});

EmojiPickerModal.displayName = 'EmojiPickerModal';

const formatFileSize = (bytes) => {
  if (!bytes || Number.isNaN(bytes)) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

/** Detect emoji-only chat messages so we can render them larger. */
const getEmojiOnlyScale = (rawText) => {
  const text = String(rawText || '').trim();
  if (!text) return null;

  // Strip variation selectors / ZWJ / spaces for counting "emoji units"
  const withoutModifiers = text.replace(/[\uFE0F\u200D\s]/g, '');
  if (!withoutModifiers) return null;

  // Reject if any letters/digits/common punctuation remain
  if (/[A-Za-z0-9@#$%&*_=+\[\]{}\\|;:"'<>,.?/~`!]/.test(withoutModifiers)) {
    return null;
  }

  const emojiMatches = text.match(
    /\p{Extended_Pictographic}(?:\uFE0F|\u200D\p{Extended_Pictographic})*/gu,
  );
  if (!emojiMatches?.length) return null;

  // Ensure the message is only those emoji graphemes (+ whitespace)
  const rebuilt = emojiMatches.join('');
  if (text.replace(/\s+/g, '') !== rebuilt.replace(/\s+/g, '')) return null;

  const count = emojiMatches.length;
  if (count <= 2) return 'text-[40px] leading-none sm:text-[44px]';
  if (count <= 6) return 'text-[32px] leading-snug sm:text-[36px]';
  return 'text-[24px] leading-snug sm:text-[28px]';
};

const getReplyPreviewLabel = (message) => {
  if (!message) return 'Message';
  if (message.isDeleted) return 'Original message was unsent';
  const text = String(message.text || message.content || '').trim();
  if (text) return text;
  const fileType = String(message.fileType || '').toLowerCase();
  if (
    fileType === 'image' ||
    fileType.startsWith('image/') ||
    /\.(jpeg|jpg|png|webp|gif|svg)$/i.test(message.fileUrl || '')
  ) {
    return 'Photo';
  }
  if (
    fileType === 'video' ||
    fileType.startsWith('video/') ||
    /\.(mp4|webm|mov)$/i.test(message.fileUrl || '')
  ) {
    return 'Video';
  }
  if (
    fileType === 'audio' ||
    fileType.startsWith('audio/') ||
    /\.(webm|ogg|mp3|m4a|wav|aac)$/i.test(
      message.fileUrl || message.fileName || '',
    )
  ) {
    return 'Voice message';
  }
  if (message.fileUrl || message.fileName) {
    return message.fileName || 'Attachment';
  }
  return 'Message';
};

const getReplyAuthorLabel = (message, currentUserId) => {
  if (!message) return 'Message';
  const senderId = message.senderId || message.sender?.id;
  if (senderId && currentUserId && String(senderId) === String(currentUserId)) {
    return 'You';
  }
  if (message.type === 'sent') return 'You';
  return (
    message.sender?.name ||
    message.sender?.username ||
    'Message'
  );
};

const InlineReplyQuote = memo(({ replyTo, isSent, currentUserId }) => {
  if (!replyTo) return null;
  const author = getReplyAuthorLabel(replyTo, currentUserId);
  const preview = getReplyPreviewLabel(replyTo);

  return (
    <div
      className={`mb-2 rounded-xl border-l-4 px-2.5 py-1.5 text-left ${
        isSent
          ? 'border-white/70 bg-white/15 text-white/90'
          : 'border-[#4048cd] bg-[#f3f4ff] text-[#494453]'
      }`}
    >
      <p
        className={`truncate text-[11px] font-semibold ${
          isSent ? 'text-white' : 'text-[#4048cd]'
        }`}
      >
        {author}
      </p>
      <p className="truncate text-[12px] leading-4 opacity-90">{preview}</p>
    </div>
  );
});

InlineReplyQuote.displayName = 'InlineReplyQuote';

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
 * Message action menu — portaled + flips above near the composer so it isn't clipped.
 */
const FacebookMessageMenu = memo(
  ({
    isSent,
    canEdit,
    onEdit,
    onReply,
    onCopy,
    onDelete,
    isOpen,
    onToggle,
    onClose,
  }) => {
    const buttonWrapRef = useRef(null);
    const buttonRef = useRef(null);
    const menuRef = useRef(null);
    const [placement, setPlacement] = useState(null);

    useEffect(() => {
      if (!isOpen) return undefined;
      const handleClickOutside = (e) => {
        const inButton = buttonWrapRef.current?.contains(e.target);
        const inMenu = menuRef.current?.contains(e.target);
        if (!inButton && !inMenu) onClose();
      };
      const handleKeyDown = (e) => {
        if (e.key === 'Escape') onClose();
      };
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('keydown', handleKeyDown);
      };
    }, [isOpen, onClose]);

    useEffect(() => {
      if (!isOpen || !buttonRef.current) {
        setPlacement(null);
        return undefined;
      }

      const updatePosition = () => {
        const rect = buttonRef.current.getBoundingClientRect();
        const menuHeight = menuRef.current?.offsetHeight || 140;
        const menuWidth = menuRef.current?.offsetWidth || 148;
        const gap = 6;
        const margin = 8;
        const spaceBelow = window.innerHeight - rect.bottom;
        const openUpward = spaceBelow < menuHeight + gap + 72; // keep clear of composer

        const top = openUpward
          ? Math.max(margin, rect.top - menuHeight - gap)
          : Math.min(
              window.innerHeight - menuHeight - margin,
              rect.bottom + gap,
            );

        let left = isSent ? rect.right - menuWidth : rect.left;
        left = Math.min(
          Math.max(margin, left),
          window.innerWidth - menuWidth - margin,
        );

        setPlacement({ top, left, openUpward });
      };

      updatePosition();
      window.addEventListener('resize', updatePosition);
      window.addEventListener('scroll', updatePosition, true);
      return () => {
        window.removeEventListener('resize', updatePosition);
        window.removeEventListener('scroll', updatePosition, true);
      };
    }, [isOpen, isSent]);

    const menu =
      isOpen &&
      createPortal(
        <div
          ref={menuRef}
          role="menu"
          style={{
            position: 'fixed',
            zIndex: 80,
            top: placement?.top ?? -9999,
            left: placement?.left ?? -9999,
            visibility: placement ? 'visible' : 'hidden',
          }}
          className="min-w-36 overflow-hidden rounded-xl border border-gray-100 bg-white p-1 shadow-[0_12px_32px_rgba(15,23,42,0.18)]"
          onClick={(e) => e.stopPropagation()}
        >
          {onReply ? (
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                onClose();
                onReply();
              }}
              className="flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-left text-[13px] font-medium text-gray-700 transition hover:bg-gray-50"
            >
              <Reply size={14} className="text-gray-500" />
              <span>Reply</span>
            </button>
          ) : null}

          {canEdit ? (
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                onClose();
                onEdit();
              }}
              className="flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-left text-[13px] font-medium text-gray-700 transition hover:bg-gray-50"
            >
              <Pencil size={14} className="text-gray-500" />
              <span>Edit</span>
            </button>
          ) : null}

          {onCopy ? (
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                onClose();
                onCopy();
              }}
              className="flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-left text-[13px] font-medium text-gray-700 transition hover:bg-gray-50"
            >
              <Copy size={14} className="text-gray-500" />
              <span>Copy text</span>
            </button>
          ) : null}

          {isSent ? (
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                onClose();
                onDelete();
              }}
              className="flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-left text-[13px] font-medium text-red-600 transition hover:bg-red-50"
            >
              <Trash2 size={14} className="text-red-500" />
              <span>Unsend</span>
            </button>
          ) : null}
        </div>,
        document.body,
      );

    return (
      <div className="relative shrink-0 self-center" ref={buttonWrapRef}>
        <button
          ref={buttonRef}
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggle();
          }}
          title="More"
          className={`flex size-7 cursor-pointer items-center justify-center rounded-full border border-gray-200 bg-white/95 text-gray-500 shadow-sm transition hover:bg-gray-100 hover:text-gray-800 ${
            isOpen
              ? 'opacity-100 ring-2 ring-[#4048cd]/20'
              : 'opacity-0 group-hover:opacity-100'
          }`}
          aria-label="Message actions"
          aria-expanded={isOpen}
          aria-haspopup="menu"
        >
          <MoreHorizontal size={15} />
        </button>
        {menu}
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

const ChatMessageBubble = memo(
  ({
    message,
    t,
    onStartEdit,
    onStartReply,
    onOpenUnsend,
    activeMenuId,
    setActiveMenuId,
    currentUserId,
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
      (message.fileType === 'image' ||
        message.fileType?.startsWith('image/') ||
        /\.(jpeg|jpg|png|webp|gif|svg)$/i.test(message.fileUrl || ''));
    const isVideoFile =
      message.variant === 'video' ||
      (hasFile &&
        (message.fileType === 'video' ||
          message.fileType?.startsWith('video/') ||
          /\.(mp4|webm|mov)$/i.test(message.fileUrl || '')));
    const isAudioFile =
      message.variant === 'voice' ||
      message.variant === 'audio' ||
      (hasFile &&
        (message.fileType === 'audio' ||
          message.fileType?.startsWith('audio/') ||
          /\.(webm|ogg|mp3|m4a|wav|aac)$/i.test(
            message.fileUrl || message.fileName || '',
          )));

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

    const replyQuote = (
      <InlineReplyQuote
        replyTo={message.replyTo}
        isSent={isSent}
        currentUserId={currentUserId}
      />
    );

    const actionMenu = (
      <FacebookMessageMenu
        isSent={isSent}
        canEdit={isSent && Boolean(message.text) && !hasFile}
        onEdit={() => onStartEdit?.(message)}
        onReply={() => onStartReply?.(message)}
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
            {replyQuote}
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

    // Audio / Voice Message
    if (isAudioFile) {
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
            {replyQuote}
            <div className="flex items-center gap-3">
              <span
                className={`inline-flex size-10 shrink-0 items-center justify-center rounded-full ${
                  isSent ? 'bg-white/15' : 'bg-[#ecedfa] text-[#4048cd]'
                }`}
              >
                <Mic size={18} strokeWidth={2} aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-semibold">
                  {message.fileName || t('memberChat.voiceMessage', 'Voice message')}
                </p>
                {message.fileUrl ? (
                  <audio
                    controls
                    preload="metadata"
                    src={message.fileUrl}
                    className={`mt-1.5 h-8 w-full max-w-[240px] ${
                      isSent ? '[&::-webkit-media-controls-panel]:bg-white/20' : ''
                    }`}
                  >
                    <track kind="captions" />
                  </audio>
                ) : null}
              </div>
            </div>
            {message.text ? (
              <p className="mt-2 text-[14px] leading-6">{message.text}</p>
            ) : null}
            <div
              className={`mt-2 flex items-center gap-1.5 text-[11px] ${
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
            {message.replyTo ? (
              <div className="px-3 pt-3">{replyQuote}</div>
            ) : null}
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
            {replyQuote}
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

    const messageText = message.textKey ? t(message.textKey) : message.text;
    const emojiScaleClass = getEmojiOnlyScale(messageText);

    // Standard Text Message
    return (
      <div
        className={`group flex items-center gap-1.5 py-1 ${
          isSent ? 'justify-end flex-row' : 'justify-start flex-row'
        }`}
      >
        {isSent ? actionMenu : null}

        <div
          className={`max-w-[min(100%,420px)] rounded-[20px] transition ${
            emojiScaleClass
              ? 'px-3 py-2'
              : 'px-4 py-2.5 text-[14px] leading-6'
          } ${
            isSent
              ? 'rounded-br-md bg-[#4048cd] text-white shadow-xs'
              : 'rounded-bl-md bg-white text-[#161c27] shadow-[0_1px_2px_rgba(0,0,0,0.06)] ring-1 ring-[#ececf0]'
          }`}
        >
          {replyQuote}
          <p
            className={`whitespace-pre-wrap break-words ${
              emojiScaleClass || ''
            }`}
          >
            {messageText}
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

        {!isSent ? actionMenu : null}
      </div>
    );
  },
);

ChatMessageBubble.displayName = 'ChatMessageBubble';

const ChatThreadHeader = memo(({ conversation, onBack }) => {
  const { t } = useTranslation();

  if (!conversation) return null;

  return (
    <div className="flex h-16 shrink-0 items-center gap-2 border-b border-[#ececf0] bg-white px-3 sm:h-18 sm:gap-3 sm:px-5 lg:px-6">
      {onBack ? (
        <Button
          unstyled
          type="button"
          onClick={onBack}
          aria-label={t('memberChat.backToList', 'Back to messages')}
          className="inline-flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full text-[#494453] transition hover:bg-[#f3f4f6] xl:hidden"
        >
          <ArrowLeft size={20} strokeWidth={2} aria-hidden="true" />
        </Button>
      ) : null}
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <div className="relative shrink-0">
          <Image
            src={conversation.avatar}
            alt={conversation.name}
            width={44}
            height={44}
            className="size-10 rounded-full object-cover sm:size-11"
          />
          {conversation.online ? (
            <span
              className="absolute bottom-0 right-0 size-3 rounded-full border-2 border-white bg-[#10b981]"
              aria-label={t('memberChat.online')}
            />
          ) : null}
        </div>
        <div className="min-w-0">
          <h2 className="truncate text-[15px] font-semibold text-[#161c27] sm:text-[16px]">
            {conversation.name}
          </h2>
          <p className="truncate text-[12px] text-[#6b7280]">
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
    replyToMessage,
    onCancelReply,
    currentUserId,
  }) => {
    const { t } = useTranslation();
    const fileInputRef = useRef(null);
    const textareaRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const mediaStreamRef = useRef(null);
    const audioChunksRef = useRef([]);
    const recordingTimerRef = useRef(null);
    const [emojiOpen, setEmojiOpen] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [recordingSeconds, setRecordingSeconds] = useState(0);
    const selectionRef = useRef({ start: 0, end: 0 });

    const isEditing = Boolean(editingMessage);
    const isReplying = Boolean(replyToMessage) && !isEditing;

    const stopMediaTracks = () => {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
        mediaStreamRef.current = null;
      }
    };

    const clearRecordingTimer = () => {
      if (recordingTimerRef.current) {
        window.clearInterval(recordingTimerRef.current);
        recordingTimerRef.current = null;
      }
    };

    const stopRecording = (shouldSave = true) => {
      const recorder = mediaRecorderRef.current;
      if (!recorder) {
        setIsRecording(false);
        clearRecordingTimer();
        stopMediaTracks();
        return;
      }

      if (recorder.state !== 'inactive') {
        // onstop handler will finalize the file when shouldSave is true
        recorder._shouldSave = shouldSave;
        recorder.stop();
      } else {
        setIsRecording(false);
        clearRecordingTimer();
        stopMediaTracks();
      }
    };

    const startRecording = async () => {
      if (disabled || isSending || isEditing || isRecording) return;
      if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') {
        toast.error(
          t(
            'memberChat.voiceUnsupported',
            'Voice recording is not supported in this browser.',
          ),
        );
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaStreamRef.current = stream;
        const mimeType = pickSupportedAudioMime();
        const recorder = mimeType
          ? new MediaRecorder(stream, { mimeType })
          : new MediaRecorder(stream);
        mediaRecorderRef.current = recorder;
        audioChunksRef.current = [];
        recorder._shouldSave = true;

        recorder.ondataavailable = (event) => {
          if (event.data && event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };

        recorder.onstop = () => {
          clearRecordingTimer();
          setIsRecording(false);
          setRecordingSeconds(0);
          stopMediaTracks();

          const shouldSave = recorder._shouldSave !== false;
          const chunks = audioChunksRef.current;
          audioChunksRef.current = [];
          mediaRecorderRef.current = null;

          if (!shouldSave || !chunks.length) return;

          const blobType = recorder.mimeType || mimeType || 'audio/webm';
          const extension = blobType.includes('mp4')
            ? 'm4a'
            : blobType.includes('ogg')
              ? 'ogg'
              : 'webm';
          const file = new File(
            [new Blob(chunks, { type: blobType })],
            `voice-${Date.now()}.${extension}`,
            { type: blobType },
          );
          onFileSelect?.(file);
          toast.success(
            t('memberChat.voiceReady', 'Voice note ready to send'),
          );
        };

        recorder.start(250);
        setIsRecording(true);
        setRecordingSeconds(0);
        clearRecordingTimer();
        recordingTimerRef.current = window.setInterval(() => {
          setRecordingSeconds((prev) => prev + 1);
        }, 1000);
      } catch (error) {
        stopMediaTracks();
        toast.error(
          error?.name === 'NotAllowedError'
            ? t(
                'memberChat.voicePermissionDenied',
                'Microphone permission denied. Please allow access and try again.',
              )
            : t(
                'memberChat.voiceStartFailed',
                'Could not start voice recording.',
              ),
        );
      }
    };

    useEffect(() => {
      return () => {
        clearRecordingTimer();
        if (mediaRecorderRef.current?.state === 'recording') {
          mediaRecorderRef.current._shouldSave = false;
          mediaRecorderRef.current.stop();
        }
        stopMediaTracks();
      };
    }, []);

    const rememberSelection = () => {
      const el = textareaRef.current;
      if (!el) return;
      selectionRef.current = {
        start: el.selectionStart ?? value.length,
        end: el.selectionEnd ?? value.length,
      };
    };

    const insertEmoji = (emoji) => {
      if (!emoji || disabled || isSending) return;
      const current = String(value || '');
      const start = selectionRef.current.start ?? current.length;
      const end = selectionRef.current.end ?? current.length;
      const next = `${current.slice(0, start)}${emoji}${current.slice(end)}`;
      const caret = start + emoji.length;
      selectionRef.current = { start: caret, end: caret };
      onChange?.(next);
      window.requestAnimationFrame(() => {
        const el = textareaRef.current;
        if (!el) return;
        el.focus();
        el.setSelectionRange(caret, caret);
      });
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        onSend?.();
      } else if (event.key === 'Escape' && isEditing) {
        event.preventDefault();
        onCancelEdit?.();
      } else if (event.key === 'Escape' && isReplying) {
        event.preventDefault();
        onCancelReply?.();
      }
    };

    useEffect(() => {
      if (!isEditing || !textareaRef.current) return;
      const el = textareaRef.current;
      el.focus();
      const len = el.value.length;
      el.setSelectionRange(len, len);
      selectionRef.current = { start: len, end: len };
    }, [isEditing, editingMessage?.id]);

    useEffect(() => {
      if (!isReplying || !textareaRef.current) return;
      textareaRef.current.focus();
    }, [isReplying, replyToMessage?.id]);

    return (
      <div className="border-t border-[#ececf0] bg-white px-5 py-4">
        <EmojiPickerModal
          open={emojiOpen}
          onClose={() => setEmojiOpen(false)}
          onSelect={insertEmoji}
        />

        {isReplying ? (
          <div className="mb-2 flex items-start justify-between gap-2 rounded-xl border border-[#c7d2fe] bg-[#f5f7ff] px-3.5 py-2 animate-in fade-in duration-150">
            <div className="min-w-0 border-l-[3px] border-[#4048cd] pl-2.5">
              <p className="text-[11px] font-semibold text-[#4048cd]">
                Replying to {getReplyAuthorLabel(replyToMessage, currentUserId)}
              </p>
              <p className="truncate text-[12px] text-[#494453]">
                {getReplyPreviewLabel(replyToMessage)}
              </p>
            </div>
            <button
              type="button"
              onClick={onCancelReply}
              className="inline-flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-full text-[#6b7280] transition hover:bg-[#e0e7ff] hover:text-[#161c27]"
              aria-label={t('common.cancel', 'Cancel reply')}
            >
              <X size={14} />
            </button>
          </div>
        ) : null}

        {/* Recording indicator */}
        {isRecording ? (
          <div className="mb-2 flex items-center justify-between gap-3 rounded-xl border border-[#fecaca] bg-[#fef2f2] px-3.5 py-2 text-[12px] text-[#b91c1c]">
            <div className="flex min-w-0 items-center gap-2.5">
              <span className="relative inline-flex size-2.5">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#ef4444] opacity-60" />
                <span className="relative inline-flex size-2.5 rounded-full bg-[#ef4444]" />
              </span>
              <span className="font-semibold">
                {t('memberChat.recording', 'Recording')}
              </span>
              <span className="tabular-nums text-[#7f1d1d]">
                {formatRecordingTime(recordingSeconds)}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Button
                unstyled
                type="button"
                onClick={() => stopRecording(false)}
                className="inline-flex h-8 cursor-pointer items-center rounded-lg px-2.5 text-[12px] font-semibold text-[#7f1d1d] transition hover:bg-[#fee2e2]"
              >
                {t('common.cancel', 'Cancel')}
              </Button>
              <Button
                unstyled
                type="button"
                onClick={() => stopRecording(true)}
                className="inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-lg bg-[#dc2626] px-3 text-[12px] font-semibold text-white transition hover:bg-[#b91c1c]"
              >
                <Square size={12} className="fill-white" aria-hidden="true" />
                {t('memberChat.stopRecording', 'Stop')}
              </Button>
            </div>
          </div>
        ) : null}

        {/* Selected file preview */}
        {selectedFile && !isEditing && !isRecording ? (
          <div className="mb-2 flex items-center justify-between gap-2 rounded-xl border border-[#c7d2fe] bg-[#f5f7ff] px-3.5 py-2 text-[12px] text-[#4048cd] animate-in fade-in duration-150">
            <div className="flex min-w-0 items-center gap-2">
              {selectedFile.type?.startsWith('image/') ? (
                <ImageIcon size={16} className="shrink-0 text-[#4048cd]" />
              ) : selectedFile.type?.startsWith('audio/') ? (
                <Mic size={16} className="shrink-0 text-[#4048cd]" />
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
            isEditing || isReplying
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
            onChange={(event) => {
              onChange(event.target.value);
              selectionRef.current = {
                start: event.target.selectionStart ?? event.target.value.length,
                end: event.target.selectionEnd ?? event.target.value.length,
              };
            }}
            onSelect={rememberSelection}
            onClick={rememberSelection}
            onKeyUp={rememberSelection}
            onKeyDown={handleKeyDown}
            placeholder={
              isEditing
                ? t('memberChat.editPlaceholder', 'Edit message...')
                : isReplying
                  ? t('memberChat.replyPlaceholder', 'Write a reply...')
                  : t('memberChat.inputPlaceholder')
            }
            disabled={disabled || isSending}
            className="max-h-28 min-h-[24px] flex-1 resize-none bg-transparent py-1 text-[14px] leading-6 text-[#161c27] placeholder:text-[#9ca3af] outline-none disabled:opacity-50"
          />

          <div className="flex shrink-0 items-center gap-1">
            <Button
              unstyled
              type="button"
              aria-label={t('memberChat.emoji')}
              onClick={() => {
                rememberSelection();
                setEmojiOpen(true);
              }}
              disabled={disabled || isSending}
              className="inline-flex size-9 cursor-pointer items-center justify-center rounded-full text-[#6b7280] transition hover:bg-[#f3f4f6] hover:text-[#4048cd] disabled:opacity-40"
            >
              <Smile size={18} strokeWidth={2} aria-hidden="true" />
            </Button>
            {!isEditing ? (
              <Button
                unstyled
                type="button"
                aria-label={
                  isRecording
                    ? t('memberChat.stopRecording', 'Stop recording')
                    : t('memberChat.voice')
                }
                aria-pressed={isRecording}
                onClick={() =>
                  isRecording ? stopRecording(true) : startRecording()
                }
                disabled={disabled || isSending}
                className={`inline-flex size-9 cursor-pointer items-center justify-center rounded-full transition disabled:opacity-40 ${
                  isRecording
                    ? 'bg-[#fee2e2] text-[#dc2626] hover:bg-[#fecaca]'
                    : 'text-[#6b7280] hover:bg-[#f3f4f6] hover:text-[#4048cd]'
                }`}
              >
                {isRecording ? (
                  <Square size={14} className="fill-current" aria-hidden="true" />
                ) : (
                  <Mic size={18} strokeWidth={2} aria-hidden="true" />
                )}
              </Button>
            ) : (
              <Button
                unstyled
                type="button"
                onClick={onCancelEdit}
                aria-label={t('common.cancel', 'Cancel')}
                className="inline-flex size-9 cursor-pointer items-center justify-center rounded-full text-[#6b7280] transition hover:bg-[#f3f4f6] hover:text-[#161c27]"
              >
                <X size={18} strokeWidth={2} aria-hidden="true" />
              </Button>
            )}
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
    replyToMessage,
    onStartReply,
    onCancelReply,
    onDeleteMessage,
    currentUserId,
    onBack,
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
        <ChatThreadHeader conversation={conversation} onBack={onBack} />

        <div
          className="scrollbar-light flex-1 overflow-y-auto px-3 py-4 sm:px-5 sm:py-5"
          onClick={() => setActiveMenuId(null)}
        >
          <div className="mx-auto flex min-h-full max-w-[860px] flex-col justify-end gap-3">
            {isLoadingMessages ? (
              <div className="flex flex-1 items-center justify-center py-12 text-[#9ca3af]">
                <Loader2 size={24} className="mr-2 animate-spin" />
                <span className="text-[14px]">Loading messages...</span>
              </div>
            ) : messages.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center py-16 text-center text-[#9ca3af]">
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
                  onStartReply={onStartReply}
                  onOpenUnsend={(id) => setUnsendTargetId(id)}
                  activeMenuId={activeMenuId}
                  setActiveMenuId={setActiveMenuId}
                  currentUserId={currentUserId}
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
          replyToMessage={replyToMessage}
          onCancelReply={onCancelReply}
          currentUserId={currentUserId}
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
