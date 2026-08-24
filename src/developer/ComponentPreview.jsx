import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import PhotoShowcaseCard from '@/components/data-display/PhotoShowcaseCard/PhotoShowcaseCard';
import GalleryDetailImageDetails from '@/components/data-display/GalleryDetailImageDetails/GalleryDetailImageDetails';
import MemberArtworkCard from '@/components/data-display/MemberArtworkCard/MemberArtworkCard';
import ReportPhotoModal from '@/components/data-display/ReportPhotoModal/ReportPhotoModal';
import Pagination from '@/components/common/Pagination/Pagination';
import MarketingButton from '@/components/marketing/MarketingButton/MarketingButton';
import SectionHeader from '@/components/marketing/SectionHeader/SectionHeader';
import MarketingSearchBar from '@/components/marketing/MarketingSearchBar/MarketingSearchBar';
import PlanCard from '@/components/marketing/PlanCard/PlanCard';
import FilterPillGroup from '@/components/marketing/FilterPillGroup/FilterPillGroup';
import FilterCheckboxGroup from '@/components/marketing/FilterCheckboxGroup/FilterCheckboxGroup';
import MarketingCard from '@/components/marketing/MarketingCard/MarketingCard';
import TopPhotographers from '@/components/marketing/TopPhotographers/TopPhotographers';
import ActiveCompetitions from '@/components/marketing/ActiveCompetitions/ActiveCompetitions';
import HowItWorks from '@/components/marketing/HowItWorks/HowItWorks';
import HomeStatsSection from '@/components/marketing/HomeStatsSection/HomeStatsSection';
import GalleryDetailView from '@/components/data-display/GalleryDetailView/GalleryDetailView';
import GalleryDetailDonation from '@/components/data-display/GalleryDetailDonation/GalleryDetailDonation';
import GalleryDetailVideo from '@/components/data-display/GalleryDetailVideo/GalleryDetailVideo';
import SixStoryStrip from '@/components/data-display/SixStoryStrip/SixStoryStrip';
import TwelveStoryStrip from '@/components/data-display/TwelveStoryStrip/TwelveStoryStrip';
import BuyPhotoDetailView from '@/components/data-display/BuyPhotoDetailView/BuyPhotoDetailView';
import FavoriteHeartButton from '@/components/data-display/FavoriteHeartButton/FavoriteHeartButton';
import MemberArtworkStatCard from '@/components/data-display/MemberArtworkStatCard/MemberArtworkStatCard';
import MemberArtworkCardFooter from '@/components/data-display/MemberArtworkCardFooter/MemberArtworkCardFooter';
import MemberSellPhotoCard from '@/components/data-display/MemberSellPhotoCard/MemberSellPhotoCard';
import MemberFavouritePhotographerCard from '@/components/data-display/MemberFavouritePhotographerCard/MemberFavouritePhotographerCard';
import MemberPromotePanel from '@/components/forms/MemberPromotePanel/MemberPromotePanel';
import PhotographerProfileHeader from '@/components/data-display/PhotographerProfileHeader/PhotographerProfileHeader';
import PhotographerStatsBar from '@/components/data-display/PhotographerStatsBar/PhotographerStatsBar';
import MemberMessageCard from '@/components/data-display/MemberMessageCard/MemberMessageCard';
import MemberNotificationItem from '@/components/data-display/MemberNotificationItem/MemberNotificationItem';
import MemberProfileCoverHeader from '@/components/data-display/MemberProfileCoverHeader/MemberProfileCoverHeader';
import MemberProfileStatsBar from '@/components/data-display/MemberProfileStatsBar/MemberProfileStatsBar';
import AdminPageHeader from '@/components/common/AdminPageHeader/AdminPageHeader';
import AdminPagination from '@/components/common/AdminPagination/AdminPagination';
import SignBadge from '@/components/data-display/SignBadge/SignBadge';
import OverlayBadge from '@/components/marketing/OverlayBadge/OverlayBadge';
import PhotoShowcasePageContent from '@/components/marketing/PhotoShowcasePageContent/PhotoShowcasePageContent';
import CommunityWork from '@/components/marketing/CommunityWork/CommunityWork';
import MemberArtworkActionsMenu from '@/components/data-display/MemberArtworkActionsMenu/MemberArtworkActionsMenu';
import MemberArtworkGlobalRankings from '@/components/data-display/MemberArtworkGlobalRankings/MemberArtworkGlobalRankings';
import LanguageSwitcher from '@/components/common/LanguageSwitcher/LanguageSwitcher';
import { homeAsset } from '@/shared/site-chrome';
import { ALBUM_TYPE_VALUES, ALBUM_TYPE_LABEL_KEYS } from '@/shared/data/albumTypes';
import { GALLERY_PHOTOS } from '@/shared/data/galleryPhotos';
import {
  DEMO_ARTWORK_ITEM,
  DEMO_ARTWORK_ITEM_ENDED,
  DEMO_ARTWORK_ITEM_PROFILE,
  DEMO_ARTWORK_STAT,
  DEMO_BUY_PHOTO,
  DEMO_COMPETITION_CARDS,
  DEMO_DONATION,
  DEMO_FAVOURITE_PHOTOGRAPHER,
  DEMO_GALLERY_ENTRY_SINGLE,
  DEMO_GALLERY_ENTRY_SIX,
  DEMO_GALLERY_ENTRY_TWELVE,
  DEMO_IMAGE_DETAILS,
  DEMO_MEMBER_PROFILE,
  DEMO_MESSAGE,
  DEMO_NOTIFICATION,
  DEMO_PHOTOGRAPHER_PROFILE,
  DEMO_RANKINGS,
  DEMO_SELL_PHOTO_ITEM,
  DEMO_SHOWCASE_PHOTO,
  DEMO_SIGN_SLIDE,
  DEMO_SIX_STORY_SLIDES,
  DEMO_TWELVE_STORY_SLIDES,
  DEMO_VIDEO,
} from '@/data/demoData';

