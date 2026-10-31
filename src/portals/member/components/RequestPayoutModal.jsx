import { Loader2, X } from 'lucide-react';
import React, { memo, useEffect, useId, useState } from 'react';
import { createPortal } from 'react-dom';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import {
  formatPrizeAmount,
  requestUserPayoutApi,
} from '@/shared/api/payments.api';

const PAYOUT_TYPES = [
  { key: 'prizeMoney', label: 'Prize Money', value: 'Prize Money' },
  { key: 'donations', label: 'Donations', value: 'Donations' },
  { key: 'photoSales', label: 'Photo Sales', value: 'Photo Sales' },
  { key: 'storeSales', label: 'Store Sales', value: 'Store Sales' },
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

    const [selectedType, setSelectedType] = useState('Prize Money');
    const [amount, setAmount] = useState('');
    const [accountNumber, setAccountNumber] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
      if (open) {
        const matching = PAYOUT_TYPES.find((pt) => pt.key === defaultType);
        setSelectedType(matching ? matching.value : 'Prize Money');
        setAmount('');
        setAccountNumber('');
        setError('');
      }
    }, [open, defaultType]);

    if (!open) return null;

    const currentKey =
      PAYOUT_TYPES.find((pt) => pt.value === selectedType)?.key || 'prizeMoney';
    const currentAvailable = availableBalances[currentKey] ?? 0;

    const handleMaxClick = () => {
      if (currentAvailable > 0) {
        setAmount(String(currentAvailable));
        setError('');
      }
    };

    const handleSubmit = async (event) => {
      event.preventDefault();
      setError('');

      const numericAmount = Number(amount);
      if (!amount || Number.isNaN(numericAmount) || numericAmount <= 0) {
        setError(
          t(
            'prizePayments.payoutModal.invalidAmount',
            'Please enter a valid payout amount.',
          ),
        );
        return;
      }

      if (currentAvailable > 0 && numericAmount > currentAvailable) {
        setError(
          t(
            'prizePayments.payoutModal.amountExceeds',
            'Amount exceeds current available balance.',
          ),
        );
        return;
      }

      if (!accountNumber.trim()) {
        setError(
          t(
            'prizePayments.payoutModal.accountRequired',
            'Account number or payment details are required.',
          ),
        );
        return;
      }

      try {
        setIsSubmitting(true);
        await requestUserPayoutApi({
          type: selectedType,
          amount: numericAmount,
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
          className="flex max-h-[min(92vh,850px)] w-full max-w-[540px] flex-col overflow-hidden rounded-2xl bg-white shadow-[0_22px_70px_rgba(14,20,35,0.25)]"
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
                    'Withdraw your available balance to your preferred payment account.',
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
            <div className="flex flex-col gap-5 overflow-y-auto px-6 py-6 sm:px-8">
              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-3.5 text-[14px] text-red-700">
                  {error}
                </div>
              )}

              {/* Payout Category */}
              <div>
                <label className="mb-2 block text-[14px] font-medium text-[#161c27]">
                  {t('prizePayments.payoutModal.payoutType', 'Payout Category')}
                </label>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {PAYOUT_TYPES.map(({ key, label, value }) => {
                    const isSelected = selectedType === value;
                    const bal = availableBalances[key] ?? 0;
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setSelectedType(value)}
                        className={`flex flex-col items-center justify-center rounded-xl border p-2.5 text-center transition ${
                          isSelected
                            ? 'border-[#ee1c25] bg-[#fff5f5] text-[#ee1c25] font-semibold ring-1 ring-[#ee1c25]'
                            : 'border-[#e2e8f0] bg-white text-[#494453] hover:border-[#cbd5e1]'
                        }`}
                      >
                        <span className="text-[13px] leading-tight">
                          {t(`prizePayments.payoutModal.types.${key}`, label)}
                        </span>
                        <span className="mt-1 text-[11px] text-[#9ca3af]">
                          {formatPrizeAmount(bal)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Amount */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-[14px] font-medium text-[#161c27]">
                    {t('prizePayments.payoutModal.amount', 'Payout Amount ($)')}
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-[12px] text-[#15803d]">
                      {t('prizePayments.payoutModal.availableBalance', {
                        amount: formatPrizeAmount(currentAvailable),
                        defaultValue: `Available: ${formatPrizeAmount(currentAvailable)}`,
                      })}
                    </span>
                    {currentAvailable > 0 && (
                      <button
                        type="button"
                        onClick={handleMaxClick}
                        className="text-[12px] font-semibold text-[#ee1c25] hover:underline"
                      >
                        Max
                      </button>
                    )}
                  </div>
                </div>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
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

              {/* Account Number / Payment Detail */}
              <div>
                <label className="mb-2 block text-[14px] font-medium text-[#161c27]">
                  {t(
                    'prizePayments.payoutModal.accountNumber',
                    'Account / Phone / PayPal / IBAN',
                  )}
                </label>
                <Input
                  type="text"
                  value={accountNumber}
                  onChange={(event) => setAccountNumber(event.target.value)}
                  placeholder={t(
                    'prizePayments.payoutModal.accountNumberPlaceholder',
                    'e.g. (702) 555-0122 or user@paypal.com',
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
