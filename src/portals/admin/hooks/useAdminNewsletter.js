import { useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import {
  ADMIN_NEWSLETTER_SUBSCRIBERS,
  DEFAULT_CTA_TEXT,
  DEFAULT_RECIPIENT_ID,
  isBannerFileAllowed,
} from '@/portals/admin/data/adminNewsletterData';

/**
 * Admin Newsletter composer + recipient selection state (Figma 346:1740).
 */
const useAdminNewsletter = () => {
  const { t } = useTranslation();
  const [subject, setSubject] = useState('');
  const [emailTitle, setEmailTitle] = useState('');
  const [content, setContent] = useState('');
  const [ctaText, setCtaText] = useState(DEFAULT_CTA_TEXT);
  const [ctaUrl, setCtaUrl] = useState('');
  const [bannerName, setBannerName] = useState('');
  const [bannerError, setBannerError] = useState('');
  const [recipientId, setRecipientId] = useState(DEFAULT_RECIPIENT_ID);
  const [selectedSubscriberIds, setSelectedSubscriberIds] = useState([]);
  const [composerOpen, setComposerOpen] = useState(true);
  const [sending, setSending] = useState(false);
  const [attempted, setAttempted] = useState(false);

  const handleRecipientChange = (nextRecipientId) => {
    setRecipientId(nextRecipientId);
    if (nextRecipientId !== 'selected') {
      setSelectedSubscriberIds([]);
    }
  };

  const handleToggleSubscriber = (subscriberId) => {
    setSelectedSubscriberIds((current) =>
      current.includes(subscriberId)
        ? current.filter((id) => id !== subscriberId)
        : [...current, subscriberId],
    );
  };

  const handleBannerChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!isBannerFileAllowed(file)) {
      setBannerName('');
      setBannerError('adminNewsletter.composer.bannerInvalid');
      return;
    }
    setBannerError('');
    setBannerName(file.name);
  };

  const isSubjectValid = subject.trim().length > 0;
  const isContentValid = content.trim().length > 0;
  const isRecipientsValid =
    recipientId !== 'selected' || selectedSubscriberIds.length > 0;
  const isFormValid = isSubjectValid && isContentValid && isRecipientsValid;

  const handleSend = () => {
    setAttempted(true);
    if (!isFormValid) {
      if (!isRecipientsValid) {
        toast.error(t('adminNewsletter.send.recipientsRequired'));
      } else {
        toast.error(t('adminNewsletter.send.validationError'));
      }
      return;
    }
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setAttempted(false);
      toast.success(t('adminNewsletter.send.success'));
      setSubject('');
      setEmailTitle('');
      setContent('');
      setCtaText(DEFAULT_CTA_TEXT);
      setCtaUrl('');
      setBannerName('');
      setBannerError('');
      setSelectedSubscriberIds([]);
      setRecipientId(DEFAULT_RECIPIENT_ID);
    }, 1200);
  };

  return {
    subscribers: ADMIN_NEWSLETTER_SUBSCRIBERS,
    subject,
    setSubject,
    emailTitle,
    setEmailTitle,
    content,
    setContent,
    ctaText,
    setCtaText,
    ctaUrl,
    setCtaUrl,
    bannerName,
    bannerError,
    handleBannerChange,
    recipientId,
    setRecipientId: handleRecipientChange,
    selectedSubscriberIds,
    handleToggleSubscriber,
    composerOpen,
    setComposerOpen,
    sending,
    attempted,
    isFormValid,
    isRecipientsValid,
    handleSend,
  };
};

export default useAdminNewsletter;
