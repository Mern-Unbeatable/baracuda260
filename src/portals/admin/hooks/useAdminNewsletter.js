import { useState } from 'react';
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
  const [subject, setSubject] = useState('');
  const [emailTitle, setEmailTitle] = useState('');
  const [content, setContent] = useState('');
  const [ctaText, setCtaText] = useState(DEFAULT_CTA_TEXT);
  const [ctaUrl, setCtaUrl] = useState('');
  const [bannerName, setBannerName] = useState('');
  const [bannerError, setBannerError] = useState('');
  const [recipientId, setRecipientId] = useState(DEFAULT_RECIPIENT_ID);
  const [composerOpen, setComposerOpen] = useState(true);

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
    setRecipientId,
    composerOpen,
    setComposerOpen,
  };
};

export default useAdminNewsletter;
