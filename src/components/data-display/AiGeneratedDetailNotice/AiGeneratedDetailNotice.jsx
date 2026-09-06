import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import AiGeneratedPhotoBadge from '@/components/data-display/AiGeneratedPhotoBadge/AiGeneratedPhotoBadge';

const AiGeneratedDetailNotice = memo(({ className = '' }) => {
  const { t } = useTranslation();

  return (
    <div
      className={`flex items-start gap-3 rounded-xl border border-[#4048cd]/15 bg-[#eef0ff] px-4 py-3 sm:items-center sm:px-5 sm:py-3.5 ${className}`.trim()}
      role="note"
    >
      <AiGeneratedPhotoBadge variant="inline" size="md" className="mt-0.5 sm:mt-0" />
      <p className="text-[14px] leading-5 text-[#4048cd] sm:text-[15px] sm:leading-6">
        {t('galleryDetail.aiGeneratedNotice')}
      </p>
    </div>
  );
});

AiGeneratedDetailNotice.displayName = 'AiGeneratedDetailNotice';

export default AiGeneratedDetailNotice;
