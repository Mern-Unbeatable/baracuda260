import { Loader2, X } from 'lucide-react';
import React, { memo, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { selectUser } from '@/app/store/slices/authSlice';
import Button from '@/components/ui/Button';
import Image from '@/components/ui/Image';
import Input from '@/components/ui/Input';
import { getApiErrorMessage } from '@/shared/api/client';
import { createDonationPaymentApi } from '@/shared/api/payments.api';
import { GALLERY_DETAIL_DONATION_AMOUNTS } from '@/shared/data/galleryDetail';

const amountButtonClass = (selected) =>
  [
    'inline-flex min-w-12 flex-1 cursor-pointer items-center justify-center rounded-lg border px-3 py-2 text-[14px] font-semibold transition sm:min-w-0 sm:flex-none',
    selected
      ? 'border-[#ee1c25] bg-[#fee] text-[#ee1c25]'
      : 'border-[#d1d5db] bg-white text-[#6b7280] hover:border-[#9ca3af]',
  ].join(' ');

const fieldClass =
  'w-full rounded-lg border border-[#e5e7eb] bg-white px-3 py-2.5 text-[14px] text-[#374151] outline-none transition placeholder:text-[#9ca3af] focus:border-[#4048cd] focus:ring-2 focus:ring-[#4048cd]/10';

const GalleryDetailDonation = memo(
  ({ submissionId, photographer, avatar, bio, onClose }) => {
    const { t } = useTranslation();
    const user = useSelector(selectUser);
    const [selectedAmount, setSelectedAmount] = useState(25);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const defaultName = user
      ? [user.firstName, user.lastName].filter(Boolean).join(' ') ||
        user.name ||
        user.username ||
        ''
      : '';
    const defaultEmail = user?.email || '';

    const {
      register,
      handleSubmit,
      setValue,
      watch,
      formState: { errors },
    } = useForm({
      defaultValues: {
        supportType: 'one-time',
        customAmount: '',
        fullName: defaultName,
        email: defaultEmail,
        message: '',
      },
    });

    useEffect(() => {
      if (defaultName) setValue('fullName', defaultName);
      if (defaultEmail) setValue('email', defaultEmail);
    }, [defaultName, defaultEmail, setValue]);

    const customAmount = watch('customAmount');

    const onFormSubmit = async (data) => {
      const amount = customAmount
        ? Number(customAmount)
        : Number(selectedAmount);
      if (!amount || Number.isNaN(amount) || amount <= 0) {
        toast.error(
          t(
            'galleryDetail.donation.invalidAmount',
            'Please select or enter a valid donation amount.',
          ),
        );
        return;
      }

      if (!submissionId) {
        toast.error(
          t(
            'galleryDetail.donation.missingId',
            'Artwork ID not found for donation.',
          ),
        );
        return;
      }

      try {
        setIsSubmitting(true);
        const res = await createDonationPaymentApi({
          submissionId,
          amount,
          donorName: data.fullName,
          donorEmail: data.email,
          type: data.supportType === 'monthly' ? 'MONTHLY' : 'ONE_TIME',
          message:
            data.message ||
            `Support donation for ${photographer || 'photographer'}`,
        });

        const checkoutUrl = res?.data?.checkoutUrl || res?.checkoutUrl;
        const paymentId = res?.data?.paymentId || res?.paymentId;

        if (paymentId) {
          sessionStorage.setItem('pendingDonationPaymentId', paymentId);
          sessionStorage.setItem('pendingDonationSubmissionId', submissionId);
        }

        if (checkoutUrl) {
          toast.loading(
            t(
              'galleryDetail.donation.redirecting',
              'Redirecting to PayPal checkout...',
            ),
          );
          window.location.href = checkoutUrl;
        } else {
          toast.success(
            res?.message ||
              t(
                'galleryDetail.donation.initiatedSuccess',
                'Donation checkout generated successfully!',
              ),
          );
          setIsSubmitting(false);
        }
      } catch (err) {
        toast.error(
          getApiErrorMessage(
            err,
            t(
              'galleryDetail.donation.failed',
              'Failed to initiate donation. Please try again.',
            ),
          ),
        );
        setIsSubmitting(false);
      }
    };

    const handleCustomAmountChange = (event) => {
      const digits = event.target.value.replace(/[^\d.]/g, '');
      setValue('customAmount', digits);
      if (digits) setSelectedAmount(null);
    };

    const handlePresetSelect = (amount) => {
      setSelectedAmount(amount);
      setValue('customAmount', '');
    };

    return (
      <div className="overflow-hidden rounded-xl border border-[#e5e7eb] bg-white">
        <div className="flex items-center justify-between gap-4 border-b border-[#e5e7eb] px-6 py-4">
          <div className="flex min-w-0 items-center gap-3">
            <Image
              src={avatar}
              alt=""
              width={40}
              height={40}
              className="size-10 shrink-0 rounded-full object-cover"
            />
            <div className="min-w-0">
              <p className="text-[14px] font-semibold text-[#111827]">
                {t('galleryDetail.donation.supportTitle', {
                  name: photographer,
                })}
              </p>
              <p className="text-[13px] leading-5 text-[#6b7280]">
                {bio ||
                  t('galleryDetail.donation.defaultBio', {
                    name: photographer,
                  })}
              </p>
            </div>
          </div>
          <Button
            unstyled
            type="button"
            onClick={onClose}
            aria-label={t('galleryDetail.donation.close')}
            className="inline-flex size-6 shrink-0 cursor-pointer items-center justify-center rounded text-[#6b7280] transition hover:text-[#111827]"
          >
            <X size={18} strokeWidth={2} aria-hidden="true" />
          </Button>
        </div>

        <form
          className="flex flex-col gap-5 px-6 py-5"
          onSubmit={handleSubmit(onFormSubmit)}
        >
          <div>
            <p className="text-[16px] font-semibold text-[#111827]">
              {t('galleryDetail.donation.supportType', {
                defaultValue: "Choose How You'd Like to Support",
              })}
            </p>
            <div className="mt-3 flex items-center gap-5">
              <label className="flex cursor-pointer items-center gap-2.5">
                <input
                  type="radio"
                  value="one-time"
                  className="size-5 cursor-pointer accent-[#ee1c25]"
                  {...register('supportType')}
                />
                <span className="text-[15px] text-[#6b7280]">
                  One-Time Support
                </span>
              </label>
              <label className="flex cursor-pointer items-center gap-2.5">
                <input
                  type="radio"
                  value="monthly"
                  className="size-5 cursor-pointer accent-[#ee1c25]"
                  {...register('supportType')}
                />
                <span className="text-[15px] text-[#6b7280]">
                  Monthly Support
                </span>
              </label>
            </div>
          </div>

          <div>
            <p className="text-[16px] font-semibold text-[#111827]">
              {t('galleryDetail.donation.selectAmount')}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {GALLERY_DETAIL_DONATION_AMOUNTS.map((amount) => (
                <Button
                  unstyled
                  key={amount}
                  type="button"
                  onClick={() => handlePresetSelect(amount)}
                  className={amountButtonClass(
                    selectedAmount === amount && !customAmount,
                  )}
                >
                  ${amount}
                </Button>
              ))}
            </div>
            <div className="mt-3 flex items-center gap-2 rounded-lg border border-[#e5e7eb] bg-white px-3 py-1.5">
              <span className="shrink-0 text-[14px] font-medium text-[#6b7280]">
                $
              </span>
              <Input
                type="text"
                inputMode="decimal"
                placeholder={t('galleryDetail.donation.customAmount')}
                aria-label={t('galleryDetail.donation.customAmount')}
                inputClassName="min-w-0 flex-1 border-0 bg-transparent text-[14px] text-[#111827] outline-none placeholder:text-[#d1d5db] shadow-none focus:ring-0 px-0"
                labelClassName="hidden"
                {...register('customAmount', {
                  onChange: handleCustomAmountChange,
                })}
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
                <Input
                  id="gallery-donation-name"
                  type="text"
                  label={t('galleryDetail.donation.fullName')}
                  placeholder={t('galleryDetail.donation.fullNamePlaceholder')}
                  inputClassName={fieldClass}
                  labelClassName="text-[13px] font-medium text-[#6b7280] normal-case tracking-normal mb-1.5"
                  autoComplete="name"
                  error={errors.fullName}
                  {...register('fullName', { required: 'Name is required' })}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Input
                  id="gallery-donation-email"
                  type="email"
                  label={t('galleryDetail.donation.email')}
                  placeholder={t('galleryDetail.donation.emailPlaceholder')}
                  inputClassName={fieldClass}
                  labelClassName="text-[13px] font-medium text-[#6b7280] normal-case tracking-normal mb-1.5"
                  autoComplete="email"
                  error={errors.email}
                  {...register('email', { required: 'Email is required' })}
                />
              </div>
            </div>
          </div>

          <div className="flex gap-2 sm:justify-end">
            <Button
              unstyled
              type="button"
              disabled={isSubmitting}
              onClick={onClose}
              className="flex-1 cursor-pointer rounded-lg border border-[#d1d5db] bg-white px-4 py-2.5 text-[14px] font-semibold text-[#374151] transition hover:bg-[#f9fafb] disabled:opacity-50 sm:flex-none"
            >
              {t('galleryDetail.donation.cancel')}
            </Button>
            <Button
              unstyled
              type="submit"
              disabled={isSubmitting}
              className="flex-1 cursor-pointer inline-flex items-center justify-center gap-2 rounded-lg bg-[#ee1c25] px-4 py-2.5 text-[14px] font-semibold text-white shadow-sm transition hover:bg-[#d91921] disabled:opacity-50 sm:flex-none"
            >
              {isSubmitting ? (
                <>
                  <Loader2
                    size={16}
                    className="animate-spin"
                    aria-hidden="true"
                  />
                  <span>
                    {t('galleryDetail.donation.processing', 'Processing...')}
                  </span>
                </>
              ) : (
                <>
                  <span>{t('galleryDetail.donation.payNow')}</span>
                  <span aria-hidden="true">→</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    );
  },
);

GalleryDetailDonation.displayName = 'GalleryDetailDonation';

export default GalleryDetailDonation;
