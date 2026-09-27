import { useQuery } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  BUSINESS_LINK_SLIDE_MS,
  buildBusinessAlbumSlides,
} from '@/portals/admin/data/adminBusinessLinkData';
import {
  ADMIN_BUSINESS_LINKS_QUERY_KEY,
  getAdminBusinessLinkApi,
} from '@/shared/api/businessLinks.api';
import { getApiErrorMessage } from '@/shared/api/client';

/**
 * Business album details + photo carousel state.
 * @param {string | undefined} businessAlbumId
 */
export default function useAdminBusinessLinkDetail(businessAlbumId) {
  const { t } = useTranslation();
  const [activeIndex, setActiveIndex] = useState(0);

  const detailQuery = useQuery({
    queryKey: [...ADMIN_BUSINESS_LINKS_QUERY_KEY, 'detail', businessAlbumId],
    queryFn: () => getAdminBusinessLinkApi(businessAlbumId),
    enabled: Boolean(businessAlbumId),
    retry: (failureCount, error) =>
      error?.response?.status !== 404 && failureCount < 1,
  });
  const errorBody = detailQuery.error?.response?.data;

  const detail = detailQuery.data ?? null;
  const slides = useMemo(
    () => buildBusinessAlbumSlides(detail?.images),
    [detail?.images],
  );
  const slideCount = slides.length;

  // biome-ignore lint/correctness/useExhaustiveDependencies: restart the carousel when another album opens
  useEffect(() => {
    setActiveIndex(0);
  }, [businessAlbumId]);

  useEffect(() => {
    if (slideCount <= 1) return undefined;
    const timerId = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slideCount);
    }, BUSINESS_LINK_SLIDE_MS);
    return () => window.clearInterval(timerId);
  }, [slideCount]);

  const goPrev = () => {
    setActiveIndex((current) => (current === 0 ? slideCount - 1 : current - 1));
  };

  const goNext = () => {
    setActiveIndex((current) => (current === slideCount - 1 ? 0 : current + 1));
  };

  const selectSlide = (index) => {
    setActiveIndex(Math.min(Math.max(0, index), Math.max(0, slideCount - 1)));
  };

  return {
    detail,
    isLoading: detailQuery.isLoading,
    isError: detailQuery.isError,
    isNotFound: detailQuery.error?.response?.status === 404,
    notFoundMessage: errorBody?.error || errorBody?.message || '',
    errorMessage: getApiErrorMessage(
      detailQuery.error,
      t('adminBusinessLink.detail.loadError'),
    ),
    refetch: detailQuery.refetch,
    slides,
    activeIndex,
    activeSlide: slides[activeIndex] || slides[0] || null,
    goPrev,
    goNext,
    selectSlide,
  };
}
