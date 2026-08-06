import React, { memo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ROUTES } from '../../config';
import {
  ALBUM_TYPES,
  ALBUM_TYPE_LABEL_KEYS,
  ALBUM_TYPE_SHORT_LABEL_KEYS,
  matchesAlbumType,
} from '../../data/albumTypes';
import { galleryDetailPath } from '../../data/galleryPhotos';
import { AppLink, ImgIcon, Shell, homeAsset } from '../site';
import FavoriteHeartButton from './FavoriteHeartButton';

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
/** Mixed sample for the All tab — all 8 showcase cards. */
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

  const photos =
    filter === ALL_FILTER
      ? ALL_MIX
      : SHOWCASE.filter((photo) => matchesAlbumType(photo.albumType, filter));

  return (
    <section className="bg-white py-16 sm:py-20">
      <Shell>
        <div className="mb-8 flex flex-col gap-6 lg:mb-[52px] lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[14px] font-bold uppercase tracking-[1.2px] text-[#666dd7]">
              {t('home.showcase.eyebrow')}
            </p>
            <h2 className="mt-2 text-[36px] font-bold text-[#3a3a42] sm:text-[48px] sm:leading-[66px]">
              {t('home.showcase.title')}
            </h2>
          </div>
          <div
            className="grid w-full grid-cols-2 gap-2 sm:flex sm:w-auto sm:flex-wrap sm:gap-3 lg:justify-end"
            role="tablist"
            aria-label={t('home.showcase.title')}
          >
            {COMMUNITY_TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={filter === tab.value}
                onClick={() => setFilter(tab.value)}
                className={`cursor-pointer rounded-full px-4 py-2.5 text-center text-[13px] font-semibold transition sm:shrink-0 sm:px-4 sm:py-2 sm:text-[14px] ${
                  filter === tab.value ? 'bg-[#4048cd] text-white' : 'bg-[#f3f4f6] text-[#6b7280]'
                }`}
              >
                <span className="sm:hidden">{t(tab.shortLabelKey)}</span>
                <span className="hidden sm:inline">{t(tab.labelKey)}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {photos.map((photo) => (
            <article
              key={photo.id}
              className="overflow-hidden rounded-[12px] border border-black/10 bg-white transition hover:border-black/20 hover:shadow-sm"
            >
              <AppLink href={galleryDetailPath(photo.id)} className="block">
                <div className="relative h-[220px] sm:h-[252px]">
                  <img
                    src={photo.image}
                    alt={photo.title}
                    width={368}
                    height={252}
                    className="h-full w-full object-cover"
                  />
                  <span className="absolute left-3 top-3 rounded bg-[#e8eafc] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#4048cd]">
                    {t(SHOWCASE_BADGE_KEYS[photo.badge] || photo.badge, {
                      defaultValue: photo.badge,
                    })}
                  </span>
                </div>
                <div className="px-4 pt-4">
                  <h3 className="text-[16px] font-bold text-[#0d0d14]">{photo.title}</h3>
                </div>
              </AppLink>
              <div className="flex items-center justify-between px-4 pb-4 pt-2 text-[14px] text-[#6b7280]">
                <span>{photo.author}</span>
                <FavoriteHeartButton initialVotes={photo.votes} title={photo.title} />
              </div>
            </article>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <AppLink
            href={ROUTES.GALLERY}
            className="inline-flex items-center gap-2 rounded-full bg-[#ee1c25] px-8 py-3.5 text-[16px] font-bold text-white"
          >
            {t('home.showcase.viewFullGallery')}
            <ImgIcon src={homeAsset('icon-arrow-gallery.svg')} size={16} />
          </AppLink>
        </div>
      </Shell>
    </section>
  );
});

CommunityWork.displayName = 'CommunityWork';

export default CommunityWork;
