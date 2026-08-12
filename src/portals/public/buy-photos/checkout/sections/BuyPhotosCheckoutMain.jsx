import React, { memo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, CreditCard, Lock } from 'lucide-react';
import { ROUTES } from '@/shared/config';
import {
  createBuyPurchaseRecord,
  formatBuyPhotoPrice,
  saveLastBuyPurchase,
} from '@/shared/data/buyPhotos';
import { PAGE_STACK } from '@/shared/ui/actionStyles';
import { MarketingButton, MarketingCard } from '@/shared/ui/marketing';
import { Shell, SitePageLayout } from '@/shared/site-chrome';

const INPUT_CLASS =
  'w-full rounded-lg border border-[#cbc3d5] bg-white px-4 py-4 text-[16px] text-[#161c27] placeholder:text-[#6b7280] outline-none transition focus:border-[#ee1c25] focus:ring-2 focus:ring-[#ee1c25]/20';

const BuyPhotosCheckoutMain = memo(() => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const photo = location.state?.photo;

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('paypal');

  if (!photo) {
    return <Navigate to={ROUTES.BUY_PHOTOS} replace />;
  }

  const subtotal = photo.priceAmount ?? 0;
  const totalLabel = photo.price ?? formatBuyPhotoPrice(subtotal);

  const handleSubmit = (event) => {
    event.preventDefault();

    const purchase = createBuyPurchaseRecord({
      photo,
      buyerName: fullName.trim() || t('buyPhotos.checkout.defaultBuyerName'),
      buyerEmail: email.trim() || t('buyPhotos.checkout.defaultBuyerEmail'),
    });

    saveLastBuyPurchase(purchase);
    navigate(ROUTES.BUY_PHOTOS_SUCCESS, { state: { purchase } });
  };

  return (
    <SitePageLayout
      activeHref={ROUTES.BUY_PHOTOS}
      rootClassName="buy-photos-checkout-page-root"
      announcementTone="navy"
      newsletterVariant="page"
    >
      <section className="bg-white section-py">
        <Shell>
          <h1 className="text-[32px] font-bold leading-tight text-[#0d0d14] sm:text-[40px]">
            {t('buyPhotos.checkout.title')}
          </h1>

          <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-10">
            <div className={PAGE_STACK}>
              <MarketingCard variant="filled" className="p-5 sm:p-6">
                <h2 className="text-[18px] font-bold text-[#0d0d14]">
                  {t('buyPhotos.checkout.summary.title')}
                </h2>

                <div className="mt-5 flex items-center gap-4 border-b border-black/10 pb-5">
                  <img
                    src={photo.image}
                    alt={photo.title}
                    width={72}
                    height={72}
                    className="size-18 shrink-0 rounded-lg object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[16px] font-bold text-[#0d0d14]">{photo.title}</p>
                    <p className="mt-1 text-[14px] text-[#6b7280]">
                      {t('buyPhotos.checkout.summary.by', { name: photo.photographer })}
                    </p>
                  </div>
                  <p className="shrink-0 text-[18px] font-bold text-[#4048cd]">{totalLabel}</p>
                </div>

                <dl className="mt-5 space-y-3 text-[15px]">
                  <div className="flex items-center justify-between gap-4">
                    <dt className="text-[#6b7280]">{t('buyPhotos.checkout.summary.subtotal')}</dt>
                    <dd className="font-medium text-[#0d0d14]">{totalLabel}</dd>
                  </div>
                  <div className="flex items-center justify-between gap-4 border-t border-black/10 pt-3">
                    <dt className="text-[16px] font-bold text-[#0d0d14]">
                      {t('buyPhotos.checkout.summary.total')}
                    </dt>
                    <dd className="text-[20px] font-bold text-[#0d0d14]">{totalLabel}</dd>
                  </div>
                </dl>
              </MarketingCard>

              <div className="flex items-start gap-3 rounded-xl bg-[#f5f5f5] px-4 py-4 text-[14px] leading-6 text-[#6b7280]">
                <Lock size={18} strokeWidth={2} aria-hidden="true" className="mt-0.5 shrink-0" />
                <p>{t('buyPhotos.checkout.securityNotice')}</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className={PAGE_STACK} noValidate>
              <MarketingCard variant="filled" className="p-5 sm:p-6">
                <h2 className="text-[18px] font-bold text-[#0d0d14]">
                  {t('buyPhotos.checkout.buyer.title')}
                </h2>

                <div className="mt-5 flex flex-col gap-5">
                  <div>
                    <label htmlFor="checkout-full-name" className="mb-2 block text-[15px] text-[#494453]">
                      {t('buyPhotos.checkout.buyer.fullName')}
                    </label>
                    <input
                      id="checkout-full-name"
                      type="text"
                      autoComplete="name"
                      value={fullName}
                      onChange={(event) => setFullName(event.target.value)}
                      placeholder={t('buyPhotos.checkout.buyer.fullNamePlaceholder')}
                      className={INPUT_CLASS}
                    />
                  </div>

                  <div>
                    <label htmlFor="checkout-email" className="mb-2 block text-[15px] text-[#494453]">
                      {t('buyPhotos.checkout.buyer.email')}
                    </label>
                    <input
                      id="checkout-email"
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder={t('buyPhotos.checkout.buyer.emailPlaceholder')}
                      className={INPUT_CLASS}
                    />
                    <p className="mt-2 text-[13px] text-[#6b7280]">
                      {t('buyPhotos.checkout.buyer.emailHint')}
                    </p>
                  </div>
                </div>
              </MarketingCard>

              <MarketingCard variant="filled" className="p-5 sm:p-6">
                <h2 className="text-[18px] font-bold text-[#0d0d14]">
                  {t('buyPhotos.checkout.payment.title')}
                </h2>

                <label className="mt-5 flex cursor-pointer items-start gap-3 rounded-xl border border-[#4048cd]/20 bg-[#f8f9ff] p-4">
                  <input
                    type="radio"
                    name="payment-method"
                    value="paypal"
                    checked={paymentMethod === 'paypal'}
                    onChange={() => setPaymentMethod('paypal')}
                    className="mt-1 size-4 accent-[#4048cd]"
                  />
                  <span className="flex-1">
                    <span className="flex items-center gap-2 text-[16px] font-bold text-[#0d0d14]">
                      PayPal
                      <CreditCard size={18} strokeWidth={2} aria-hidden="true" className="text-[#6b7280]" />
                    </span>
                    <span className="mt-1 block text-[14px] leading-6 text-[#6b7280]">
                      {t('buyPhotos.checkout.payment.paypalDescription')}
                    </span>
                  </span>
                </label>

                <MarketingButton type="submit" className="mt-5 w-full rounded-lg py-3.5">
                  {t('buyPhotos.checkout.payment.continuePaypal')}
                  <ArrowRight size={18} strokeWidth={2} aria-hidden="true" />
                </MarketingButton>

                <p className="mt-4 text-center text-[12px] leading-5 text-[#9ca3af]">
                  {t('buyPhotos.checkout.payment.termsNotice')}
                </p>
              </MarketingCard>
            </form>
          </div>
        </Shell>
      </section>
    </SitePageLayout>
  );
});

BuyPhotosCheckoutMain.displayName = 'BuyPhotosCheckoutMain';

export default BuyPhotosCheckoutMain;
