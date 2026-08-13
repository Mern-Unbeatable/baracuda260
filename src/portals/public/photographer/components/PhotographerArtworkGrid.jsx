import React, { memo, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown, Images } from 'lucide-react';
import { matchesAlbumType } from '@/shared/data/albumTypes';
import { galleryDetailPath } from '@/shared/data/galleryPhotos';
import {
  FilterPillGroup,
  MarketingPagination,
  PhotoShowcaseCard,
} from '@/shared/ui/marketing';
import usePaginatedSlice from '@/shared/hooks/usePaginatedSlice';
import { PROFILE_ALBUM_FILTERS, PROFILE_SORT_OPTIONS } from '@/portals/public/photographer/data/photographerProfileData';

const PAGE_SIZE = 8;
const ALL_FILTER = 'All';

const SHOWCASE_BADGE_KEYS = {
  'Single Photo': 'common.badges.singlePhoto',
  '6 Photos Story': 'common.badges.sixPhotosStory',
  '12 photos - full Zodiac Story': 'common.badges.twelveZodiacFull',
};

const PhotographerArtworkGrid = memo(
  ({ titleKey, subtitleKey, photos, showCompetitionTag = false, showPrice = false }) => {
    const { t } = useTranslation();
    const [filter, setFilter] = useState(ALL_FILTER);
    const [sort, setSort] = useState(PROFILE_SORT_OPTIONS[0]);
    const [sortOpen, setSortOpen] = useState(false);

    const filterItems = useMemo(
      () =>
        PROFILE_ALBUM_FILTERS.map((item) => ({
          id: item.id,
          value: item.value,
          shortLabelKey: item.shortLabelKey,
          label:
            item.value === ALL_FILTER
              ? t('photographerProfile.filters.allArtwork')
              : t(SHOWCASE_BADGE_KEYS[item.value] || item.value, { defaultValue: item.value }),
        })),
      [t],
    );

    const filteredPhotos = useMemo(() => {
      let list =
        filter === ALL_FILTER
          ? photos
          : photos.filter((photo) => matchesAlbumType(photo.badge, filter));

      list = [...list];
      if (sort === 'oldest') list.reverse();
      if (sort === 'mostLiked') {
        list.sort(
          (a, b) =>
            Number(String(b.votes).replace(/,/g, '')) - Number(String(a.votes).replace(/,/g, '')),
        );
      }
      if (sort === 'mostViewed') {
        list.sort(
          (a, b) =>
            Number(String(b.views).replace(/,/g, '')) - Number(String(a.views).replace(/,/g, '')),
        );
      }
      return list;
    }, [filter, photos, sort]);

    const {
      currentPage,
      setPage,
      totalPages,
      pagedItems: pagedPhotos,
    } = usePaginatedSlice(filteredPhotos, PAGE_SIZE, [filter, sort]);

    return (
      <section className="mt-10 sm:mt-12">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <Images size={22} className="shrink-0 text-[#4048cd]" aria-hidden="true" />
              <h2 className="text-[20px] font-bold text-[#111827] sm:text-[22px]">
                {t(titleKey)}
              </h2>
            </div>
            <p className="mt-1 max-w-2xl text-[14px] leading-6 text-[#6b7280] sm:text-[15px]">
              {t(subtitleKey)}
            </p>
          </div>

          <div className="relative w-full shrink-0 sm:w-auto">
            <button
              type="button"
              aria-haspopup="listbox"
              aria-expanded={sortOpen}
              onClick={() => setSortOpen((open) => !open)}
              className="inline-flex w-full cursor-pointer items-center justify-between gap-2 rounded-lg border border-black/10 bg-white px-3 py-2 text-[14px] font-medium text-[#374151] sm:w-auto sm:justify-center"
            >
              {t(`photographerProfile.sort.${sort}`)}
              <ChevronDown size={16} aria-hidden="true" />
            </button>
            {sortOpen ? (
              <ul
                role="listbox"
                aria-label={t('photographerProfile.sort.label')}
                className="absolute right-0 z-20 mt-2 min-w-36 overflow-hidden rounded-lg border border-black/10 bg-white py-1 shadow-lg"
              >
                {PROFILE_SORT_OPTIONS.map((option) => (
                  <li key={option} role="option" aria-selected={sort === option}>
                    <button
                      type="button"
                      onClick={() => {
                        setSort(option);
                        setSortOpen(false);
                      }}
                      className={`flex w-full cursor-pointer px-3 py-2 text-left text-[14px] ${
                        sort === option
                          ? 'bg-[#4048cd]/10 font-semibold text-[#4048cd]'
                          : 'text-[#374151] hover:bg-[#f9fafb]'
                      }`}
                    >
                      {t(`photographerProfile.sort.${option}`)}
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>

        <FilterPillGroup
          className="mt-4 lg:justify-start"
          layout="scroll"
          items={filterItems}
          value={filter}
          onChange={setFilter}
          ariaLabel={t(titleKey)}
          renderLabel={(item) => (
            <>
              <span className="sm:hidden">
                {item.value === ALL_FILTER
                  ? t('photographerProfile.filters.allArtworkShort')
                  : t(item.shortLabelKey)}
              </span>
              <span className="hidden sm:inline">{item.label}</span>
            </>
          )}
        />

        <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {pagedPhotos.map((photo) => (
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
              price={showPrice ? photo.price : undefined}
              competitionLabel={
                showCompetitionTag && photo.inCompetition
                  ? t('photographerProfile.competitionTag')
                  : undefined
              }
              extraPhotosLabel={
                photo.extraPhotoCount
                  ? t('winners.extraPhotos', { count: photo.extraPhotoCount })
                  : undefined
              }
            />
          ))}
        </div>

        <MarketingPagination
          className="mt-8"
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setPage}
          ariaLabel={t('gallery.paginationAria', { defaultValue: 'Gallery pagination' })}
        />
      </section>
    );
  },
);

PhotographerArtworkGrid.displayName = 'PhotographerArtworkGrid';

export default PhotographerArtworkGrid;
