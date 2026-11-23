import React, { useEffect } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { ROUTES } from '@/shared/config';
import { Shell, SitePageLayout } from '@/shared/site-chrome';

/**
 * PayPal return/cancel landing page.
 * Routes the token to the flow that started the checkout (sessionStorage keys).
 */
const PaymentReturn = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const isCancel = location.pathname.includes('/payment/cancel');
    const nextParams = new URLSearchParams(searchParams);
    if (isCancel) nextParams.set('cancelled', '1');
    const qs = nextParams.toString();
    const withQuery = (path) => (qs ? `${path}?${qs}` : path);

    const pendingStorePurchase = sessionStorage.getItem(
      'pendingStoreProductPurchase',
    );
    if (pendingStorePurchase) {
      navigate(withQuery(ROUTES.PHOTOGRAPHER_STORE_CHECKOUT), { replace: true });
      return;
    }

    if (sessionStorage.getItem('pendingBuyPhotoPaymentId')) {
      navigate(withQuery(ROUTES.BUY_PHOTOS_SUCCESS), { replace: true });
      return;
    }

    if (sessionStorage.getItem('pendingStorePromotionPaymentId')) {
      navigate(withQuery(ROUTES.USER_MY_STORE), { replace: true });
      return;
    }

    navigate(ROUTES.HOME, { replace: true });
  }, [navigate, searchParams, location.pathname]);

  return (
    <SitePageLayout
      activeHref=""
      rootClassName="payment-return-root bg-white"
      announcementTone="blue"
      newsletterVariant="page"
    >
      <section className="section-py pt-8 sm:pt-12">
        <Shell>
          <div className="flex min-h-[240px] flex-col items-center justify-center gap-2 text-center">
            <p className="text-[18px] font-semibold text-[#111827]">
              Returning from PayPal…
            </p>
            <p className="text-[14px] text-[#6b7280]">
              Finishing your payment. Please wait.
            </p>
          </div>
        </Shell>
      </section>
    </SitePageLayout>
  );
};

export default PaymentReturn;
