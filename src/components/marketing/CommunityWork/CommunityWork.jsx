import { useTranslation } from 'react-i18next';
import React, { memo, useMemo, useState } from 'react';
import { ROUTES } from '@/shared/config';
import {
  ALBUM_TYPES,
  ALBUM_TYPE_LABEL_KEYS,
  ALBUM_TYPE_SHORT_LABEL_KEYS,
  matchesAlbumType,
} from '@/shared/data/albumTypes';
import { GALLERY_PHOTOS, galleryDetailPath } from '@/shared/data/galleryPhotos';
import { AppLink, Shell, homeAsset } from '@/shared/site-chrome';
import FilterPillGroup from '@/components/marketing/FilterPillGroup/FilterPillGroup';
import MarketingButton from '@/components/marketing/MarketingButton/MarketingButton';
import SectionHeader from '@/components/marketing/SectionHeader/SectionHeader';
import PhotoShowcaseCard from '@/components/data-display/PhotoShowcaseCard/PhotoShowcaseCard';

const SHOWCASE_BADGE_KEYS = {
  'Single Photo': 'common.badges.singlePhoto',
  '6 PHOTOS STORY': 'common.badges.sixPhotosStory',
  '6 Photos Story': 'common.badges.sixPhotosStory',
  '12 Photos - Full Zodiac Story': 'common.badges.twelveZodiacFull',
  '12 photos - full Zodiac Story': 'common.badges.twelveZodiacFull',
};

const SHOWCASE_IDS = [
  'golden-hour-silence',
  'autumn-sequence',
  'wings-over-the-marsh',
  'city-after-midnight',
  'tidal-memory',
  'forest-cathedral',
  'morning-fields',
  'zodiac-journey',
];

const GALLERY_BY_ID = Object.fromEntries(GALLERY_PHOTOS.map((photo) => [photo.id, photo]));

const SHOWCASE = SHOWCASE_IDS.map((id) => GALLERY_BY_ID[id]).filter(Boolean);

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
      : SHOWCASE.filter((photo) => matchesAlbumType(photo.badge, filter));

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
              description={photo.description}
              likes={photo.votes}
              views={photo.views}
              date={photo.date}
              price={photo.price}
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
