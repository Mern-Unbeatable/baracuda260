import { Loader2, X } from 'lucide-react';
import React, { memo, useEffect, useId, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import {
  formatPrizeAmount,
  requestUserPayoutApi,
} from '@/shared/api/payments.api';

const PAYOUT_OPTIONS = [
  { key: 'prizeMoney', apiType: 'Prize Money', labelKey: 'prizeMoney' },
  { key: 'donations', apiType: 'Donations', labelKey: 'donations' },
  { key: 'photoSales', apiType: 'Photo Sales', labelKey: 'photoSales' },
  { key: 'storeSales', apiType: 'Store Sales', labelKey: 'storeSales' },
];

const RequestPayoutModal = memo(
  ({
    open,
    onClose,
    defaultType = 'prizeMoney',
    availableBalances = {},
    onSuccess,
  }) => {
    const { t } = useTranslation();
    const titleId = useId();

    const [selectedType, setSelectedType] = useState(defaultType);
    const [amount, setAmount] = useState('');
    const [accountNumber, setAccountNumber] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
      if (!open) return;
      const nextType = PAYOUT_OPTIONS.some((opt) => opt.key === defaultType)
        ? defaultType
        : 'prizeMoney';
      setSelectedType(nextType);
      setAmount('');
      setAccountNumber('');
      setError('');
    }, [open, defaultType]);

    const selectedOption = useMemo(
      () =>
        PAYOUT_OPTIONS.find((opt) => opt.key === selectedType) ||
        PAYOUT_OPTIONS[0],
      [selectedType],
    );

    const availableAmount = Number(availableBalances[selectedType] ?? 0);
    const availableLabel = formatPrizeAmount(availableAmount);

    if (!open) return null;

    const handleSelectType = (key) => {
      setSelectedType(key);
      setAmount('');
      setError('');
    };

    const handleUseMax = () => {
      if (!(availableAmount > 0)) return;
      setAmount(String(availableAmount));
      setError('');
    };

    const handleSubmit = async (event) => {
      event.preventDefault();
      setError('');

      const parsedAmount = Number(amount);

      if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
        setError(
          t(
            'prizePayments.payoutModal.amountRequired',
            'Enter a valid payout amount.',
          ),
        );
        return;
      }

      if (parsedAmount > availableAmount) {
        setError(
          t(
            'prizePayments.payoutModal.amountTooHigh',
            'Amount cannot exceed your available balance.',
          ),
        );
        return;
      }

      if (!accountNumber.trim()) {
        setError(
          t(
            'prizePayments.payoutModal.accountRequired',
            'PayPal account is required.',
          ),
        );
        return;
      }

      try {
        setIsSubmitting(true);
        await requestUserPayoutApi({
          type: selectedOption.apiType,
          amount: parsedAmount,
          accountNumber: accountNumber.trim(),
        });

        toast.success(
          t(
            'prizePayments.payoutModal.success',
            'Payout requested successfully!',
          ),
        );
        onSuccess?.();
        onClose();
      } catch (err) {
        const msg =
          err?.response?.data?.message ||
          err?.message ||
          t('common.error', 'Failed to request payout.');
        setError(msg);
        toast.error(msg);
      } finally {
        setIsSubmitting(false);
      }
    };

    return createPortal(
      <div
        className="fixed inset-0 z-130 flex items-center justify-center bg-black/50 p-4 backdrop-blur-[2px]"
        role="presentation"
        onClick={onClose}
      >
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          className="flex w-full max-w-[640px] flex-col overflow-hidden rounded-2xl bg-white shadow-[0_22px_70px_rgba(14,20,35,0.25)]"
          onClick={(event) => event.stopPropagation()}
        >
          <header className="border-b border-[#edf0f3] px-6 pb-5 pt-6 sm:px-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2
                  id={titleId}
                  className="text-[22px] font-bold leading-tight text-[#0d0d14]"
                >
                  {t('prizePayments.payoutModal.title', 'Request Payout')}
                </h2>
                <p className="mt-1 text-[14px] leading-5 text-[#6b7280]">
                  {t(
                    'prizePayments.payoutModal.subtitle',
                    'Payouts are sent via PayPal. Enter your PayPal account to receive your available balance.',
                  )}
                </p>
              </div>
              <Button
                unstyled
                type="button"
                onClick={onClose}
                aria-label={t('common.close', 'Close')}
                className="inline-flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full border border-black/10 text-[#0d0d14] transition hover:bg-[#f3f4f6]"
              >
                <X size={18} strokeWidth={2} aria-hidden="true" />
              </Button>
            </div>
          </header>

          <form
            onSubmit={handleSubmit}
            className="flex min-h-0 flex-1 flex-col"
          >
            <div className="flex flex-col gap-5 px-6 py-6 sm:px-8">
              {error ? (
                <div className="rounded-xl border border-red-200 bg-red-50 p-3.5 text-[14px] text-red-700">
                  {error}
                </div>
              ) : null}

              <div>
                <p className="mb-2.5 text-[14px] font-medium text-[#161c27]">
                  {t(
                    'prizePayments.payoutModal.payoutType',
                    'Payout Category',
                  )}
                </p>
                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  {PAYOUT_OPTIONS.map((option) => {
                    const balance = Number(availableBalances[option.key] ?? 0);
                    const isActive = selectedType === option.key;
                    return (
                      <button
                        key={option.key}
                        type="button"
                        onClick={() => handleSelectType(option.key)}
                        className={`cursor-pointer rounded-xl border px-3.5 py-3 text-left transition ${
                          isActive
                            ? 'border-[#ee1c25] bg-[#fff5f5] text-[#ee1c25]'
                            : 'border-[#e2e8f0] bg-white text-[#161c27] hover:border-[#cbd5e1]'
                        }`}
                      >
                        <span className="block text-[13px] font-semibold leading-5 sm:text-[14px]">
                          {t(
                            `prizePayments.payoutModal.types.${option.labelKey}`,
                            option.apiType,
                          )}{' '}
                          ({formatPrizeAmount(balance)})
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <label className="text-[14px] font-medium text-[#161c27]">
                    {t('prizePayments.payoutModal.amount', 'Payout Amount ($)')}
                  </label>
                  <div className="flex items-center gap-2 text-[13px]">
                    <span className="font-medium text-[#15803d]">
                      {t('prizePayments.payoutModal.availableBalance', {
                        amount: availableLabel,
                        defaultValue: `Available: ${availableLabel}`,
                      })}
                    </span>
                    <button
                      type="button"
                      onClick={handleUseMax}
                      disabled={!(availableAmount > 0)}
                      className="cursor-pointer font-semibold text-[#ee1c25] transition hover:underline disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      {t('prizePayments.payoutModal.max', 'Max')}
                    </button>
                  </div>
                </div>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={amount}
                  onChange={(event) => setAmount(event.target.value)}
                  placeholder={t(
                    'prizePayments.payoutModal.amountPlaceholder',
                    'Enter amount to withdraw',
                  )}
                  inputClassName="w-full rounded-xl border border-[#e2e8f0] px-4 py-2.5 text-[15px] text-[#161c27] outline-none focus:border-[#ee1c25]"
                  labelClassName="hidden"
                />
              </div>

              <div>
                <label className="mb-2 block text-[14px] font-medium text-[#161c27]">
                  {t(
                    'prizePayments.payoutModal.accountNumber',
                    'PayPal Account',
                  )}
                </label>
                <Input
                  type="text"
                  value={accountNumber}
                  onChange={(event) => setAccountNumber(event.target.value)}
                  placeholder={t(
                    'prizePayments.payoutModal.accountNumberPlaceholder',
                    'e.g. you@email.com or your PayPal phone number',
                  )}
                  inputClassName="w-full rounded-xl border border-[#e2e8f0] px-4 py-2.5 text-[15px] text-[#161c27] outline-none focus:border-[#ee1c25]"
                  labelClassName="hidden"
                />
              </div>
            </div>

            <footer className="flex items-center justify-end gap-3 border-t border-[#edf0f3] px-6 py-4 sm:px-8">
              <Button
                unstyled
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="rounded-xl border border-[#e2e8f0] px-5 py-2.5 text-[14px] font-medium text-[#494453] hover:bg-black/5"
              >
                {t('prizePayments.payoutModal.cancel', 'Cancel')}
              </Button>
              <Button
                unstyled
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 rounded-xl bg-[#ee1c25] px-6 py-2.5 text-[14px] font-semibold text-white transition hover:bg-[#d01720] disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin text-white" />
                    <span>
                      {t(
                        'prizePayments.payoutModal.submitting',
                        'Submitting...',
                      )}
                    </span>
                  </>
                ) : (
                  <span>
                    {t('prizePayments.payoutModal.submit', 'Submit Request')}
                  </span>
                )}
              </Button>
            </footer>
          </form>
        </div>
      </div>,
      document.body,
    );
  },
);

RequestPayoutModal.displayName = 'RequestPayoutModal';

export default RequestPayoutModal;
