import { useQuery } from '@tanstack/react-query';
import React, { memo, useEffect, useMemo, useState } from 'react';
import Marquee from 'react-fast-marquee';
import { useTranslation } from 'react-i18next';
import {
  ANNOUNCEMENT_STATUS,
  computeAnnouncementDisplayStatus,
} from '@/portals/admin/data/adminAnnouncementsData';
import {
  getPublicAnnouncementsApi,
  PUBLIC_ANNOUNCEMENTS_QUERY_KEY,
} from '@/shared/api/announcements.api';
import { SITE_ANNOUNCEMENT_BG } from './siteCopy';

const PRIORITY_RANK = { high: 0, medium: 1, low: 2 };

const isPolish = (language) =>
  String(language || '')
    .toLowerCase()
    .startsWith('pl');

const resolveMessage = (item, language) => {
  if (isPolish(language) && item?.message_pl) return item.message_pl;
  return item?.message || '';
};

const resolveLinkLabel = (link, language) => {
  if (!link || typeof link !== 'object') return '';
  if (isPolish(language) && link.buttonName_pl) return link.buttonName_pl;
  return link.buttonName || link.text || '';
};

const resolveLinkHref = (link) => {
  if (!link) return '';
  if (typeof link === 'string') return link;
  return link.url || '';
};

const sortByPriority = (items) =>
  [...items].sort((a, b) => {
    const aRank = PRIORITY_RANK[String(a?.priority || '').toLowerCase()] ?? 9;
    const bRank = PRIORITY_RANK[String(b?.priority || '').toLowerCase()] ?? 9;
    if (aRank !== bRank) return aRank - bRank;
    return new Date(b?.createdAt || 0) - new Date(a?.createdAt || 0);
  });

const AnnouncementItem = memo(({ item, language }) => {
  const message = resolveMessage(item, language);
  if (!message) return null;

  const icon = typeof item.icon === 'string' && item.icon ? item.icon : '';
  const link = item.link;
  const linkLabel = resolveLinkLabel(link, language);
  const linkHref = resolveLinkHref(link);

  return (
    <span className="inline-flex items-center gap-1.5 px-4 whitespace-nowrap">
      {icon ? <span aria-hidden="true">{icon}</span> : null}
      <span>{message}</span>
      {linkLabel && linkHref ? (
        <>
          <span aria-hidden="true">·</span>
          <a
            href={linkHref}
            className="underline decoration-white/50 underline-offset-2 transition hover:decoration-white"
            onClick={(event) => event.stopPropagation()}
          >
            {linkLabel}
          </a>
        </>
      ) : linkLabel ? (
        <>
          <span aria-hidden="true">·</span>
          <span>{linkLabel}</span>
        </>
      ) : null}
    </span>
  );
});
AnnouncementItem.displayName = 'AnnouncementItem';

const SiteAnnouncement = memo(({ tone = 'blue' }) => {
  const { t, i18n } = useTranslation();
  const bg = SITE_ANNOUNCEMENT_BG[tone] || SITE_ANNOUNCEMENT_BG.blue;
  const language = i18n.resolvedLanguage || i18n.language;
  const [now, setNow] = useState(() => new Date());

  // Re-evaluate schedule every 30s so expired items drop without a full reload.
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 30 * 1000);
    return () => window.clearInterval(id);
  }, []);

  const { data, isLoading, isError } = useQuery({
    queryKey: PUBLIC_ANNOUNCEMENTS_QUERY_KEY,
    queryFn: getPublicAnnouncementsApi,
    staleTime: 15 * 1000,
    refetchInterval: 30 * 1000,
    refetchOnWindowFocus: true,
  });

  const items = useMemo(() => {
    const live = (data || []).filter(
      (item) =>
        computeAnnouncementDisplayStatus(item, now) ===
        ANNOUNCEMENT_STATUS.ACTIVE,
    );
    return sortByPriority(live);
  }, [data, now]);

  const fallbackText = t('announcement');

  if (isLoading) {
    return (
      <div
        className={`flex h-11.5 items-center overflow-hidden ${bg}`}
        aria-hidden="true"
      />
    );
  }

  const useFallback = isError || items.length === 0;

  return (
    <div className={`flex h-11.5 items-center overflow-hidden ${bg}`}>
      <Marquee
        speed={40}
        gradient={false}
        className="text-[14px] leading-5.5 text-white"
      >
        {useFallback ? (
          <>
            <span className="px-4">{fallbackText}</span>
            <span className="px-4" aria-hidden="true">
              {fallbackText}
            </span>
          </>
        ) : (
          <>
            {items.map((item) => (
              <AnnouncementItem
                key={item.id}
                item={item}
                language={language}
              />
            ))}
            {items.map((item) => (
              <AnnouncementItem
                key={`${item.id}-dup`}
                item={item}
                language={language}
              />
            ))}
          </>
        )}
      </Marquee>
    </div>
  );
});

SiteAnnouncement.displayName = 'SiteAnnouncement';

export default SiteAnnouncement;
