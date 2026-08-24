import { useTranslation } from 'react-i18next';
import React, { memo } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Check, Download } from 'lucide-react';
import { ROUTES } from '@/shared/config';
import { loadLastBuyPurchase } from '@/shared/data/buyPhotos';
import MarketingButton from '@/components/marketing/MarketingButton/MarketingButton';
import MarketingCard from '@/components/marketing/MarketingCard/MarketingCard';
import { Shell, SitePageLayout } from '@/shared/site-chrome';

const BuyPhotosSuccessMain = memo(() => {
  const { t } = useTranslation();
  const location = useLocation();
  const purchase = location.state?.purchase ?? loadLastBuyPurchase();

  if (!purchase) {
    return <Navigate to={ROUTES.BUY_PHOTOS} replace />;
  }

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = purchase.image;
    link.download = `${purchase.title.replace(/\s+/g, '-').toLowerCase()}.jpg`;
    link.click();
  };

  return (
    <SitePageLayout
      activeHref={ROUTES.BUY_PHOTOS}
      rootClassName="buy-photos-success-page-root"
      announcementTone="navy"
      newsletterVariant="page"
    >
      <section className="bg-white section-py">
        <Shell>
          <div className="mx-auto max-w-2xl">
            <MarketingCard variant="filled" className="overflow-hidden p-6 sm:p-8">
              <div className="flex flex-col items-center text-center">
                <span className="inline-flex size-16 items-center justify-center rounded-full bg-[#0d0d14] text-white">
                  <Check size={32} strokeWidth={2.5} aria-hidden="true" />
                </span>
                <h1 className="mt-5 text-[28px] font-bold leading-tight text-[#0d0d14] sm:text-[32px]">
                  {t('buyPhotos.success.title')}
                </h1>
                <p className="mt-3 max-w-md text-[15px] leading-6 text-[#6b7280]">
                  {t('buyPhotos.success.subtitle')}
                </p>
              </div>

              <div className="mt-8 rounded-xl bg-[#f5f5f5] p-4 sm:p-5">
                <div className="flex items-center gap-4">
                  <img
                    src={purchase.image}
                    alt={purchase.title}
                    width={72}
                    height={72}
                    className="size-18 shrink-0 rounded-lg object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[16px] font-bold text-[#0d0d14]">{purchase.title}</p>
                    <p className="mt-1 text-[14px] text-[#6b7280]">
                      {t('buyPhotos.success.by', { name: purchase.photographer })}
                    </p>
                  </div>
                  <p className="shrink-0 text-[22px] font-bold text-[#4048cd]">{purchase.price}</p>
                </div>
              </div>

              <div className="mt-8 border-t border-black/10 pt-6">
                <h2 className="text-[12px] font-semibold uppercase tracking-[1.2px] text-[#9ca3af]">
                  {t('buyPhotos.success.transaction.title')}
                </h2>
                <dl className="mt-4 grid gap-4 sm:grid-cols-2">
                  {[
                    {
                      label: t('buyPhotos.success.transaction.id'),
                      value: purchase.id,
                    },
                    {
                      label: t('buyPhotos.success.transaction.date'),
                      value: purchase.date,
                    },
                    {
                      label: t('buyPhotos.success.transaction.paymentMethod'),
                      value: purchase.paymentMethod,
                    },
                    {
                      label: t('buyPhotos.success.transaction.license'),
                      value: purchase.license,
                    },
                  ].map((row) => (
                    <div key={row.label}>
                      <dt className="text-[12px] font-semibold uppercase tracking-[1px] text-[#9ca3af]">
                        {row.label}
                      </dt>
                      <dd className="mt-1 text-[15px] font-medium text-[#0d0d14]">{row.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              <MarketingButton
                type="button"
                className="mt-8 w-full rounded-lg py-3.5"
                onClick={handleDownload}
              >
                <Download size={18} strokeWidth={2} aria-hidden="true" />
                {t('buyPhotos.success.downloadPhoto')}
              </MarketingButton>
            </MarketingCard>
          </div>
        </Shell>
      </section>
    </SitePageLayout>
  );
});

BuyPhotosSuccessMain.displayName = 'BuyPhotosSuccessMain';

export default BuyPhotosSuccessMain;
