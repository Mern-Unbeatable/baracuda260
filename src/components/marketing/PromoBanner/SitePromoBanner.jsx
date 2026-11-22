import { useQuery } from '@tanstack/react-query';
import React, { memo, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import PromoBanner from '@/components/marketing/PromoBanner/PromoBanner';
import {
  getPublicAdvertisementsApi,
  PUBLIC_ADVERTISEMENTS_QUERY_KEY,
  resolveAdvertisementPage,
} from '@/shared/api/advertisements.api';

const displayHost = (url) => {
  if (!url) return '';
  try {
    const parsed = new URL(url.startsWith('http') ? url : `https://${url}`);
    return parsed.host.replace(/^www\./, '') || url;
  } catch {
    return String(url)
      .replace(/^https?:\/\//i, '')
      .replace(/\/$/, '');
  }
};

const normalizeHref = (url) => {
  if (!url) return '#';
  if (/^(https?:|mailto:|tel:)/i.test(url)) return url;
  return `https://${url}`;
};

/**
 * Loads page-targeted ACTIVE ads and renders them as an auto-rotating promo slider.
 * Hides itself when the route has no page slug or no active ads.
 */
const SitePromoBanner = memo(() => {
  const { i18n } = useTranslation();
  const location = useLocation();
  const adPage = useMemo(
    () => resolveAdvertisementPage(location.pathname),
    [location.pathname],
  );

  const { data: ads = [], isLoading } = useQuery({
    queryKey: [...PUBLIC_ADVERTISEMENTS_QUERY_KEY, adPage || 'none'],
    queryFn: () => getPublicAdvertisementsApi({ page: adPage }),
    enabled: Boolean(adPage),
    staleTime: 60 * 1000,
  });

  const isPolish = String(i18n.resolvedLanguage || i18n.language || '')
    .toLowerCase()
    .startsWith('pl');

  const slides = useMemo(
    () =>
      ads.map((ad) => {
        const isOnline = String(ad.businessType).toUpperCase() === 'ONLINE';
        const subtitle = isPolish
          ? ad.descriptionPl || ad.description
          : ad.description;
        const ctaLabel = isOnline
          ? displayHost(ad.websiteUrl) || ad.businessName
          : isPolish
            ? ad.locationPl || ad.location || ad.businessName
            : ad.location || ad.businessName;

        return {
          title: ad.businessName || undefined,
          subtitle,
          ctaLabel: ctaLabel || 'Learn more',
          href: isOnline ? normalizeHref(ad.websiteUrl) : '#',
          image: ad.media || undefined,
          external: isOnline && Boolean(ad.websiteUrl),
        };
      }),
    [ads, isPolish],
  );

  if (!adPage || isLoading || slides.length === 0) return null;

  return <PromoBanner slides={slides} />;
});

SitePromoBanner.displayName = 'SitePromoBanner';

export default SitePromoBanner;
