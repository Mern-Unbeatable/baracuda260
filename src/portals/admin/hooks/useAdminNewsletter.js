import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import {
  buildNewsletterCampaignFormData,
  DEFAULT_RECIPIENT_ID,
  getRecipientTarget,
  isBannerFileAllowed,
  NEWSLETTER_PAGE_SIZE,
} from '@/portals/admin/data/adminNewsletterData';
import { getApiErrorMessage } from '@/shared/api/client';
import {
  ADMIN_NEWSLETTER_SUBSCRIBERS_QUERY_KEY,
  getNewsletterSubscribersApi,
  sendNewsletterCampaignApi,
} from '@/shared/api/newsletter.api';

/**
 * Admin Newsletter — server-paginated subscribers + campaign composer (Figma 346:1740).
 */
const useAdminNewsletter = (pageSize = NEWSLETTER_PAGE_SIZE) => {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [banner, setBanner] = useState(null);
  const [bannerError, setBannerError] = useState('');
  const [bannerInputKey, setBannerInputKey] = useState(0);
  const [recipientId, setRecipientId] = useState(DEFAULT_RECIPIENT_ID);
  const [selectedEmails, setSelectedEmails] = useState([]);
  const [composerOpen, setComposerOpen] = useState(true);

  const listQuery = useQuery({
    queryKey: [...ADMIN_NEWSLETTER_SUBSCRIBERS_QUERY_KEY, page, pageSize],
    queryFn: () => getNewsletterSubscribersApi({ page, limit: pageSize }),
    placeholderData: keepPreviousData,
  });

  const subscribers = listQuery.data?.items ?? [];
  const meta = listQuery.data?.meta;
  const total = meta?.total ?? 0;
  const totalPages = Math.max(1, meta?.totalPages ?? 1);

  useEffect(() => {
    if (meta && page > totalPages) setPage(totalPages);
  }, [meta, page, totalPages]);

  const sendMutation = useMutation({ mutationFn: sendNewsletterCampaignApi });

  const handleRecipientChange = (nextRecipientId) => {
    if (!getRecipientTarget(nextRecipientId)) return;
    setRecipientId(nextRecipientId);
    if (nextRecipientId !== 'selected') {
      setSelectedEmails([]);
    }
  };

  /** Backend `selectedIds` takes subscriber emails, so selection is keyed by email. */
  const handleToggleSubscriber = (email) => {
    setSelectedEmails((current) =>
      current.includes(email)
        ? current.filter((item) => item !== email)
        : [...current, email],
    );
  };

  const handleBannerChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!isBannerFileAllowed(file)) {
      setBanner(null);
      setBannerError('adminNewsletter.composer.bannerInvalid');
      return;
    }
    setBannerError('');
    setBanner(file);
  };

  const resetBanner = () => {
    setBanner(null);
    setBannerError('');
    setBannerInputKey((key) => key + 1);
  };

  /**
   * @param {import('@/portals/admin/data/adminNewsletterData').NEWSLETTER_FORM_DEFAULTS} values
   * @param {{ onSuccess?: () => void }} [options]
   */
  const handleSend = (values, { onSuccess } = {}) => {
    const target = getRecipientTarget(recipientId);
    if (!target || (target === 'SELECTED' && selectedEmails.length === 0)) {
      toast.error(t('adminNewsletter.send.recipientsRequired'));
      return;
    }

    sendMutation.mutate(
      buildNewsletterCampaignFormData(values, {
        target,
        banner,
        selectedEmails,
      }),
      {
        onSuccess: (response) => {
          toast.success(response?.message || t('adminNewsletter.send.success'));
          resetBanner();
          setSelectedEmails([]);
          setRecipientId(DEFAULT_RECIPIENT_ID);
          onSuccess?.();
        },
        onError: (error) => {
          toast.error(
            getApiErrorMessage(error, t('adminNewsletter.send.error')),
          );
        },
      },
    );
  };

  const goToPage = (nextPage) => {
    setPage(Math.min(Math.max(1, nextPage), totalPages));
  };

  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = total === 0 ? 0 : Math.min(from + subscribers.length - 1, total);

  return {
    subscribers,
    isLoading: listQuery.isLoading,
    isError: listQuery.isError,
    isFetching: listQuery.isFetching,
    loadErrorMessage: getApiErrorMessage(
      listQuery.error,
      t('adminNewsletter.loadError'),
    ),
    refetch: listQuery.refetch,
    range: { from, to, total },
    isFirstPage: page <= 1,
    isLastPage: page >= totalPages,
    handlePreviousPage: () => goToPage(page - 1),
    handleNextPage: () => goToPage(page + 1),
    bannerName: banner?.name ?? '',
    bannerError,
    bannerInputKey,
    handleBannerChange,
    recipientId,
    setRecipientId: handleRecipientChange,
    selectedEmails,
    handleToggleSubscriber,
    composerOpen,
    setComposerOpen,
    sending: sendMutation.isPending,
    handleSend,
  };
};

export default useAdminNewsletter;
