import { useTranslation } from 'react-i18next';
import React, { memo, useState } from 'react';
import { ArrowRight, X } from 'lucide-react';
import { GALLERY_DETAIL_DONATION_AMOUNTS } from '@/shared/data/galleryDetail';
import MarketingButton from '@/components/marketing/MarketingButton/MarketingButton';

const amountButtonClass = (selected) =>
  [
    'inline-flex min-w-14 flex-1 cursor-pointer items-center justify-center rounded-lg border px-3 py-2.5 text-[15px] font-semibold transition sm:min-w-0 sm:flex-none sm:px-5',
    selected
      ? 'border-[#ee1c25] bg-[#fde8e9] text-[#ee1c25]'
      : 'border-black/10 bg-white text-[#0d0d14] hover:border-black/20 hover:bg-[#fafafa]',
  ].join(' ');

const fieldClass =
  'w-full rounded-lg border border-black/10 bg-white px-3 py-2.5 text-[15px] text-[#0d0d14] outline-none transition placeholder:text-[#9ca3af] focus:border-[#4048cd] focus:ring-2 focus:ring-[#4048cd]/20';

const GalleryDetailDonation = memo(({ photographer, avatar, bio, onClose }) => {
  const { t } = useTranslation();
  const [selectedAmount, setSelectedAmount] = useState(25);
  const [customAmount, setCustomAmount] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  const handleCustomAmountChange = (event) => {
    const digits = event.target.value.replace(/[^\d.]/g, '');
    setCustomAmount(digits);
    if (digits) setSelectedAmount(null);
  };

  const handlePresetSelect = (amount) => {
    setSelectedAmount(amount);
    setCustomAmount('');
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-black/10 bg-[#fafafa]">
      <div className="flex items-start justify-between gap-4 border-b border-black/8 px-4 py-4 sm:px-6 sm:py-5">
        <div className="flex min-w-0 items-start gap-3">
          <img
            src={avatar}
            alt=""
            width={48}
            height={48}
            className="size-12 shrink-0 rounded-full object-cover"
          />
          <div className="min-w-0">
            <p className="text-[16px] font-semibold leading-snug text-[#0d0d14] sm:text-[18px]">
              {t('galleryDetail.donation.supportTitle', { name: photographer })}
            </p>
            <p className="mt-1 text-[13px] leading-5 text-[#6b7280] sm:text-[14px]">
              {bio || t('galleryDetail.donation.defaultBio', { name: photographer })}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label={t('galleryDetail.donation.close')}
          className="inline-flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full text-[#6b7280] transition hover:bg-black/5 hover:text-[#0d0d14]"
        >
          <X size={20} strokeWidth={2} aria-hidden="true" />
        </button>
      </div>

      <form className="flex flex-col gap-6 px-4 py-5 sm:px-6 sm:py-6" onSubmit={handleSubmit}>
        <div>
          <p className="text-[15px] font-semibold text-[#0d0d14] sm:text-[16px]">
            {t('galleryDetail.donation.selectAmount')}
          </p>
          <div className="mt-3 flex flex-wrap gap-2 sm:gap-3">
            {GALLERY_DETAIL_DONATION_AMOUNTS.map((amount) => (
              <button
                key={amount}
                type="button"
                onClick={() => handlePresetSelect(amount)}
                className={amountButtonClass(selectedAmount === amount && !customAmount)}
              >
                ${amount}
              </button>
            ))}
          </div>
          <div className="mt-3 flex items-center overflow-hidden rounded-lg border border-black/10 bg-white">
            <span className="shrink-0 pl-3 text-[15px] font-medium text-[#6b7280]">$</span>
            <input
              type="text"
              inputMode="decimal"
              value={customAmount}
              onChange={handleCustomAmountChange}
              placeholder={t('galleryDetail.donation.customAmount')}
              aria-label={t('galleryDetail.donation.customAmount')}
              className="min-w-0 flex-1 border-0 bg-transparent px-2 py-2.5 text-[15px] text-[#0d0d14] outline-none placeholder:text-[#9ca3af]"
            />
            <span className="shrink-0 pr-3 text-[13px] font-medium uppercase tracking-wide text-[#9ca3af]">
              USD
            </span>
          </div>
        </div>

        <div>
          <p className="text-[15px] font-semibold text-[#0d0d14] sm:text-[16px]">
            {t('galleryDetail.donation.yourDetails')}
          </p>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="gallery-donation-name" className="text-[13px] font-medium text-[#374151]">
                {t('galleryDetail.donation.fullName')}
              </label>
              <input
                id="gallery-donation-name"
                type="text"
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                placeholder={t('galleryDetail.donation.fullNamePlaceholder')}
                className={fieldClass}
                autoComplete="name"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="gallery-donation-email" className="text-[13px] font-medium text-[#374151]">
                {t('galleryDetail.donation.email')}
              </label>
              <input
                id="gallery-donation-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder={t('galleryDetail.donation.emailPlaceholder')}
                className={fieldClass}
                autoComplete="email"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <MarketingButton type="button" variant="outline" onClick={onClose}>
            {t('galleryDetail.donation.cancel')}
          </MarketingButton>
          <MarketingButton type="submit">
            {t('galleryDetail.donation.payNow')}
            <ArrowRight size={18} strokeWidth={2.5} aria-hidden="true" />
          </MarketingButton>
        </div>
      </form>
    </div>
  );
});

GalleryDetailDonation.displayName = 'GalleryDetailDonation';

export default GalleryDetailDonation;
