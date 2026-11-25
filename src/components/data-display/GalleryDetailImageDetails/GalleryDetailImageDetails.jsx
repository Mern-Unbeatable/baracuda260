import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import AiGeneratedPhotoBadge from '@/components/data-display/AiGeneratedPhotoBadge/AiGeneratedPhotoBadge';
import { ROUTES } from '@/shared/config';
import { AppLink } from '@/shared/site-chrome';

const DetailRow = memo(({ label, children }) => (
  <div className="flex items-start gap-4 text-[14px] lg:text-[15px] leading-5 sm:gap-8">
    <span className="w-28 shrink-0 text-[#6b7280]">{label}</span>
    <span className="min-w-0 font-medium text-[#0d0d14]">{children}</span>
  </div>
));

DetailRow.displayName = 'GalleryDetailImageDetailsRow';

const GalleryDetailImageDetails = memo(({ details }) => {
  const { t } = useTranslation();

  const leftRows = [
    details.credit
      ? {
          key: 'credit',
          label: t('galleryDetail.imageDetails.credit'),
          value: (
            <AppLink
              href={details.creditHref || ROUTES.PHOTOGRAPHER_PROFILE}
              className="font-medium text-[#4048cd] transition hover:underline"
            >
              {details.credit}
            </AppLink>
          ),
        }
      : null,
    details.creativeNumber
      ? {
          key: 'creativeNumber',
          label: t('galleryDetail.imageDetails.creativeNumber'),
          value: details.creativeNumber,
        }
      : null,
    details.resolution
      ? {
          key: 'resolution',
          label: t('galleryDetail.imageDetails.resolution'),
          value: details.resolution,
        }
      : null,
    details.quality
      ? {
          key: 'quality',
          label: t('galleryDetail.imageDetails.quality'),
          value: details.quality,
        }
      : null,
  ].filter(Boolean);

  const rightRows = [
    details.fileType
      ? {
          key: 'fileType',
          label: t('galleryDetail.imageDetails.fileType'),
          value: details.fileType,
        }
      : null,
    details.fileSize
      ? {
          key: 'fileSize',
          label: t('galleryDetail.imageDetails.fileSize'),
          value: details.fileSize,
        }
      : null,
    details.uploadDate
      ? {
          key: 'uploadDate',
          label: t('galleryDetail.imageDetails.uploadDate'),
          value: details.uploadDate,
        }
      : null,
    details.categories
      ? {
          key: 'categories',
          label: t('galleryDetail.imageDetails.categories'),
          value: details.categories,
        }
      : null,
  ].filter(Boolean);

  if (details.isAiGenerated) {
    leftRows.push({
      key: 'aiGenerated',
      label: t('galleryDetail.imageDetails.aiGenerated'),
      value: (
        <span className="inline-flex items-center gap-2">
          <AiGeneratedPhotoBadge variant="inline" size="sm" />
          <span>{t('uploadForm.aiCreatedYes')}</span>
        </span>
      ),
    });
  }

  if (leftRows.length === 0 && rightRows.length === 0) {
    return null;
  }

  return (
    <div className="rounded-xl bg-[#F8FAFC] px-5 py-5 sm:px-8 sm:py-6">
      <h2 className="text-[18px] font-bold leading-tight text-[#0d0d14] sm:text-[20px]">
        {t('galleryDetail.imageDetails.title')}
      </h2>

      <div className="mt-5 grid gap-6 sm:mt-6 sm:grid-cols-2 sm:gap-x-12">
        {leftRows.length > 0 ? (
          <div className="flex flex-col gap-3 sm:gap-3.5">
            {leftRows.map(({ key, label, value }) => (
              <DetailRow key={key} label={label}>
                {value}
              </DetailRow>
            ))}
          </div>
        ) : null}
        {rightRows.length > 0 ? (
          <div className="flex flex-col gap-3 sm:gap-3.5">
            {rightRows.map(({ key, label, value }) => (
              <DetailRow key={key} label={label}>
                {value}
              </DetailRow>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
});

GalleryDetailImageDetails.displayName = 'GalleryDetailImageDetails';

export default GalleryDetailImageDetails;