const ENTER_ARROW = homeAsset('icon-arrow.svg');
const FILTER_PILL_ITEMS = [
  { value: 'Single Photo', label: 'Single Photo' },
  { value: '6 Photos', label: '6 Photos' },
  { value: '12 photos - full Zodiac Story', label: 'Zodiac Story' },
];

function usePlanCardProps(index) {
  const { t } = useTranslation();
  const card = DEMO_COMPETITION_CARDS[index] ?? DEMO_COMPETITION_CARDS[0];
  return {
    id: card.id,
    icon: card.icon,
    checkIcon: card.check,
    title: t(card.titleKey),
    description: t(card.descriptionKey),
    features: card.featureKeys.map((key) => t(key)),
    prize: card.prize,
    prizeSuffix: t('common.prizeMoney'),
    popular: card.popular,
    popularLabel: card.popular ? t('common.mostPopular') : undefined,
    ctaLabel: t('common.enterNow'),
    ctaIcon: ENTER_ARROW,
  };
}

function ScrollPreview({ children, className = 'max-h-[640px]' }) {
  return <div className={`overflow-auto ${className}`}>{children}</div>;
}

function PhotoShowcaseCardPreview({ variantId }) {
  const base = {
    href: '/gallery/golden-hour-silence',
    image: DEMO_SHOWCASE_PHOTO.image,
    title: DEMO_SHOWCASE_PHOTO.title,
    description: DEMO_SHOWCASE_PHOTO.description,
    badge: DEMO_SHOWCASE_PHOTO.badge,
    likes: '1,000',
    views: DEMO_SHOWCASE_PHOTO.views,
    date: 'Aug 9, 2026',
  };

  if (variantId === 'winner') {
    return (
      <div className="max-w-sm">
        <PhotoShowcaseCard
          {...base}
          winnerRank="#1"
          competitionLabel="August Photography Competition"
        />
      </div>
    );
  }
  if (variantId === 'buy') {
    return (
      <div className="max-w-sm">
        <PhotoShowcaseCard {...base} price="$4.99" />
      </div>
    );
  }
  return (
    <div className="max-w-sm">
      <PhotoShowcaseCard {...base} />
    </div>
  );
}

