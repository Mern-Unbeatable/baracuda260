import { useTranslation } from 'react-i18next';
import React, { memo, useState } from 'react';
import { X } from 'lucide-react';
import MarketingButton from '@/components/marketing/MarketingButton/MarketingButton';
import { MY_ARTWORK_PROMOTE_TIERS } from '@/portals/member/data/myArtworkData';

const MemberPromotePanel = memo(({ item, open, onClose, onConfirm }) => {
  const { t } = useTranslation();
  const [selectedTier, setSelectedTier] = useState(MY_ARTWORK_PROMOTE_TIERS[0].id);

  if (!open || !item) return null;

  const handleConfirm = () => {
    onConfirm?.(item, selectedTier);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-120 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label={t('myArtwork.promote.close')}
        onClick={onClose}
        className="absolute inset-0 bg-black/40"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="promote-artwork-title"
        className="relative w-full max-w-md rounded-2xl border border-black/10 bg-white p-6 shadow-xl"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="promote-artwork-title" className="text-[20px] font-bold text-[#161c27]">
              {t('myArtwork.promote.title')}
            </h2>
            <p className="mt-1 text-[14px] text-[#6b7280]">{item.title}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t('myArtwork.promote.close')}
            className="inline-flex size-9 cursor-pointer items-center justify-center rounded-full border border-black/10 text-[#494453] transition hover:bg-[#f9fafb]"
          >
            <X size={18} strokeWidth={2} aria-hidden="true" />
          </button>
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
                    <span className="text-[15px] font-semibold text-[#161c27]">{tier.price}</span>
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
          <button
            type="button"
            onClick={onClose}
            className="inline-flex cursor-pointer items-center justify-center rounded-lg border border-black/10 px-5 py-2.5 text-[14px] font-semibold text-[#494453] transition hover:bg-[#f9fafb]"
          >
            {t('myArtwork.promote.cancel')}
          </button>
          <MarketingButton type="button" className="rounded-lg px-5 py-2.5" onClick={handleConfirm}>
            {t('myArtwork.promote.confirm')}
          </MarketingButton>
        </div>
      </div>
    </div>
  );
});

MemberPromotePanel.displayName = 'MemberPromotePanel';

export default MemberPromotePanel;
