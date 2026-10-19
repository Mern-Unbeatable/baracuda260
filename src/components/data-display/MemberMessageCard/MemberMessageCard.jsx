import { Heart, Loader2, Pencil, Share2, Trash2 } from 'lucide-react';
import React, { memo, useCallback, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import Button from '@/components/ui/Button';
import Image from '@/components/ui/Image';

const MemberMessageCard = memo(({ message, onEdit, onDelete, isDeleting }) => {
  const { t } = useTranslation();
  const [liked, setLiked] = useState(false);
  const displayLikes = (message?.likesCount ?? message?.likes ?? 0) + (liked ? 1 : 0);

  const textContent =
    message?.body || (message?.bodyKey ? t(message.bodyKey) : '');

  const handleShare = useCallback(async () => {
    const shareText = textContent;
    try {
      if (navigator.share) {
        await navigator.share({
          title: message?.authorName || 'News & Message',
          text: shareText,
        });
        return;
      }
      await navigator.clipboard.writeText(shareText);
      toast.success(t('myMessages.card.shared', 'Link copied to clipboard!'));
    } catch {
      // User cancelled or clipboard unavailable.
    }
  }, [message?.authorName, textContent, t]);

  const mediaSource = message?.mediaUrl || message?.image;
  const isVideo = message?.mediaType === 'VIDEO';

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-[rgba(203,195,213,0.15)] bg-white shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between gap-3 p-4 pb-3">
        <div className="flex min-w-0 items-center gap-3">
          <Image
            src={message?.authorAvatar}
            alt=""
            width={44}
            height={44}
            className="size-11 shrink-0 rounded-full object-cover"
          />
          <div className="min-w-0">
            <p className="truncate text-[15px] font-semibold text-[#161c27]">
              {message?.authorName}
            </p>
            <p className="truncate text-[13px] text-[#6b7280]">
              {message?.postedDate || message?.relativeTime}
              {message?.postedTime ? ` • ${message?.postedTime}` : ''}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1.5">
          <span className="rounded-full bg-[#ecedfa] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.35px] text-[#4048cd]">
            {t('myMessages.card.badge')}
          </span>
          {onEdit ? (
            <button
              type="button"
              onClick={() => onEdit(message)}
              disabled={isDeleting}
              aria-label={t('myMessages.card.edit', 'Edit post')}
              title={t('myMessages.card.edit', 'Edit post')}
              className="inline-flex size-7 cursor-pointer items-center justify-center rounded-lg text-[#9ca3af] transition hover:bg-[#eff6ff] hover:text-[#2563eb] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Pencil size={14} strokeWidth={2} />
            </button>
          ) : null}
          {onDelete ? (
            <button
              type="button"
              onClick={() => onDelete(message)}
              disabled={isDeleting}
              aria-label={t('myMessages.card.delete', 'Delete post')}
              title={t('myMessages.card.delete', 'Delete post')}
              className="inline-flex size-7 cursor-pointer items-center justify-center rounded-lg text-[#9ca3af] transition hover:bg-[#fee2e2] hover:text-[#dc2626] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isDeleting ? (
                <Loader2 size={14} className="animate-spin text-[#dc2626]" />
              ) : (
                <Trash2 size={15} strokeWidth={2} />
              )}
            </button>
          ) : null}
        </div>
      </div>

      {textContent ? (
        <p className="whitespace-pre-wrap px-4 pb-4 text-[14px] leading-6 text-[#494453]">
          {textContent}
        </p>
      ) : null}

      {mediaSource ? (
        isVideo ? (
          <div className="relative aspect-4/3 w-full overflow-hidden bg-black">
            <video
              src={mediaSource}
              controls
              preload="metadata"
              className="h-full w-full object-contain"
            />
          </div>
        ) : (
          <div className="relative aspect-4/3 w-full overflow-hidden bg-[#f3f4f6]">
            <Image
              src={mediaSource}
              alt=""
              width={400}
              height={300}
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </div>
        )
      ) : null}

      <div className="mt-auto flex items-center justify-between gap-3 border-t border-[rgba(203,195,213,0.15)] px-4 py-3">
        <Button
          unstyled
          type="button"
          aria-pressed={liked}
          onClick={() => setLiked((current) => !current)}
          className="inline-flex cursor-pointer items-center gap-2 text-[14px] font-medium text-[#ee1c25] transition hover:opacity-80"
        >
          <Heart
            size={18}
            strokeWidth={2}
            aria-hidden="true"
            className={liked ? 'fill-[#ee1c25]' : 'fill-transparent'}
          />
          {t('myMessages.card.likes', { count: displayLikes })}
        </Button>
        <Button
          unstyled
          type="button"
          onClick={handleShare}
          className="inline-flex cursor-pointer items-center gap-2 text-[14px] font-medium text-[#4048cd] transition hover:opacity-80"
        >
          <Share2 size={18} strokeWidth={2} aria-hidden="true" />
          {t('myMessages.card.share')}
        </Button>
      </div>
    </article>
  );
});

MemberMessageCard.displayName = 'MemberMessageCard';

export default MemberMessageCard;