function MemberArtworkCardPreview({ variantId }) {
  const items = {
    active: DEMO_ARTWORK_ITEM,
    ended: DEMO_ARTWORK_ITEM_ENDED,
    profile: DEMO_ARTWORK_ITEM_PROFILE,
  };
  const item = items[variantId] ?? DEMO_ARTWORK_ITEM;
  return (
    <div className="max-w-sm">
      <MemberArtworkCard item={item} badgeLabel="Single Photo" />
    </div>
  );
}

function MemberArtworkCardFooterPreview({ variantId }) {
  const items = {
    active: DEMO_ARTWORK_ITEM,
    ended: DEMO_ARTWORK_ITEM_ENDED,
    profile: DEMO_ARTWORK_ITEM_PROFILE,
  };
  return <MemberArtworkCardFooter item={items[variantId] ?? DEMO_ARTWORK_ITEM} />;
}

function MarketingSearchBarPreview() {
  const [query, setQuery] = useState('landscape');
  return (
    <MarketingSearchBar
      value={query}
      onChange={(event) => setQuery(event.target.value)}
      placeholder="Search photos…"
      className="max-w-md"
    />
  );
}

function PaginationPreview({ variantId }) {
  const [page, setPage] = useState(
    variantId === 'start' ? 2 : variantId === 'few' ? 2 : 5,
  );
  const totalPages = variantId === 'few' ? 4 : 28;
  return <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />;
}

function MarketingButtonPreview({ variantId }) {
  const variant = variantId === 'muted' ? 'muted' : variantId === 'ghost' ? 'ghost' : 'primary';
  const className = variantId === 'muted' ? '!bg-[#4048CD] !text-white hover:!bg-[#333BB0]' : '';
  return (
    <MarketingButton variant={variant} className={className}>
      {variantId === 'ghost' ? 'Learn more' : 'View Gallery'}
    </MarketingButton>
  );
}

function SectionHeaderPreview({ variantId }) {
  if (variantId === 'left') {
    return (
      <SectionHeader
        align="left"
        badge="My Artwork"
        badgeTone="brand"
        title="Your uploads"
        description="Manage competition entries and sell photos from one place."
        end={<MarketingButton variant="primary">Upload</MarketingButton>}
      />
    );
  }
  return (
    <SectionHeader
      badge="Gallery"
      title="Explore the latest entries"
      description="Browse competition photos from photographers around the world."
    />
  );
}

function PlanCardPreview({ variantId }) {
  const index = variantId === 'six' ? 1 : variantId === 'zodiac' ? 2 : 0;
  const props = usePlanCardProps(index);
  return (
    <div className="max-w-sm">
      <PlanCard {...props} />
    </div>
  );
}

function FilterPillGroupPreview() {
  const [tab, setTab] = useState(FILTER_PILL_ITEMS[0].value);
  return (
    <FilterPillGroup
      items={FILTER_PILL_ITEMS}
      value={tab}
      onChange={setTab}
      ariaLabel="Album type"
    />
  );
}

function FilterCheckboxGroupPreview() {
  const { t } = useTranslation();
  const [selected, setSelected] = useState([ALBUM_TYPE_VALUES[0]]);
  const toggle = (option) => {
    setSelected((current) =>
      current.includes(option) ? current.filter((v) => v !== option) : [...current, option],
    );
  };
  return (
    <FilterCheckboxGroup
      title="Album Type"
      options={ALBUM_TYPE_VALUES}
      selected={selected}
      onToggle={toggle}
      getLabel={(option) => t(ALBUM_TYPE_LABEL_KEYS[option] ?? option)}
      className="max-w-xs"
    />
  );
}

function MarketingCardPreview({ variantId }) {
  const variant = variantId === 'filled' ? 'filled' : variantId === 'showcase' ? 'showcase' : 'default';
  return (
    <MarketingCard variant={variant} className="max-w-sm p-6">
      <p className="text-[15px] text-[#374151]">
        {variant === 'showcase' ? 'Showcase card wrapper for photo grids.' : 'Marketing card content.'}
      </p>
    </MarketingCard>
  );
}

