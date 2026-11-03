import { Video } from 'lucide-react';
import React, { memo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import UploadIntroVideoModal from './UploadIntroVideoModal';

/**
 * Button that triggers the 1-minute intro video upload modal.
 * Used on My Artwork page and Member Dashboard.
 *
 * @param {{ className?: string, onSuccess?: () => void }} props
 */
const UploadIntroVideoButton = memo(({ className = '', onSuccess }) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={`inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-xl transition font-medium ${className}`}
        aria-label={t('introVideo.btnAria', 'Upload 1-minute introduction video')}
      >
        <Video size={18} strokeWidth={2.2} aria-hidden="true" className="shrink-0" />
        <span>{t('introVideo.buttonLabel', 'Upload 1-minute video')}</span>
      </button>

      <UploadIntroVideoModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSuccess={onSuccess}
      />
    </>
  );
});

UploadIntroVideoButton.displayName = 'UploadIntroVideoButton';

export default UploadIntroVideoButton;
