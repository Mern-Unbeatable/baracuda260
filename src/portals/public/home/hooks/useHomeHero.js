import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/shared/config';

export function useHomeHero(slidesLength, slideIntervalMs) {
  const navigate = useNavigate();
  const [activeSlide, setActiveSlide] = useState(0);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSlide((i) => (i + 1) % slidesLength);
    }, slideIntervalMs);
    return () => window.clearInterval(timer);
  }, [slidesLength, slideIntervalMs]);

  const goToGallery = (event) => {
    event.preventDefault();
    const q = search.trim();
    navigate(
      q ? `${ROUTES.GALLERY}?q=${encodeURIComponent(q)}` : ROUTES.GALLERY,
    );
  };

  return {
    activeSlide,
    setActiveSlide,
    search,
    setSearch,
    goToGallery,
  };
}
