import { useTranslation } from 'react-i18next';
import React, { memo, useState } from 'react';
import { X } from 'lucide-react';
import { GALLERY_DETAIL_DONATION_AMOUNTS } from '@/shared/data/galleryDetail';

const amountButtonClass = (selected) =>
  [
    'inline-flex min-w-12 flex-1 cursor-pointer items-center justify-center rounded-lg border px-3 py-2 text-[14px] font-semibold transition sm:min-w-0 sm:flex-none',
    selected
      ? 'border-[#ee1c25] bg-[#fee]  text-[#ee1c25]'
      : 'border-[#d1d5db] bg-white text-[#6b7280] hover:border-[#9ca3af]',
  ].join(' ');

const fieldClass =
  'w-full rounded-lg border border-[#e5e7eb] bg-white px-3 py-2.5 text-[14px] text-[#374151] outline-none transition placeholder:text-[#9ca3af] focus:border-[#4048cd] focus:ring-2 focus:ring-[#4048cd]/10';

const GalleryDetailDonation = memo(({ photographer, avatar, bio, onClose }) => {
  const { t } = useTranslation();
  const [supportType, setSupportType] = useState('one-time');
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
    <div className="overflow-hidden rounded-xl border border-[#e5e7eb] bg-white">
      <div className="flex items-center justify-between gap-4 border-b border-[#e5e7eb] px-6 py-4">
        <div className="flex min-w-0 items-center gap-3">
          <img
            src={avatar}
            alt=""
            width={40}
            height={40}
            className="size-10 shrink-0 rounded-full object-cover"
          />
          <div className="min-w-0">
            <p className="text-[14px] font-semibold text-[#111827]">
              {t('galleryDetail.donation.supportTitle', { name: photographer })}
            </p>
            <p className="text-[13px] leading-5 text-[#6b7280]">
              {bio || t('galleryDetail.donation.defaultBio', { name: photographer })}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label={t('galleryDetail.donation.close')}
          className="inline-flex size-6 shrink-0 cursor-pointer items-center justify-center rounded text-[#6b7280] transition hover:text-[#111827]"
        >
          <X size={18} strokeWidth={2} aria-hidden="true" />
        </button>
      </div>

      <form className="flex flex-col gap-5 px-6 py-5" onSubmit={handleSubmit}>
        <div>
          <p className="text-[16px] font-semibold text-[#111827]">
            {t('galleryDetail.donation.supportType', { defaultValue: 'Choose How You\'d Like to Support' })}
          </p>
          <div className="mt-3 flex items-center gap-5">
            <label className="flex cursor-pointer items-center gap-2.5">
              <input
                type="radio"
                name="support-type"
                value="one-time"
                checked={supportType === 'one-time'}
                onChange={(e) => setSupportType(e.target.value)}
                className="size-5 cursor-pointer"
              />
              <span className="text-[15px] text-[#6b7280]">One-Time Support</span>
            </label>
            <label className="flex cursor-pointer items-center gap-2.5">
              <input
                type="radio"
                name="support-type"
                value="monthly"
                checked={supportType === 'monthly'}
                onChange={(e) => setSupportType(e.target.value)}
                className="size-5 cursor-pointer"
              />
              <span className="text-[15px] text-[#6b7280]">Monthly Support</span>
            </label>
          </div>
        </div>

        <div>
          <p className="text-[16px] font-semibold text-[#111827]">
            {t('galleryDetail.donation.selectAmount')}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
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
          <div className="mt-3 flex items-center gap-2 rounded-lg border border-[#e5e7eb] bg-white px-3 py-2.5">
            <span className="shrink-0 text-[14px] font-medium text-[#6b7280]">$</span>
            <input
              type="text"
              inputMode="decimal"
              value={customAmount}
              onChange={handleCustomAmountChange}
              placeholder={t('galleryDetail.donation.customAmount')}
              aria-label={t('galleryDetail.donation.customAmount')}
              className="min-w-0 flex-1 border-0 bg-transparent text-[14px] text-[#111827] outline-none placeholder:text-[#d1d5db]"
            />
            <span className="shrink-0 text-[12px] font-medium uppercase tracking-wide text-[#9ca3af]">
              USD
            </span>
          </div>
        </div>

        <div>
          <p className="text-[16px] font-semibold text-[#111827]">
            {t('galleryDetail.donation.yourDetails')}
          </p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="gallery-donation-name" className="text-[13px] font-medium text-[#6b7280]">
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
              <label htmlFor="gallery-donation-email" className="text-[13px] font-medium text-[#6b7280]">
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

        <div className="flex gap-2 sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-lg border border-[#d1d5db] bg-white px-4 py-2.5 text-[14px] font-semibold text-[#374151] transition hover:bg-[#f9fafb] sm:flex-none"
          >
            {t('galleryDetail.donation.cancel')}
          </button>
          <button
            type="submit"
            className="flex-1 rounded-lg bg-[#ee1c25] px-4 py-2.5 text-[14px] font-semibold text-white transition hover:bg-[#d91921] sm:flex-none"
          >
            {t('galleryDetail.donation.payNow')} →
          </button>
        </div>
      </form>
    </div>
  );
});

GalleryDetailDonation.displayName = 'GalleryDetailDonation';

export default GalleryDetailDonation;
