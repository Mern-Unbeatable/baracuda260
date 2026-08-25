import { useTranslation } from 'react-i18next';
import React, { memo, useEffect, useRef, useState } from 'react';
import { Shell } from '@/shared/site-chrome';
import InViewWrapper from '@/components/common/InViewWrapper';

function formatNumber(value) {
  return String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function useCountUp(target, duration = 1200, startOn = false) {
  const [value, setValue] = useState(0);
  const rafRef = useRef(null);
  const startRef = useRef(null);

  useEffect(() => {
    const to = Number(String(target).replace(/[^\d]/g, '')) || 0;
    let start = null;

    function step(now) {
      if (!start) start = now;
      const elapsed = now - start;
      const t = Math.min(1, elapsed / duration);
      const eased = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
      const current = Math.round((to) * eased);
      setValue(current);
      if (t < 1) {
        rafRef.current = requestAnimationFrame(step);
      }
    }

    if (startOn) {
      // start animation
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(step);
    } else {
      // reset
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      setValue(0);
      start = null;
    }

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, [target, duration, startOn]);

  return value;
}

const STATS = [
  { value: '14,820+', labelKey: 'home.stats.photographers' },
  { value: '89,450+', labelKey: 'home.stats.photos' },
  { value: '342,100+', labelKey: 'home.stats.votes' },
  { value: '120×', labelKey: 'home.stats.prizes' },
];

const HomeStatsSection = memo(() => {
  const { t } = useTranslation();
  const containerRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return undefined;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            obs.disconnect();
          }
        });
      },
      { threshold: 0.2 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section className="bg-white section-py border-y border-slate-100">
      <Shell>
        <div ref={containerRef} className="grid grid-cols-2 gap-4 sm:gap-8 lg:grid-cols-4 lg:gap-6">
          {STATS.map(({ value, labelKey }) => {
            const suffix = String(value).replace(/[\d,]/g, '');
            const numericTarget = Number(String(value).replace(/[^\d]/g, '')) || 0;
            return (
              <InViewWrapper key={labelKey}>
                {(inView) => {
                  const count = useCountUp(numericTarget, 1200, inView);
                  return (
                    <div className="text-center">
                      <p className="text-[22px] font-bold leading-none text-(--primary-text-heading-color) sm:text-[32px] lg:text-[40px]">
                        {formatNumber(count)}
                        {suffix}
                      </p>
                      <p className="mt-2 text-[10px] font-bold uppercase tracking-wider text-(--primary-text-color) sm:mt-3 sm:text-[11px] lg:text-[12px]">
                        {t(labelKey)}
                      </p>
                    </div>
                  );
                }}
              </InViewWrapper>
            );
          })}
        </div>
      </Shell>
    </section>
  );
});

HomeStatsSection.displayName = 'HomeStatsSection';

export default HomeStatsSection;
