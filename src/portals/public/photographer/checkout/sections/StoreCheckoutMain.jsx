import React, { memo, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ROUTES } from '@/shared/config';
import { Shell, SitePageLayout } from '@/shared/site-chrome';
import { Copy, Facebook, Twitter } from 'lucide-react';
import { PAGE_STACK } from '@/shared/ui/actionStyles';
import toast from 'react-hot-toast';

const INPUT_CLASS =
  'w-full rounded-[4px] border border-[#e2e8f0] bg-white px-3.5 py-3 text-[14px] text-[#111827] placeholder:text-[#9ca3af] outline-none transition focus:border-[#4048cd] focus:ring-1 focus:ring-[#4048cd]';
const LABEL_CLASS = 'mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-[#111827]';
const REQUIRED_CLASS = 'text-[10px] font-bold uppercase tracking-wider text-[#9ca3af]';

const WhatsAppIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.489-1.761-1.663-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01a1.183 1.183 0 0 0-.86.405c-.297.323-1.139 1.114-1.139 2.716s1.168 3.151 1.33 3.366c.162.215 2.296 3.504 5.562 4.914 2.327 1.002 3.109 1.094 4.238.92 1.144-.177 3.585-1.464 4.08-2.876.495-1.412.495-2.622.347-2.876-.149-.254-.545-.403-.842-.551zM12 21.8c-1.666 0-3.303-.43-4.743-1.246l-.34-.191-3.524.924.941-3.435-.21-.334A9.754 9.754 0 0 1 2.2 12c0-5.412 4.408-9.82 9.82-9.82 2.626 0 5.093 1.024 6.947 2.88 1.854 1.855 2.876 4.321 2.876 6.945C21.843 17.406 17.424 21.8 12 21.8zM24 12c0-6.627-5.373-12-12-12S0 5.373 0 12c0 2.124.552 4.12 1.517 5.864L0 24l6.326-1.472C8.04 23.473 9.972 24 12 24c6.627 0 12-5.373 12-12z" />
  </svg>
);

