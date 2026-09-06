import React, { memo } from 'react';
import { Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const VARIANT_STYLES = {
  overlay:
    'bg-[#1a1740]/80 text-white shadow-[0_2px_8px_rgba(0,0,0,0.25)] ring-1 ring-white/15 backdrop-blur-md',
  inline: 'bg-[#eef0ff] text-[#4048cd] ring-1 ring-[#4048cd]/12',
};

const SIZE_STYLES = {
  sm: {
    wrap: 'gap-1 px-2 py-0.5',
    icon: 10,
    label: 'text-[9px] font-bold uppercase tracking-[0.4px]',
  },
  md: {
    wrap: 'gap-1.5 px-2.5 py-1',
    icon: 12,
    label: 'text-[10px] font-bold uppercase tracking-[0.35px]',
  },
  lg: {
    wrap: 'gap-2 px-3 py-1.5',
    icon: 14,
    label: 'text-[11px] font-bold uppercase tracking-[0.35px]',
  },
};

const AiGeneratedPhotoBadge = memo(({ size = 'sm', variant = 'overlay', className = '' }) => {
  const { t } = useTranslation();
  const styles = SIZE_STYLES[size] ?? SIZE_STYLES.sm;
  const label = t('uploadForm.aiGeneratedBadge');
  const ariaLabel = t('uploadForm.aiGeneratedBadgeLabel');
  const variantClass = VARIANT_STYLES[variant] ?? VARIANT_STYLES.overlay;

  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full ${variantClass} ${styles.wrap} ${className}`.trim()}
      title={ariaLabel}
      aria-label={ariaLabel}
    >
      <Sparkles
        size={styles.icon}
        strokeWidth={2.4}
        aria-hidden="true"
        className={variant === 'overlay' ? 'text-[#c4b5fd]' : 'text-[#6366f1]'}
      />
      <span className={styles.label}>{label}</span>
    </span>
  );
});

AiGeneratedPhotoBadge.displayName = 'AiGeneratedPhotoBadge';

export default AiGeneratedPhotoBadge;
