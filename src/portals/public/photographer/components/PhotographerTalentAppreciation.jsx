import { useTranslation } from 'react-i18next';
import React, { memo, useMemo, useState } from 'react';
import {
  CalendarDays,
  Camera,
  Check,
  Info,
} from 'lucide-react';
import { getDaysUntilNextSundayMidnight } from '@/shared/utils/weekReset';

const TIER_STYLES = {
  gold: {
    icon: 'text-[#ca8a04]',
    iconBg: 'bg-[#fefce8] border border-[#fef08a]',
    btn: 'bg-[#fef08a] text-[#854d0e] hover:bg-[#eab308] hover:text-white',
    dot: 'bg-[#eab308]',
  },
  silver: {
    icon: 'text-[#64748b]',
    iconBg: 'bg-[#f1f5f9]',
    btn: 'bg-[#e2e8f0] text-[#64748b] hover:bg-[#64748b] hover:text-white',
    btnDisabled: true,
    dot: 'bg-[#94a3b8]',
  },
  bronze: {
    icon: 'text-[#b45309]',
    iconBg: 'bg-[#fff7ed]',
    btn: 'bg-[#ffedd5] text-[#9a3412] hover:bg-[#b45309] hover:text-white',
    dot: 'bg-[#b45309]',
  },
};

const PhotographerTalentAppreciation = memo(({ appreciation }) => {
  const { t } = useTranslation();
  const [awards, setAwards] = useState(appreciation.tiers);
  const [weekly, setWeekly] = useState(appreciation.weekly);
  const [resetDays, setResetDays] = useState(() => getDaysUntilNextSundayMidnight());

  const giveAward = (tierId) => {
    if (weekly[tierId] === 0) return;
    setAwards((prev) =>
      prev.map((tier) =>
        tier.id === tierId ? { ...tier, count: tier.count + 1, awardedThisWeek: true } : tier,
      ),
    );
    setWeekly((prev) => ({ ...prev, [tierId]: 0 }));
  };

  const simulateWeek = () => {
    setWeekly({ gold: 1, silver: 1, bronze: 1 });
    setAwards((prev) => prev.map((tier) => ({ ...tier, awardedThisWeek: false })));
    setResetDays(getDaysUntilNextSundayMidnight());
  };

  return (
    <section className="mt-8 sm:mt-10">
      <div className="rounded-2xl border border-[#e5e7eb] bg-white p-5 sm:p-6">
        <div className="flex items-start gap-2">
          <h2 className="text-[18px] font-bold text-[#111827] sm:text-[20px]">
            {t('photographerProfile.appreciation.title', { defaultValue: 'Artwork Appreciation' })}
          </h2>
          <Info size={16} className="mt-1 shrink-0 text-[#9ca3af]" aria-hidden="true" />
        </div>
        <p className="mt-1.5 max-w-3xl text-[13px] leading-5 text-[#6b7280] sm:text-[14px]">
          {t('photographerProfile.appreciation.subtitle')}
        </p>

        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {awards.map((tier) => {
            const style = TIER_STYLES[tier.id];
            const disabled = weekly[tier.id] === 0 || tier.awardedThisWeek;
            return (
              <article
                key={tier.id}
                className="relative flex flex-col items-center rounded-[14px] border border-[#eef0f4] bg-[#fafafa] px-4 py-5 text-center"
              >
                <span
                  className={`relative inline-flex size-14 items-center justify-center rounded-full ${style.iconBg}`}
                >
                  <Camera size={26} className={style.icon} aria-hidden="true" />
                  {tier.id === 'bronze' && !disabled ? (
                    <span className="absolute -bottom-0.5 -right-0.5 inline-flex size-5 items-center justify-center rounded-full bg-[#10b981] text-white">
                      <Check size={11} strokeWidth={3} aria-hidden="true" />
                    </span>
                  ) : null}
                </span>
                <p className="mt-3 text-[12px] font-bold tracking-[0.14em] text-[#111827]">
                  {t(`photographerProfile.appreciation.tiers.${tier.id}`)}
                </p>
                <p className="mt-1 text-[22px] font-extrabold leading-none text-[#111827]">
                  {tier.count}
                </p>
                <p className="mt-1 text-[11px] font-semibold tracking-[0.08em] text-[#9ca3af]">
                  {t('photographerProfile.appreciation.awards')}
                </p>
                <button
                  type="button"
                  disabled={disabled}
                  onClick={() => giveAward(tier.id)}
                  className={`mt-4 inline-flex h-9 w-full items-center justify-center rounded-lg text-[13px] font-semibold transition ${
                    disabled
                      ? 'cursor-not-allowed bg-[#e5e7eb] text-[#9ca3af]'
                      : `cursor-pointer ${style.btn}`
                  }`}
                >
                  {disabled
                    ? t('photographerProfile.appreciation.alreadyAwarded')
                    : t(`photographerProfile.appreciation.give.${tier.id}`)}
                </button>
              </article>
            );
          })}
        </div>

        <div className="mt-5 flex flex-col gap-3 rounded-xl bg-[#f3f4f6] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <p className="inline-flex items-center gap-1.5 text-[12px] font-medium text-[#6b7280]">
              <CalendarDays size={14} aria-hidden="true" />
              {t('photographerProfile.appreciation.resetIn', { days: resetDays })}
            </p>
            <p className="text-[11px] font-bold tracking-widest text-[#9ca3af]">
              {t('photographerProfile.appreciation.weeklyLabel')}
            </p>
            {['gold', 'silver', 'bronze'].map((id) => (
              <span
                key={id}
                className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#374151]"
              >
                <span className={`size-2 rounded-full ${TIER_STYLES[id].dot}`} aria-hidden="true" />
                {t(`photographerProfile.appreciation.tiers.${id}`)}{' '}
                <span className="text-[#9ca3af]">{weekly[id]}/1</span>
              </span>
            ))}
          </div>
          <button
            type="button"
            onClick={simulateWeek}
            className="cursor-pointer text-[12px] font-semibold text-[#4048cd] transition hover:underline"
          >
            {t('photographerProfile.appreciation.simulate')}
          </button>
        </div>
      </div>
    </section>
  );
});

PhotographerTalentAppreciation.displayName = 'PhotographerTalentAppreciation';

export default PhotographerTalentAppreciation;
