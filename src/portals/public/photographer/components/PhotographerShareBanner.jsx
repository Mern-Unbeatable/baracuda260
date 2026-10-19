import { Check, Copy, Heart } from 'lucide-react';
import React, { memo, useCallback, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import Button from '@/components/ui/Button';

const PhotographerShareBanner = memo(({ photographerName }) => {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  const getShareDetails = useCallback(() => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    const name = photographerName || 'this photographer';
    const text = t('photographerProfile.shareBanner.shareText', {
      name,
      defaultValue: `Check out ${name}'s photography profile and artwork on My12Photos!`,
    });
    return { url, text };
  }, [photographerName, t]);

  const handleShare = useCallback(
    (platform) => {
      const { url, text } = getShareDetails();
      const encodedUrl = encodeURIComponent(url);
      const encodedText = encodeURIComponent(text);

      let shareUrl = '';
      if (platform === 'whatsapp') {
        shareUrl = `https://api.whatsapp.com/send?text=${encodedText}%20${encodedUrl}`;
      } else if (platform === 'facebook') {
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
      } else if (platform === 'x') {
        shareUrl = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
      }

      if (shareUrl) {
        window.open(shareUrl, '_blank', 'noopener,noreferrer,width=600,height=500');
      }
    },
    [getShareDetails],
  );

  const copyProfileLink = useCallback(async () => {
    try {
      const url = window.location.href;
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success(
        t('photographerProfile.shareBanner.linkCopied', 'Profile link copied to clipboard!'),
      );
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error(t('common.errors.general', 'Failed to copy link.'));
    }
  }, [t]);

  return (
    <section className="mt-10 sm:mt-12">
      <div className="rounded-2xl bg-[radial-gradient(circle_at_top_left,#4048cd,#1e293b)] px-5 py-8 sm:px-8 sm:py-10">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[12px] font-semibold text-white">
          <Heart
            size={14}
            className="fill-white text-white"
            aria-hidden="true"
          />
          {t('photographerProfile.shareBanner.badge', 'Community Support')}
        </span>
        <h2 className="mt-4 max-w-2xl text-[22px] font-bold leading-snug text-white sm:text-[26px]">
          {t('photographerProfile.shareBanner.title', 'Support this photographer by sharing their profile with your friends!')}
        </h2>
        <p className="mt-2 max-w-2xl text-[15px] leading-6 text-white/80 sm:text-[16px]">
          {t('photographerProfile.shareBanner.subtitle', 'Share their profile on social media and help them get more visibility and votes.')}
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Button
            unstyled
            type="button"
            onClick={() => handleShare('whatsapp')}
            className="inline-flex cursor-pointer items-center justify-center rounded-full bg-[#25D366] px-5 py-2 text-[14px] font-semibold text-white transition hover:brightness-105 active:scale-95"
          >
            WhatsApp
          </Button>
          <Button
            unstyled
            type="button"
            onClick={() => handleShare('facebook')}
            className="inline-flex cursor-pointer items-center justify-center rounded-full bg-[#1877F2] px-5 py-2 text-[14px] font-semibold text-white transition hover:brightness-105 active:scale-95"
          >
            Facebook
          </Button>
          <Button
            unstyled
            type="button"
            onClick={() => handleShare('x')}
            className="inline-flex cursor-pointer items-center justify-center rounded-full bg-[#0f172a] px-5 py-2 text-[14px] font-semibold text-white transition hover:bg-black active:scale-95"
          >
            X
          </Button>
          <Button
            unstyled
            type="button"
            onClick={copyProfileLink}
            className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-white px-5 py-2 text-[14px] font-semibold text-[#111827] shadow-sm transition hover:bg-gray-100 active:scale-95"
          >
            {copied ? (
              <>
                <Check size={16} className="text-emerald-600" aria-hidden="true" />
                <span className="text-emerald-700">
                  {t('photographerProfile.shareBanner.copied', 'Copied!')}
                </span>
              </>
            ) : (
              <>
                <Copy size={16} aria-hidden="true" />
                <span>{t('photographerProfile.shareBanner.copyLink', 'Copy Profile Link')}</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </section>
  );
});

PhotographerShareBanner.displayName = 'PhotographerShareBanner';

export default PhotographerShareBanner;