const StoreCheckoutMain = memo(() => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const product = location.state?.product;

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    mobile: '',
    city: '',
    state: '',
    zip: '',
    address: '',
    agreeTerms: false,
  });

  if (!product) {
    return <Navigate to={ROUTES.PHOTOGRAPHER_PROFILE} state={{ tab: 'store' }} replace />;
  }

  const cartItems = [
    { ...product, qty: 1 },
  ];

  const subtotal = cartItems.reduce((sum, item) => sum + parseFloat(item.price.replace(/[^0-9.]/g, '')) * item.qty, 0);
  const delivery = 20.00;
  const total = subtotal + delivery;

  const formatPrice = (val) => `$${val.toFixed(2)}`;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    if (!formData.agreeTerms) {
      toast.error('Please agree to the terms to place your order.');
      return;
    }
    if (!formData.firstName || !formData.address) {
      toast.error('Please fill in your details and delivery address.');
      return;
    }
    toast.success('Order placed successfully!');
    navigate(ROUTES.PHOTOGRAPHER_PROFILE, { state: { tab: 'store' } });
  };

  return (
    <SitePageLayout
      activeHref=""
      rootClassName="store-checkout-page-root bg-white"
      announcementTone="blue"
      newsletterVariant="page"
    >
      <section className="section-py pt-8 sm:pt-12">
        <Shell>
          <div className="mb-10">
            <h1 className="text-[28px] sm:text-[32px] font-bold text-[#111827]">Complete your order.</h1>
            <p className="text-[15px] text-[#6b7280] mt-1.5">Everything you need, in one simple checkout.</p>
          </div>

          <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_400px] gap-8">
            <div className={PAGE_STACK}>
              {/* 1. Your Details */}
              <div className="bg-[#f5f5f5] p-6 sm:p-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-[18px] sm:text-[20px] font-bold text-[#111827]">1. Your details</h2>
                  <span className={REQUIRED_CLASS}>REQUIRED</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                  <div>
                    <label htmlFor="firstName" className={LABEL_CLASS}>First Name</label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      placeholder="First name"
                      value={formData.firstName}
                      onChange={handleChange}
                      className={INPUT_CLASS}
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className={LABEL_CLASS}>Last Name / Alias</label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      placeholder="Name or alias"
                      value={formData.lastName}
                      onChange={handleChange}
                      className={INPUT_CLASS}
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="mobile" className={LABEL_CLASS}>Mobile Number</label>
                  <input
                    type="tel"
                    id="mobile"
                    name="mobile"
                    placeholder="04XX XXX XXX"
                    value={formData.mobile}
                    onChange={handleChange}
                    className={INPUT_CLASS}
                  />
                </div>
              </div>

              {/* 2. Delivery Details */}
              <div className="bg-[#f5f5f5] p-6 sm:p-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-[18px] sm:text-[20px] font-bold text-[#111827]">2. Where should we deliver?</h2>
                  <span className={REQUIRED_CLASS}>REQUIRED</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-5">
                  <div>
                    <label htmlFor="city" className={LABEL_CLASS}>City</label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      placeholder="enter city name"
                      value={formData.city}
                      onChange={handleChange}
                      className={INPUT_CLASS}
                    />
                  </div>
                  <div>
                    <label htmlFor="state" className={LABEL_CLASS}>State</label>
                    <input
                      type="text"
                      id="state"
                      name="state"
                      placeholder="state name"
                      value={formData.state}
                      onChange={handleChange}
                      className={INPUT_CLASS}
                    />
                  </div>
                  <div>
                    <label htmlFor="zip" className={LABEL_CLASS}>Zip Code</label>
                    <input
                      type="text"
                      id="zip"
                      name="zip"
                      placeholder="zip code"
                      value={formData.zip}
                      onChange={handleChange}
                      className={INPUT_CLASS}
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="address" className={LABEL_CLASS}>Delivery Address</label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    placeholder="write delivery address"
                    value={formData.address}
                    onChange={handleChange}
                    className={INPUT_CLASS}
                  />
                </div>
              </div>
            </div>

            {/* Right Column: Order Summary */}
            <div className="lg:sticky lg:top-[100px] self-start">
              <div className="bg-[#f5f5f5] p-6 sm:p-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-[18px] sm:text-[20px] font-bold text-[#111827]">Your order</h2>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#9ca3af]">{cartItems.length} ITEMS</span>
                </div>

                <div className="flex flex-col gap-6 mb-8">
                  {cartItems.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4">
                      <img src={item.image} alt={item.title} className="w-12 h-12 rounded-lg object-cover shrink-0 bg-white" />
                      <div className="flex-1 min-w-0">
                        <p className="text-[15px] font-bold text-[#111827] truncate">{item.title}</p>
                        <p className="text-[13px] text-[#9ca3af] mt-0.5">Quantity x {item.qty}</p>
                      </div>
                      <p className="text-[17px] font-bold text-[#111827]">{item.price}</p>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col gap-3 mb-6 text-[14px] text-[#9ca3af]">
                  <div className="flex justify-between items-center">
                    <span>Subtotal</span>
                    <span className="text-[16px] font-bold text-[#111827]">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Delivery</span>
                    <span className="text-[16px] font-bold text-[#111827]">{formatPrice(delivery)}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-6">
                  <span className="text-[22px] font-bold text-[#111827]">Total</span>
                  <span className="text-[22px] font-bold text-[#111827]">{formatPrice(total)}</span>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#ee1c25] hover:bg-[#d01820] text-white font-bold text-[13px] py-3.5 rounded-[4px] uppercase tracking-wider transition"
                >
                  Place Order
                </button>

                <div className="mt-5 flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="agreeTerms"
                    name="agreeTerms"
                    checked={formData.agreeTerms}
                    onChange={handleChange}
                    className="mt-1 size-4 rounded border-[#d1d5db] text-[#ee1c25] focus:ring-[#ee1c25]"
                  />
                  <label htmlFor="agreeTerms" className="text-[10px] leading-[15px] text-[#9ca3af] mt-0.5">
                    By placing your order, you confirm your details are correct and agree to my12Photo's terms.
                  </label>
                </div>
              </div>
            </div>
          </form>

          {/* Social Banner */}
          <div className="mt-12 rounded-[12px] bg-[#111b2b] p-8 sm:p-10 text-white relative overflow-hidden">
            {/* Subtle highlight gradient to match screenshot */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/[0.03] to-transparent pointer-events-none"></div>
            
            <div className="relative z-10">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-white/20 px-3 py-1 text-[10px] font-medium mb-5">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                Community Support
              </div>
              <h2 className="text-[22px] sm:text-[26px] font-semibold leading-[1.3] max-w-2xl">
                Support this photographer by sharing their profile with your friends!
              </h2>
              <p className="mt-2.5 text-[14px] text-white/70 max-w-2xl">
                Share their profile on social media and help them get more visibility and votes.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <button type="button" className="inline-flex items-center gap-2 rounded-full bg-[#10b981] hover:bg-[#059669] px-4 py-2 text-[12px] font-bold text-white transition">
                  <WhatsAppIcon /> WhatsApp
                </button>
                <button type="button" className="inline-flex items-center gap-2 rounded-full bg-[#3b82f6] hover:bg-[#2563eb] px-4 py-2 text-[12px] font-bold text-white transition">
                  <Facebook size={14} /> Facebook
                </button>
                <button type="button" className="inline-flex items-center justify-center rounded-full bg-[#374151] hover:bg-[#1f2937] size-8 text-white transition">
                  <Twitter size={12} fill="currentColor" stroke="none" />
                </button>
                <button type="button" className="inline-flex items-center gap-2 rounded-full bg-white hover:bg-gray-100 px-4 py-2 text-[12px] font-bold text-[#111827] transition">
                  <Copy size={14} /> Copy Profile Link
                </button>
              </div>
            </div>
          </div>
        </Shell>
      </section>
    </SitePageLayout>
  );
});

StoreCheckoutMain.displayName = 'StoreCheckoutMain';

export default StoreCheckoutMain;
