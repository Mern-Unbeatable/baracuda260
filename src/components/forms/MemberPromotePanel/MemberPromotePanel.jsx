import { Loader2, X } from 'lucide-react';
import React, { memo, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import MarketingButton from '@/components/marketing/MarketingButton/MarketingButton';
import Button from '@/components/ui/Button';
import { MY_ARTWORK_PROMOTE_TIERS } from '@/portals/member/data/myArtworkData';

const MemberPromotePanel = memo(
  ({ item, open, onClose, onConfirm, isLoading = false }) => {
    const { t } = useTranslation();
    const [selectedTier, setSelectedTier] = useState(
      MY_ARTWORK_PROMOTE_TIERS[0].id,
    );

    if (!open || !item) return null;
    if (typeof document === 'undefined') return null;

    const handleConfirm = () => {
      const tier =
        MY_ARTWORK_PROMOTE_TIERS.find((t) => t.id === selectedTier) ||
        MY_ARTWORK_PROMOTE_TIERS[0];
      onConfirm?.(item, tier);
    };

    return createPortal(
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="promote-artwork-title"
        className="fixed inset-0 z-999 flex items-center justify-center p-4 overflow-y-auto"
      >
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
          onClick={isLoading ? undefined : onClose}
          aria-hidden="true"
        />
        <div
          className="relative z-10 w-full max-w-md rounded-2xl border border-black/10 bg-white p-6 shadow-2xl transition-all my-8"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2
                id="promote-artwork-title"
                className="text-[20px] font-bold text-[#161c27]"
              >
                {t('myArtwork.promote.title')}
              </h2>
              <p className="mt-1 text-[14px] text-[#6b7280]">{item.title}</p>
            </div>
            <Button
              unstyled
              type="button"
              disabled={isLoading}
              onClick={onClose}
              aria-label={t('myArtwork.promote.close')}
              className="inline-flex size-9 cursor-pointer items-center justify-center rounded-full border border-black/10 text-[#494453] transition hover:bg-[#f9fafb] disabled:opacity-50"
            >
              <X size={18} strokeWidth={2} aria-hidden="true" />
            </Button>
          </div>

        <fieldset className="mt-6">
          <legend className="text-[14px] font-semibold text-[#494453]">
            {t('myArtwork.promote.priceLabel')}
          </legend>
          <div className="mt-3 flex flex-col gap-2">
            {MY_ARTWORK_PROMOTE_TIERS.map((tier) => {
              const selected = selectedTier === tier.id;
              return (
                <label
                  key={tier.id}
                  className={`flex cursor-pointer items-center justify-between gap-3 rounded-xl border px-4 py-3 transition ${
                    selected
                      ? 'border-[#ee1c25]/30 bg-[#fde8e9]'
                      : 'border-black/10 bg-white hover:border-black/20'
                  }`}
                >
                  <span className="inline-flex items-center gap-3">
                    <input
                      type="radio"
                      name="promote-tier"
                      value={tier.id}
                      checked={selected}
                      onChange={() => setSelectedTier(tier.id)}
                      className="size-4 accent-[#ee1c25]"
                    />
                    <span className="text-[15px] font-semibold text-[#161c27]">
                      {tier.price}
                    </span>
                  </span>
                  <span className="text-[13px] text-[#6b7280]">
                    {t('myArtwork.promote.days', { count: tier.days })}
                  </span>
                </label>
              );
            })}
          </div>
        </fieldset>

        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-end">
          <Button
            unstyled
            type="button"
            disabled={isLoading}
            onClick={onClose}
            className="inline-flex cursor-pointer items-center justify-center rounded-lg border border-black/10 px-5 py-2.5 text-[14px] font-semibold text-[#494453] transition hover:bg-[#f9fafb] disabled:opacity-50"
          >
            {t('myArtwork.promote.cancel')}
          </Button>
          <MarketingButton
            type="button"
            disabled={isLoading}
            className="inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 disabled:opacity-70"
            onClick={handleConfirm}
          >
            {isLoading ? (
              <>
                <Loader2 size={16} className="animate-spin shrink-0" />
                <span>
                  {t(
                    'myArtwork.promote.redirecting',
                    'Redirecting to PayPal...',
                  )}
                </span>
              </>
            ) : (
              t('myArtwork.promote.confirm', 'Promote via PayPal')
            )}
          </MarketingButton>
        </div>
      </div>
    </div>,
    document.body,
  );
});

MemberPromotePanel.displayName = 'MemberPromotePanel';

export default MemberPromotePanel;
