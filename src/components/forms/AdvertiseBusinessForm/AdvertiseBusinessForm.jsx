import { Globe, MapPin, Store, Upload } from 'lucide-react';
import React, { memo, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Trans } from 'react-i18next';
import MarketingButton from '@/components/marketing/MarketingButton/MarketingButton';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

const DURATION_OPTIONS = [
  { days: 7, price: 35, start: '7 Aug 2026', end: '24 Aug 2026' },
  {
    days: 14,
    price: 60,
    start: '17 Aug 2026',
    end: '31 Aug 2026',
    popular: true,
  },
  { days: 30, price: 100, start: '17 Aug 2026', end: '16 Sept 2026' },
];

const inputClass =
  'w-full rounded-[8px] border border-[#e5e7eb] bg-white px-4 py-2.5 text-[13px] text-[#111827] placeholder:text-[#9ca3af] outline-none transition focus:border-[#4048cd]/40 focus:ring-2 focus:ring-[#4048cd]/20';

const AdvertiseBusinessForm = memo(
  ({ className = '', defaultDuration = 14, onSubmit }) => {
    const [selectedDuration, setSelectedDuration] = useState(defaultDuration);
    const [businessType, setBusinessType] = useState('online');

    const {
      register,
      handleSubmit,
      formState: { errors },
    } = useForm({
      defaultValues: {
        name: '',
        email: '',
        phone: '',
        businessName: '',
        page: 'Home',
        website: '',
        description: '',
        location: '',
      },
    });

    const selected = useMemo(
      () =>
        DURATION_OPTIONS.find((option) => option.days === selectedDuration) ??
        DURATION_OPTIONS[1],
      [selectedDuration],
    );

    const onFormSubmit = (data) => {
      onSubmit?.({ ...data, duration: selected, businessType });
    };

    return (
      <section
        className={`overflow-hidden rounded-2xl border border-[#e5e7eb] bg-white ${className}`}
      >
        <header className="bg-[#FDE8E9] px-6 py-6 sm:px-8">
          <h2 className="text-[20px] lg:text-[38px] font-semibold leading-tight text-[#202531]">
            Tell Us About Your Business
          </h2>
          <p className="mt-2 lg:text-[18px] text-[16px] lg:leading-[1.45] text-[#555b68]">
            This information will be associated with your advertiser account,
            commercial invoices, and campaign billing.
          </p>
        </header>

        <form
          onSubmit={handleSubmit(onFormSubmit)}
          className="space-y-6 px-6 py-6 sm:px-8 sm:py-7"
        >
          <div className="grid grid-cols-1 gap-4">
            <Input
              id="advertise-name"
              label="Name"
              placeholder="Enter your full name..."
              error={errors.name}
              inputClassName={inputClass}
              labelClassName="block text-[14px] font-semibold text-[#202531] mb-2 tracking-normal normal-case"
              {...register('name', { required: 'Name is required' })}
            />

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Input
                id="advertise-email"
                type="email"
                label="Email"
                placeholder="Enter your email..."
                error={errors.email}
                inputClassName={inputClass}
                labelClassName="block text-[14px] font-semibold text-[#202531] mb-2 tracking-normal normal-case"
                {...register('email', { required: 'Email is required' })}
              />
              <Input
                id="advertise-phone"
                type="tel"
                label="Phone"
                placeholder="Enter your phone number..."
                error={errors.phone}
                inputClassName={inputClass}
                labelClassName="block text-[14px] font-semibold text-[#202531] mb-2 tracking-normal normal-case"
                {...register('phone', { required: 'Phone is required' })}
              />
            </div>
          </div>

          <div className="grid w-full max-w-105 grid-cols-2 rounded-full border border-[#e5e7eb] bg-[#f5f6fa] p-1">
            <Button
              unstyled
              type="button"
              onClick={() => setBusinessType('local')}
              className={`inline-flex min-w-0 items-center justify-center gap-1.5 rounded-full px-2 py-1.5 text-[11px] font-semibold whitespace-nowrap transition sm:gap-2 sm:px-4 sm:text-[12px] ${
                businessType === 'local'
                  ? 'bg-white text-[#111827] shadow-sm'
                  : 'text-[#6b7280]'
              }`}
            >
              <span className="inline-flex h-3.5 w-3.5 items-center justify-center rounded-[3px] border border-[#ee1c25] text-[#ee1c25]">
                <Store size={9} strokeWidth={2.2} />
              </span>
              Local Business
            </Button>
            <Button
              unstyled
              type="button"
              onClick={() => setBusinessType('online')}
              className={`inline-flex min-w-0 items-center justify-center gap-1.5 rounded-full px-2 py-1.5 text-[11px] font-semibold whitespace-nowrap transition sm:gap-2 sm:px-4 sm:text-[12px] ${
                businessType === 'online'
                  ? 'bg-white text-[#111827] shadow-sm'
                  : 'text-[#6b7280]'
              }`}
            >
              <span className="inline-flex h-3.5 w-3.5 items-center justify-center rounded-[3px] border border-[#ee1c25] text-[#ee1c25]">
                <Globe size={9} strokeWidth={2.2} />
              </span>
              Online Business
            </Button>
          </div>

          <div className="space-y-4">
            <Input
              id="advertise-businessName"
              label={
                <span className="block text-[14px] font-semibold text-[#202531] mb-2 tracking-normal normal-case">
                  Business Name <span className="text-[#ee1c25]">*</span>
                </span>
              }
              placeholder="Your Business Name"
              error={errors.businessName}
              inputClassName={inputClass}
              {...register('businessName', {
                required: 'Business Name is required',
              })}
            />

            <div className="block space-y-2">
              <label
                htmlFor="advertise-page"
                className="block text-[14px] font-semibold text-[#202531] tracking-normal normal-case"
              >
                Select Page <span className="text-[#ee1c25]">*</span>
              </label>
              <select
                id="advertise-page"
                className={`h-11 ${inputClass}`}
                {...register('page')}
              >
                <option value="Home">Home</option>
                <option value="Gallery">Gallery</option>
                <option value="Competitions">Competitions</option>
                <option value="Buy Photos">Buy Photos</option>
              </select>
            </div>

            <Input
              id="advertise-website"
              label="Website URL"
              placeholder="https://yourbusiness.com"
              error={errors.website}
              inputClassName={inputClass}
              labelClassName="block text-[14px] font-semibold text-[#202531] mb-2 tracking-normal normal-case"
              {...register('website')}
            />

            <div className="block space-y-2">
              <label
                htmlFor="advertise-description"
                className="block text-[14px] font-semibold text-[#202531] tracking-normal normal-case"
              >
                Description (0/200)
              </label>
              <textarea
                id="advertise-description"
                rows={4}
                className={`h-auto resize-none py-3 ${inputClass} ${errors.description ? 'border-red-500' : ''}`}
                placeholder="Tell us about your business..."
                {...register('description', {
                  maxLength: { value: 200, message: 'Max 200 characters' },
                })}
              />
              {errors.description && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="block space-y-2">
              <label
                htmlFor="advertise-location"
                className="block text-[14px] font-semibold text-[#202531] tracking-normal normal-case"
              >
                Location
              </label>
              <div className="relative">
                <MapPin
                  size={14}
                  className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-[#9ca3af]"
                />
                <Input
                  id="advertise-location"
                  placeholder="123 Main St, City, State"
                  error={errors.location}
                  inputClassName={`${inputClass} pl-8`}
                  labelClassName="hidden"
                  {...register('location')}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-[14px] font-semibold text-[#202531]">
              Business Image
            </span>
            <Button
              unstyled
              type="button"
              className="flex h-28 w-full flex-col items-center justify-center rounded-[10px] border border-dashed border-[#d1d5db] bg-white text-[#6b7280] transition hover:border-[#9ca3af]"
            >
              <Upload size={18} className="mb-2 text-[#9ca3af]" />
              <span className="text-[12px]">
                Click to upload or drag and drop
              </span>
            </Button>
          </div>

          <div>
            <h3 className="text-[14px] font-semibold text-[#202531]">
              Select Advertisement Duration
            </h3>
            <p className="text-[12px] leading-relaxed text-[#6b7280] sm:text-[14px]">
              Choose how long your advertisement will run. Payment is required
              to submit for review.
            </p>

            <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-3">
              {DURATION_OPTIONS.map((option) => {
                const active = option.days === selectedDuration;
                return (
                  <Button
                    unstyled
                    key={option.days}
                    type="button"
                    onClick={() => setSelectedDuration(option.days)}
                    className={`relative w-full rounded-xl border px-4 py-4 text-center transition ${
                      active
                        ? 'border-[#5863d4] bg-[#eef0ff] shadow-[0_0_0_1px_#5863d4]'
                        : 'border-[#e5e7eb] bg-white'
                    }`}
                  >
                    {option.popular ? (
                      <span className="absolute -top-2 left-1/2 -translate-x-1/2 rounded-full bg-[#5863d4] px-2 py-0.5 text-[9px] font-bold tracking-wide text-white uppercase">
                        Most Popular
                      </span>
                    ) : null}
                    <p className="text-[34px] font-semibold leading-none text-[#202531]">
                      {option.days}
                    </p>
                    <p className="mt-1 text-[11px] text-gray-600">days</p>
                    <p
                      className={`mt-2 text-[40px] font-semibold leading-none ${active ? 'text-[#5863d4]' : 'text-[#202531]'}`}
                    >
                      ${option.price}
                    </p>
                    <p className="mt-2 text-[10px] text-gray-600">
                      {option.start}
                    </p>
                    <p className="mt-1 text-[10px] text-gray-600">
                      {option.end}
                    </p>
                  </Button>
                );
              })}
            </div>
          </div>

          <div className="space-y-4 pt-1">
            <p className="rounded-lg bg-[#f9fafb] px-4 py-3 text-[13px] leading-relaxed text-[#6b7280] sm:text-[14px]">
              <Trans
                i18nKey="advertiseWithUs.reviewNote"
                components={{
                  strong: <strong className="font-semibold text-[#374151]" />,
                }}
              />
            </p>

            <MarketingButton
              type="submit"
              variant="muted"
              className="rounded-lg! bg-[#4048CD]! px-10! py-2.5! text-white! hover:bg-[#333BB0]!"
            >
              Pay Now
            </MarketingButton>
          </div>
        </form>
      </section>
    );
  },
);

AdvertiseBusinessForm.displayName = 'AdvertiseBusinessForm';

export default AdvertiseBusinessForm;
