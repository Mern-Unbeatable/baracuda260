import React, { memo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ROUTES } from '../../config';
import {
  ALBUM_TYPES,
  ALBUM_TYPE_LABEL_KEYS,
  ALBUM_TYPE_SHORT_LABEL_KEYS,
  matchesAlbumType,
} from '../../data/albumTypes';
import { AppLink, ImgIcon, Shell, homeAsset } from '../site';

const A = '/assets/home';

const SHOWCASE_BADGE_KEYS = {
  'Single Photo': 'common.badges.singlePhoto',
  '6 PHOTOS STORY': 'common.badges.sixPhotosStory',
  '12 Photos - Full Zodiac Story': 'common.badges.twelveZodiacFull',
};

const SHOWCASE = [
  {
    title: 'Golden Hour Silence',
    author: 'Kasia L. · Poland',
    votes: '1,488',
    badge: 'Single Photo',
    image: `${A}/photo-golden.jpg`,
    albumType: 'Single Photo',
  },
  {
    title: 'Autumn Sequence',
    author: 'Kasia L. · Poland',
    votes: '1,488',
    badge: '6 PHOTOS STORY',
    image: `${A}/photo-autumn.jpg`,
    albumType: '6 Photo Story',
  },
  {
    title: 'Winqs Over the Marsh',
    author: 'Kasia L. · Poland',
    votes: '1,488',
    badge: 'Single Photo',
    image: `${A}/photo-wings.jpg`,
    albumType: 'Single Photo',
  },
  {
    title: 'City After Midniqht',
    author: 'Kasia L. · Poland',
    votes: '1,488',
    badge: '6 PHOTOS STORY',
    image: `${A}/photo-city.jpg`,
    albumType: '6 Photo Story',
  },
  {
    title: 'Tidal Memory',
    author: 'Sofia R. · Italy',
    votes: '1,488',
    badge: '12 Photos - Full Zodiac Story',
    image: `${A}/photo-tidal.jpg`,
    albumType: '12 photos - Full Zodiac Story',
  },
  {
    title: 'Forest Cathedral',
    author: 'Jan M. · Czech',
    votes: '1,488',
    badge: 'Single Photo',
    image: `${A}/photo-forest.jpg`,
    albumType: 'Single Photo',
  },
  {
    title: 'Morninq Fields',
    author: 'Kasia L. · Poland',
    votes: '1,488',
    badge: 'Single Photo',
    image: `${A}/photo-morning.jpg`,
    albumType: 'Single Photo',
  },
  {
    title: 'Zodiac Journey',
    author: 'Kasia L. · Poland',
    votes: '1,488',
    badge: '12 Photos - Full Zodiac Story',
    image: `${A}/photo-zodiac.jpg`,
    albumType: '12 photos - Full Zodiac Story',
  },
];

/**
 * Shared Community Work / Photo Showcase (Home) — album filters match Gallery Album Type.
 */
const CommunityWork = memo(() => {
  const { t } = useTranslation();
  const [filter, setFilter] = useState(ALBUM_TYPES[0].value);

  const photos = SHOWCASE.filter((photo) => matchesAlbumType(photo.albumType, filter));

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
            {ALBUM_TYPES.map((type, index) => (
              <button
                key={type.id}
                type="button"
                role="tab"
                aria-selected={filter === type.value}
                onClick={() => setFilter(type.value)}
                className={`cursor-pointer rounded-full px-4 py-2.5 text-center text-[13px] font-semibold transition sm:shrink-0 sm:py-2 sm:text-[14px] ${
                  index === ALBUM_TYPES.length - 1 ? 'col-span-2 sm:col-span-1' : ''
                } ${
                  filter === type.value ? 'bg-[#4048cd] text-white' : 'bg-[#f3f4f6] text-[#6b7280]'
                }`}
              >
                <span className="sm:hidden">{t(ALBUM_TYPE_SHORT_LABEL_KEYS[type.value])}</span>
                <span className="hidden sm:inline">{t(ALBUM_TYPE_LABEL_KEYS[type.value])}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {photos.map((photo) => (
            <article
              key={photo.title}
              className="overflow-hidden rounded-[12px] border border-black/10 bg-white"
            >
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
              <div className="p-4">
                <h3 className="text-[16px] font-bold text-[#0d0d14]">{photo.title}</h3>
                <div className="mt-2 flex items-center justify-between text-[14px] text-[#6b7280]">
                  <span>{photo.author}</span>
                  <span className="inline-flex items-center gap-1.5">
                    <ImgIcon src={homeAsset('icon-heart.svg')} size={24} />
                    {photo.votes}
                  </span>
                </div>
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
