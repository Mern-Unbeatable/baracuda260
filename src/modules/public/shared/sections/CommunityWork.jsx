import React, { memo, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ROUTES } from '@/shared/config';
import {
  ALBUM_TYPES,
  ALBUM_TYPE_LABEL_KEYS,
  ALBUM_TYPE_SHORT_LABEL_KEYS,
  matchesAlbumType,
} from '@/shared/data/albumTypes';
import { galleryDetailPath } from '@/shared/data/galleryPhotos';
import { AppLink, ImgIcon, Shell, homeAsset } from '@/shared/site-chrome';
import {
  FilterPillGroup,
  MarketingButton,
  PhotoShowcaseCard,
  SectionHeader,
} from '@/shared/ui/marketing';
import FavoriteHeartButton from '@/modules/public/gallery/components/FavoriteHeartButton';

const A = '/assets/home';

const SHOWCASE_BADGE_KEYS = {
  'Single Photo': 'common.badges.singlePhoto',
  '6 PHOTOS STORY': 'common.badges.sixPhotosStory',
  '12 Photos - Full Zodiac Story': 'common.badges.twelveZodiacFull',
};

const SHOWCASE = [
  {
    id: 'golden-hour-silence',
    title: 'Golden Hour Silence',
    author: 'Kasia L. · Poland',
    votes: '1,488',
    badge: 'Single Photo',
    image: `${A}/photo-golden.jpg`,
    albumType: 'Single Photo',
  },
  {
    id: 'autumn-sequence',
    title: 'Autumn Sequence',
    author: 'Kasia L. · Poland',
    votes: '1,488',
    badge: '6 PHOTOS STORY',
    image: `${A}/photo-autumn.jpg`,
    albumType: '6 Photo Story',
  },
  {
    id: 'wings-over-the-marsh',
    title: 'Wings Over the Marsh',
    author: 'Kasia L. · Poland',
    votes: '1,488',
    badge: 'Single Photo',
    image: `${A}/photo-wings.jpg`,
    albumType: 'Single Photo',
  },
  {
    id: 'city-after-midnight',
    title: 'City After Midnight',
    author: 'Kasia L. · Poland',
    votes: '1,488',
    badge: '6 PHOTOS STORY',
    image: `${A}/photo-city.jpg`,
    albumType: '6 Photo Story',
  },
  {
    id: 'tidal-memory',
    title: 'Tidal Memory',
    author: 'Sofia R. · Italy',
    votes: '1,488',
    badge: '12 Photos - Full Zodiac Story',
    image: `${A}/photo-tidal.jpg`,
    albumType: '12 photos - Full Zodiac Story',
  },
  {
    id: 'forest-cathedral',
    title: 'Forest Cathedral',
    author: 'Jan M. · Czech',
    votes: '1,488',
    badge: 'Single Photo',
    image: `${A}/photo-forest.jpg`,
    albumType: 'Single Photo',
  },
  {
    id: 'morning-fields',
    title: 'Morning Fields',
    author: 'Kasia L. · Poland',
    votes: '1,488',
    badge: 'Single Photo',
    image: `${A}/photo-morning.jpg`,
    albumType: 'Single Photo',
  },
  {
    id: 'zodiac-journey',
    title: 'Zodiac Journey',
    author: 'Kasia L. · Poland',
    votes: '1,488',
    badge: '12 Photos - Full Zodiac Story',
    image: `${A}/photo-zodiac.jpg`,
    albumType: '12 photos - Full Zodiac Story',
  },
];

const ALL_FILTER = 'All';
const ALL_MIX = SHOWCASE;

const COMMUNITY_TABS = [
  {
    id: 'all',
    value: ALL_FILTER,
    labelKey: 'common.all',
    shortLabelKey: 'common.filtersShort.all',
  },
  ...ALBUM_TYPES.map((type) => ({
    id: type.id,
    value: type.value,
    labelKey: ALBUM_TYPE_LABEL_KEYS[type.value],
    shortLabelKey: ALBUM_TYPE_SHORT_LABEL_KEYS[type.value],
  })),
];

/**
 * Shared Community Work / Photo Showcase (Home) — album filters match Gallery Album Type.
 */
const CommunityWork = memo(() => {
  const { t } = useTranslation();
  const [filter, setFilter] = useState(ALL_FILTER);

  const filterItems = useMemo(
    () =>
      COMMUNITY_TABS.map((tab) => ({
        id: tab.id,
        value: tab.value,
        label: t(tab.labelKey),
        shortLabelKey: tab.shortLabelKey,
        labelKey: tab.labelKey,
      })),
    [t],
  );

  const photos =
    filter === ALL_FILTER
      ? ALL_MIX
      : SHOWCASE.filter((photo) => matchesAlbumType(photo.albumType, filter));

  return (
    <section className="bg-white section-py">
      <Shell>
        <SectionHeader
          className="mb-8 lg:mb-13"
          align="left"
          badge={t('home.showcase.eyebrow')}
          badgeTone="indigo"
          title={t('home.showcase.title')}
          end={
            <FilterPillGroup
              items={filterItems}
              value={filter}
              onChange={setFilter}
              ariaLabel={t('home.showcase.title')}
              renderLabel={(item) => (
                <>
                  <span className="sm:hidden">{t(item.shortLabelKey)}</span>
                  <span className="hidden sm:inline">{t(item.labelKey)}</span>
                </>
              )}
            />
          }
        />

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {photos.map((photo) => (
            <PhotoShowcaseCard
              key={photo.id}
              href={galleryDetailPath(photo.id)}
              image={photo.image}
              imageAlt={photo.title}
              title={photo.title}
              badge={t(SHOWCASE_BADGE_KEYS[photo.badge] || photo.badge, {
                defaultValue: photo.badge,
              })}
              badgeVariant="light"
              footer={
                <>
                  <span>{photo.author}</span>
                  <FavoriteHeartButton initialVotes={photo.votes} title={photo.title} />
                </>
              }
            />
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <MarketingButton
            as={AppLink}
            href={ROUTES.GALLERY}
            variant="primaryLg"
            icon={homeAsset('icon-arrow-gallery.svg')}
          >
            {t('home.showcase.viewFullGallery')}
          </MarketingButton>
        </div>
      </Shell>
    </section>
  );
});

CommunityWork.displayName = 'CommunityWork';

export default CommunityWork;
