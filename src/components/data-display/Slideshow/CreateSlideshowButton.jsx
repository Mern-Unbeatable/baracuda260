import { GalleryHorizontalEnd } from 'lucide-react';
import React, { memo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import SlideshowBuilderModal from '@/components/data-display/Slideshow/SlideshowBuilderModal';
import Button from '@/components/ui/Button';
import { ROUTES } from '@/shared/config';
import {
  SLIDESHOW_MIN_PHOTOS,
  SLIDESHOW_SEARCH_PARAM,
} from '@/shared/data/slideshows';
import { useProfileSlideshows } from '@/shared/hooks/useProfileSlideshows';

/**
 * Opens the slideshow builder from anywhere in the member area.
 * After saving, the new slideshow plays on the owner's profile (Artwork tab).
 * @param {{ className?: string }} props
 */
const CreateSlideshowButton = memo(({ className = '' }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleCreated = useCallback(
    (slideshow) => {
      navigate(
        `${ROUTES.USER_PROFILE}?${SLIDESHOW_SEARCH_PARAM}=${encodeURIComponent(slideshow.id)}`,
      );
    },
    [navigate],
  );

  const {
    sourcePhotos,
    sourcePhotosLoading,
    sourcePhotosError,
    refetchSourcePhotos,
    canCreate,
    builder,
    isSaving,
    openCreate,
    closeBuilder,
    submitBuilder,
  } = useProfileSlideshows({ canManage: true, onCreated: handleCreated });

  const needMorePhotos = !sourcePhotosLoading && !canCreate;

  return (
    <>
      <Button
        unstyled
        type="button"
        onClick={openCreate}
        disabled={sourcePhotosLoading || !canCreate}
        title={
          needMorePhotos
            ? t('photographerProfile.slideshows.needMorePhotos', {
                count: SLIDESHOW_MIN_PHOTOS,
              })
            : undefined
        }
        className={`inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 transition disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      >
        <GalleryHorizontalEnd size={18} aria-hidden="true" />
        {t('photographerProfile.slideshows.create')}
      </Button>

      <SlideshowBuilderModal
        open={builder.open}
        slideshow={builder.slideshow}
        photos={sourcePhotos}
        photosLoading={sourcePhotosLoading}
        photosError={sourcePhotosError}
        onRetryPhotos={() => refetchSourcePhotos()}
        isSaving={isSaving}
        onClose={closeBuilder}
        onSubmit={submitBuilder}
      />
    </>
  );
});

CreateSlideshowButton.displayName = 'CreateSlideshowButton';

export default CreateSlideshowButton;
