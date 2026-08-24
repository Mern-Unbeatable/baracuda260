import { useTranslation } from 'react-i18next';
import React, { memo, useCallback, useState } from 'react';
import { Heart, Share2 } from 'lucide-react';

const MemberMessageCard = memo(({ message }) => {
  const { t } = useTranslation();
  const [liked, setLiked] = useState(false);
  const displayLikes = message.likes + (liked ? 1 : 0);

  const handleShare = useCallback(async () => {
    const shareText = t(message.bodyKey);
    try {
      if (navigator.share) {
        await navigator.share({ title: message.authorName, text: shareText });
        return;
      }
      await navigator.clipboard.writeText(shareText);
    } catch {
      // User cancelled or clipboard unavailable.
    }
  }, [message.authorName, message.bodyKey, t]);

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-[rgba(203,195,213,0.15)] bg-white shadow-sm">
      <div className="flex items-start justify-between gap-3 p-4 pb-3">
        <div className="flex min-w-0 items-center gap-3">
          <img
            src={message.authorAvatar}
            alt=""
            width={44}
            height={44}
            className="size-11 shrink-0 rounded-full object-cover"
          />
          <div className="min-w-0">
            <p className="truncate text-[15px] font-semibold text-[#161c27]">{message.authorName}</p>
            <p className="text-[13px] text-[#6b7280]">
              {message.postedDate} • {message.postedTime}
            </p>
          </div>
        </div>
        <span className="shrink-0 rounded-full bg-[#ecedfa] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.35px] text-[#4048cd]">
          {t('myMessages.card.badge')}
        </span>
      </div>

      <p className="px-4 pb-4 text-[14px] leading-6 text-[#494453]">{t(message.bodyKey)}</p>

      <div className="relative aspect-4/3 w-full overflow-hidden bg-[#f3f4f6]">
        <img
          src={message.image}
          alt=""
          width={400}
          height={300}
          loading="lazy"
          className="h-full w-full object-cover"
        />
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-[rgba(203,195,213,0.15)] px-4 py-3">
        <button
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
        </button>
        <button
          type="button"
          onClick={handleShare}
          className="inline-flex cursor-pointer items-center gap-2 text-[14px] font-medium text-[#4048cd] transition hover:opacity-80"
        >
          <Share2 size={18} strokeWidth={2} aria-hidden="true" />
          {t('myMessages.card.share')}
        </button>
      </div>
    </article>
  );
});

MemberMessageCard.displayName = 'MemberMessageCard';

export default MemberMessageCard;
