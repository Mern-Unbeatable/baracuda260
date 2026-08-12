import { useEffect, useState } from 'react';
import {
  BUSINESS_LINK_SLIDE_MS,
  getBusinessLinkDetailById,
} from '@/portals/admin/data/adminBusinessLinkData';

/**
 * 12-photo album carousel state for Business Link Details.
 * @param {string | undefined} submissionId
 */
export default function useAdminBusinessLinkDetail(submissionId) {
  const detail = getBusinessLinkDetailById(submissionId);
  const slides = detail?.slides || [];
  const slideCount = slides.length;
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setActiveIndex(0);
  }, [submissionId]);

  useEffect(() => {
    if (slideCount <= 1) return undefined;
    const timerId = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slideCount);
    }, BUSINESS_LINK_SLIDE_MS);
    return () => window.clearInterval(timerId);
  }, [slideCount, submissionId]);

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
    slides,
    activeIndex,
    activeSlide: slides[activeIndex] || slides[0] || null,
    goPrev,
    goNext,
    selectSlide,
  };
}