function GalleryDetailViewPreview({ variantId }) {
  const configs = {
    single: { entry: DEMO_GALLERY_ENTRY_SINGLE, variant: 'single' },
    six: { entry: DEMO_GALLERY_ENTRY_SIX, variant: 'six' },
    twelve: { entry: DEMO_GALLERY_ENTRY_TWELVE, variant: 'twelve' },
  };
  const cfg = configs[variantId] ?? configs.single;
  return (
    <ScrollPreview className="max-h-[720px]">
      <GalleryDetailView entry={cfg.entry} variant={cfg.variant} />
    </ScrollPreview>
  );
}

function SixStoryStripPreview() {
  const [index, setIndex] = useState(0);
  return (
    <SixStoryStrip
      slides={DEMO_SIX_STORY_SLIDES}
      activeIndex={index}
      onSelect={setIndex}
      stripAccent="red"
    />
  );
}

function TwelveStoryStripPreview() {
  const [index, setIndex] = useState(0);
  return (
    <TwelveStoryStrip
      slides={DEMO_TWELVE_STORY_SLIDES}
      activeIndex={index}
      onSelect={setIndex}
    />
  );
}

function AdminPaginationPreview({ variantId }) {
  const [page, setPage] = useState(2);
  if (variantId === 'users') {
    return (
      <AdminPagination
        variant="users"
        from={11}
        to={20}
        total={240}
        isFirstPage={false}
        isLastPage={false}
        onPrevious={() => {}}
        onNext={() => {}}
        showingText="Showing 11–20 of 240"
        previousLabel="Previous"
        nextLabel="Next"
      />
    );
  }
  return (
    <AdminPagination
      variant="submissions"
      page={page}
      totalPages={12}
      onPageChange={setPage}
      navAriaLabel="Pagination"
      firstLabel="First"
      prevLabel="Previous"
      nextLabel="Next"
      lastLabel="Last"
      pageLabel={(n) => `Page ${n}`}
    />
  );
}

function ReportPhotoModalPreview() {
  const [open, setOpen] = useState(true);
  return (
    <>
      <MarketingButton variant="outline" type="button" onClick={() => setOpen(true)}>
        Open report modal
      </MarketingButton>
      <ReportPhotoModal
        open={open}
        onClose={() => setOpen(false)}
        photoTitle={DEMO_SHOWCASE_PHOTO.title}
      />
    </>
  );
}

function MemberPromotePanelPreview() {
  const [open, setOpen] = useState(true);
  return (
    <>
      <MarketingButton type="button" onClick={() => setOpen(true)}>
        Open promote panel
      </MarketingButton>
      <MemberPromotePanel
        item={DEMO_ARTWORK_ITEM}
        open={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
}

const PREVIEWS = {
  'photo-showcase-card': PhotoShowcaseCardPreview,
  'gallery-detail-image-details': () => <GalleryDetailImageDetails details={DEMO_IMAGE_DETAILS} />,
  'member-artwork-card': MemberArtworkCardPreview,
  'report-photo-modal': ReportPhotoModalPreview,
  pagination: PaginationPreview,
  'marketing-button': MarketingButtonPreview,
  'section-header': SectionHeaderPreview,
  'marketing-search-bar': MarketingSearchBarPreview,
  'plan-card': PlanCardPreview,
  'filter-pill-group': FilterPillGroupPreview,
  'filter-checkbox-group': FilterCheckboxGroupPreview,
  'marketing-card': MarketingCardPreview,
  'top-photographers': ({ variantId }) => (
    <ScrollPreview>
      <TopPhotographers variant={variantId === 'page' ? 'page' : 'home'} />
    </ScrollPreview>
  ),
  'active-competitions': () => (
    <ScrollPreview>
      <ActiveCompetitions />
    </ScrollPreview>
  ),
  'how-it-works': () => (
    <ScrollPreview>
      <HowItWorks />
    </ScrollPreview>
  ),
  'home-stats-section': () => <HomeStatsSection />,
  'gallery-detail-view': GalleryDetailViewPreview,
  'gallery-detail-donation': () => (
    <GalleryDetailDonation
      photographer={DEMO_DONATION.photographer}
      avatar={DEMO_DONATION.avatar}
      bio={DEMO_DONATION.bio}
      onClose={() => {}}
    />
  ),
  'gallery-detail-video': () => (
    <GalleryDetailVideo poster={DEMO_VIDEO.poster} src={DEMO_VIDEO.src} title={DEMO_VIDEO.title} />
  ),
  'six-story-strip': SixStoryStripPreview,
  'twelve-story-strip': TwelveStoryStripPreview,
  'buy-photo-detail-view': () => (
    <ScrollPreview className="max-h-[720px]">
      <BuyPhotoDetailView photo={DEMO_BUY_PHOTO} />
    </ScrollPreview>
  ),
  'favorite-heart-button': () => (
    <FavoriteHeartButton initialVotes="1,488" title={DEMO_SHOWCASE_PHOTO.title} />
  ),
  'member-artwork-stat-card': () => <MemberArtworkStatCard {...DEMO_ARTWORK_STAT} />,
  'member-artwork-card-footer': MemberArtworkCardFooterPreview,
  'member-sell-photo-card': () => (
    <div className="max-w-sm">
      <MemberSellPhotoCard item={DEMO_SELL_PHOTO_ITEM} badgeLabel="Single Photo" />
    </div>
  ),
  'member-favourite-photographer-card': () => (
    <div className="max-w-md">
      <MemberFavouritePhotographerCard photographer={DEMO_FAVOURITE_PHOTOGRAPHER} />
    </div>
  ),
  'member-promote-panel': MemberPromotePanelPreview,
  'photographer-profile-header': () => (
    <PhotographerProfileHeader profile={DEMO_PHOTOGRAPHER_PROFILE} />
  ),
  'photographer-stats-bar': () => (
    <PhotographerStatsBar stats={DEMO_PHOTOGRAPHER_PROFILE.stats} />
  ),
  'member-message-card': () => (
    <div className="max-w-md">
      <MemberMessageCard message={DEMO_MESSAGE} />
    </div>
  ),
  'member-notification-item': () => <MemberNotificationItem item={DEMO_NOTIFICATION} />,
  'member-profile-cover-header': () => (
    <MemberProfileCoverHeader profile={DEMO_MEMBER_PROFILE} />
  ),
  'member-profile-stats-bar': () => (
    <MemberProfileStatsBar stats={DEMO_MEMBER_PROFILE.stats} />
  ),
  'admin-page-header': () => (
    <AdminPageHeader
      eyebrow="Admin"
      title="Gallery Submissions"
      description="Review and moderate competition entries."
    />
  ),
  'admin-pagination': AdminPaginationPreview,
  'sign-badge': ({ variantId }) => (
    <div className="relative h-32 w-full max-w-md rounded-lg bg-[#e9e9ef]">
      <SignBadge slide={DEMO_SIGN_SLIDE} blue={variantId === 'blue'} />
    </div>
  ),
  'overlay-badge': () => <OverlayBadge>Single Photo</OverlayBadge>,
  'photo-showcase-page-content': () => (
    <ScrollPreview className="max-h-[720px]">
      <PhotoShowcasePageContent photos={GALLERY_PHOTOS} i18nPrefix="gallery" />
    </ScrollPreview>
  ),
  'community-work': () => (
    <ScrollPreview>
      <CommunityWork />
    </ScrollPreview>
  ),
  'member-artwork-actions-menu': () => (
    <div className="relative h-40 w-full max-w-sm rounded-lg bg-[#e9e9ef]">
      <MemberArtworkActionsMenu item={DEMO_ARTWORK_ITEM} />
    </div>
  ),
  'member-artwork-global-rankings': () => (
    <ScrollPreview>
      <MemberArtworkGlobalRankings
        rankings={DEMO_RANKINGS}
        showingCount={5}
        showingTotal="24,802"
      />
    </ScrollPreview>
  ),
  'language-switcher': () => (
    <div className="flex h-40 items-start">
      <LanguageSwitcher />
    </div>
  ),
};

export default function ComponentPreview({ previewId, variantId }) {
  const Preview = PREVIEWS[previewId];
  if (!Preview) {
    return (
      <p className="text-sm text-[#6b7280]">
        No preview registered for &quot;{previewId}&quot;.
      </p>
    );
  }
  return <Preview variantId={variantId} />;
}
