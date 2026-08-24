/**
 * Component documentation catalog for /developer.
 * Keep in sync when adding shared UI used across the app.
 *
 * Demo payloads: `import { DEMO_* } from '@/data/demoData'`
 */

export const DOC_CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'data-display', label: 'Data Display' },
  { id: 'marketing', label: 'Marketing' },
  { id: 'forms', label: 'Forms' },
  { id: 'common', label: 'Common' },
];

export const COMPONENT_DOCS = [
  {
    id: 'photo-showcase-card',
    name: 'PhotoShowcaseCard',
    category: 'data-display',
    summary: 'Gallery / home photo card with save badge, stats row, and report menu.',
    path: 'src/components/data-display/PhotoShowcaseCard/',
    importExample:
      "import PhotoShowcaseCard from '@/components/data-display/PhotoShowcaseCard/PhotoShowcaseCard'\nimport { DEMO_SHOWCASE_PHOTO } from '@/data/demoData'",
    props: [
      { name: 'href', type: 'string', required: true, description: 'Link target for the card image and title.' },
      { name: 'image', type: 'string', required: true, description: 'Image URL.' },
      { name: 'title', type: 'string', required: true, description: 'Card title shown below the image.' },
      { name: 'imageAlt', type: 'string', required: false, description: 'Alt text — defaults to title.' },
      { name: 'badge', type: 'string', required: false, description: 'Album type badge on the image (e.g. Single Photo).' },
      { name: 'description', type: 'string', required: false, description: 'Short description under the title.' },
      { name: 'likes', type: 'string | number', required: false, description: 'Heart count in the stats row.' },
      { name: 'views', type: 'string | number', required: false, description: 'View count in the stats row.' },
      { name: 'date', type: 'string', required: false, description: 'Upload / competition date in the stats row.' },
      { name: 'price', type: 'string', required: false, description: 'Price badge for buy-photos cards.' },
      { name: 'competitionLabel', type: 'string', required: false, description: 'Competition name overlay on the image.' },
      { name: 'winnerRank', type: 'string', required: false, description: 'Winner rank overlay (e.g. #1).' },
      { name: 'extraPhotosLabel', type: 'string', required: false, description: 'Multi-photo count label on the image.' },
      { name: 'className', type: 'string', required: false, defaultValue: "''", description: 'Extra classes on the card wrapper.' },
      {
        name: 'onMenuClick',
        type: '(event) => void',
        required: false,
        description: 'Override three-dot menu. Default opens ReportPhotoModal.',
      },
    ],
    requiredExample: `<PhotoShowcaseCard
  href="/gallery/golden-hour-silence"
  image={DEMO_SHOWCASE_PHOTO.image}
  title={DEMO_SHOWCASE_PHOTO.title}
  badge={DEMO_SHOWCASE_PHOTO.badge}
  description={DEMO_SHOWCASE_PHOTO.description}
  likes="1,000"
  views={DEMO_SHOWCASE_PHOTO.views}
  date="Aug 9, 2026"
/>`,
    optionalExample: `<PhotoShowcaseCard
  href="/gallery/golden-hour-silence"
  image={DEMO_SHOWCASE_PHOTO.image}
  title={DEMO_SHOWCASE_PHOTO.title}
  badge="6 Photos Story"
  competitionLabel="August Competition"
  winnerRank="#1"
  extraPhotosLabel="+5"
  price="$4.99"
  likes="1,000"
  views="8,420"
  date="Aug 9, 2026"
/>`,
    previewId: 'photo-showcase-card',
    variants: [
      {
        id: 'default',
        name: 'Default',
        description: 'Standard single-photo card.',
        example: `<PhotoShowcaseCard href="/gallery/..." image={photo.image} title={photo.title} likes="1,000" views="8,420" date="Aug 9, 2026" />`,
      },
      {
        id: 'winner',
        name: 'Winner overlay',
        description: 'Competition winner with rank badge.',
        example: `<PhotoShowcaseCard ... winnerRank="#1" competitionLabel="August Competition" />`,
      },
      {
        id: 'buy',
        name: 'Buy photos',
        description: 'Price badge for marketplace cards.',
        example: `<PhotoShowcaseCard ... price="$4.99" />`,
      },
    ],
  },
  {
    id: 'gallery-detail-image-details',
    name: 'GalleryDetailImageDetails',
    category: 'data-display',
    summary: 'Lavender metadata panel — credit, resolution, file type, categories, etc.',
    path: 'src/components/data-display/GalleryDetailImageDetails/',
    importExample:
      "import GalleryDetailImageDetails from '@/components/data-display/GalleryDetailImageDetails/GalleryDetailImageDetails'\nimport { DEMO_IMAGE_DETAILS } from '@/data/demoData'",
    props: [
      {
        name: 'details',
        type: 'object',
        required: true,
        description: 'Keys: credit, creativeNumber, resolution, quality, fileType, fileSize, uploadDate, categories.',
      },
    ],
    requiredExample: `<GalleryDetailImageDetails details={DEMO_IMAGE_DETAILS} />`,
    optionalExample: `<GalleryDetailImageDetails
  details={{
    ...DEMO_IMAGE_DETAILS,
    credit: 'Kasia L.',
    categories: 'Landscape, Nature',
  }}
/>`,
    previewId: 'gallery-detail-image-details',
  },
  {
    id: 'member-artwork-card',
    name: 'MemberArtworkCard',
    category: 'data-display',
    summary: 'Member panel artwork card with footer states (active, ended, profile-only).',
    path: 'src/components/data-display/MemberArtworkCard/',
    importExample:
      "import MemberArtworkCard from '@/components/data-display/MemberArtworkCard/MemberArtworkCard'\nimport { DEMO_ARTWORK_ITEM } from '@/data/demoData'",
    props: [
      { name: 'item', type: 'object', required: true, description: 'Artwork payload (title, image, stats, footerState, …).' },
      { name: 'badgeLabel', type: 'string', required: true, description: 'Translated album badge label.' },
      {
        name: 'onEdit',
        type: '(item) => void',
        required: false,
        description: 'Three-dot menu → Edit.',
      },
      {
        name: 'onDelete',
        type: '(item) => void',
        required: false,
        description: 'Three-dot menu → Delete.',
      },
      {
        name: 'onPromote',
        type: '(item) => void',
        required: false,
        description: 'Three-dot menu → Promote.',
      },
    ],
    requiredExample: `<MemberArtworkCard
  item={DEMO_ARTWORK_ITEM}
  badgeLabel="Single Photo"
/>`,
    optionalExample: `<MemberArtworkCard
  item={DEMO_ARTWORK_ITEM}
  badgeLabel="Single Photo"
  onEdit={(item) => {}}
  onDelete={(item) => {}}
  onPromote={(item) => {}}
/>`,
    previewId: 'member-artwork-card',
    variants: [
      {
        id: 'active',
        name: 'Active competition',
        description: 'Default footer with votes and progress.',
      },
      {
        id: 'ended',
        name: 'Competition ended',
        description: 'Ended state with final vote count.',
      },
      {
        id: 'profile',
        name: 'Profile only',
        description: 'No competition footer — profile grid.',
      },
    ],
  },
  {
    id: 'report-photo-modal',
    name: 'ReportPhotoModal',
    category: 'data-display',
    summary: 'Report dialog opened from photo card three-dot menu.',
    path: 'src/components/data-display/ReportPhotoModal/',
    importExample: "import ReportPhotoModal from '@/components/data-display/ReportPhotoModal/ReportPhotoModal'",
    props: [
      { name: 'open', type: 'boolean', required: true, description: 'Controls visibility.' },
      { name: 'onClose', type: '() => void', required: true, description: 'Close handler (backdrop, X, Escape).' },
      { name: 'photoTitle', type: 'string', required: false, defaultValue: "''", description: 'Shown in the modal header.' },
      { name: 'onSubmit', type: '({ reason, details }) => void', required: false, description: 'Called when user submits a valid report.' },
    ],
    requiredExample: `const [open, setOpen] = useState(false)

<ReportPhotoModal
  open={open}
  onClose={() => setOpen(false)}
  photoTitle="Golden Hour Silence"
/>`,
    optionalExample: `<ReportPhotoModal
  open={open}
  onClose={() => setOpen(false)}
  photoTitle="Golden Hour Silence"
  onSubmit={({ reason, details }) => console.log(reason, details)}
/>`,
    previewId: 'report-photo-modal',
  },
  {
    id: 'pagination',
    name: 'Pagination',
    category: 'common',
    summary: 'Gallery-style pagination with first/prev/numbers/ellipsis/next/last.',
    path: 'src/components/common/Pagination/',
    importExample: "import Pagination from '@/components/common/Pagination/Pagination'",
    props: [
      { name: 'currentPage', type: 'number', required: true, description: 'Active page (1-based).' },
      { name: 'totalPages', type: 'number', required: true, description: 'Total page count. Renders nothing when ≤ 1.' },
      { name: 'onPageChange', type: '(page: number) => void', required: false, description: 'Called when user selects a valid page.' },
      { name: 'windowSize', type: 'number', required: false, description: 'Visible page number window.' },
      { name: 'className', type: 'string', required: false, defaultValue: "''", description: 'Extra classes on the nav wrapper.' },
    ],
    requiredExample: `const [page, setPage] = useState(1)

<Pagination
  currentPage={page}
  totalPages={12}
  onPageChange={setPage}
/>`,
    optionalExample: `<Pagination
  currentPage={page}
  totalPages={totalPages}
  onPageChange={setPage}
  className="mt-8"
/>`,
    previewId: 'pagination',
    variants: [
      { id: 'middle', name: 'Middle page', description: 'Ellipsis on both sides (page 5 of 28).' },
      { id: 'start', name: 'Start', description: 'Leading pages (page 2 of 28).' },
      { id: 'few', name: 'Few pages', description: 'All numbers shown (4 pages).' },
    ],
  },
  {
    id: 'marketing-button',
    name: 'MarketingButton',
    category: 'marketing',
    summary: 'Primary / secondary / ghost buttons used on public marketing pages.',
    path: 'src/components/marketing/MarketingButton/',
    importExample: "import MarketingButton from '@/components/marketing/MarketingButton/MarketingButton'",
    props: [
      { name: 'children', type: 'ReactNode', required: true, description: 'Button label.' },
      {
        name: 'variant',
        type: "'primary' | 'primaryLg' | 'secondary' | 'ghost' | 'outline' | 'muted'",
        required: false,
        defaultValue: "'primary'",
        description: 'Visual style preset.',
      },
      { name: 'icon', type: 'string', required: false, description: 'Optional trailing icon src.' },
      { name: 'as', type: 'element type', required: false, defaultValue: "'button'", description: 'Render as button or link component.' },
      { name: 'className', type: 'string', required: false, defaultValue: "''", description: 'Extra classes.' },
    ],
    requiredExample: `<MarketingButton variant="primary">
  View Gallery
</MarketingButton>`,
    optionalExample: `<MarketingButton variant="muted" className="!bg-[#4048CD] !text-white">
  Download Photo
</MarketingButton>`,
    previewId: 'marketing-button',
    variants: [
      { id: 'primary', name: 'Primary', description: 'Default red CTA.' },
      { id: 'muted', name: 'Muted / brand', description: 'Indigo pill — login / download style.' },
      { id: 'ghost', name: 'Ghost', description: 'Text-only link style.' },
    ],
  },
  {
    id: 'section-header',
    name: 'SectionHeader',
    category: 'marketing',
    summary: 'Page section title block with optional badge, description, and right-side action.',
    path: 'src/components/marketing/SectionHeader/',
    importExample: "import SectionHeader from '@/components/marketing/SectionHeader/SectionHeader'",
    props: [
      { name: 'badge', type: 'string', required: false, description: 'Small uppercase label above the title.' },
      { name: 'title', type: 'string', required: false, description: 'Main heading.' },
      { name: 'description', type: 'string', required: false, description: 'Supporting copy under the title.' },
      { name: 'badgeTone', type: "'red' | 'indigo' | 'brand' | 'navy'", required: false, defaultValue: "'red'", description: 'Badge color preset.' },
      { name: 'align', type: "'left' | 'center'", required: false, defaultValue: "'center'", description: 'Text alignment.' },
      { name: 'end', type: 'ReactNode', required: false, description: 'Optional right-side slot (e.g. a button).' },
      { name: 'className', type: 'string', required: false, defaultValue: "''", description: 'Wrapper classes.' },
    ],
    requiredExample: `<SectionHeader
  badge="Gallery"
  title="Explore the latest entries"
  description="Browse competition photos from photographers around the world."
/>`,
    optionalExample: `<SectionHeader
  align="left"
  badge="My Artwork"
  badgeTone="brand"
  title="Your uploads"
  end={<MarketingButton variant="primary">Upload</MarketingButton>}
/>`,
    previewId: 'section-header',
    variants: [
      { id: 'center', name: 'Center aligned', description: 'Default marketing layout.' },
      { id: 'left', name: 'Left aligned', description: 'Panel / dashboard sections.' },
    ],
  },
  {
    id: 'marketing-search-bar',
    name: 'MarketingSearchBar',
    category: 'marketing',
    summary: 'Rounded search input used on gallery and listing pages.',
    path: 'src/components/marketing/MarketingSearchBar/',
    importExample: "import MarketingSearchBar from '@/components/marketing/MarketingSearchBar/MarketingSearchBar'",
    props: [
      { name: 'value', type: 'string', required: true, description: 'Controlled input value.' },
      { name: 'onChange', type: '(event) => void', required: true, description: 'Input change handler.' },
      { name: 'onSubmit', type: '(event) => void', required: false, description: 'Form submit handler.' },
      { name: 'placeholder', type: 'string', required: false, description: 'Input placeholder.' },
      { name: 'ariaLabel', type: 'string', required: false, description: 'Accessible label fallback.' },
      { name: 'className', type: 'string', required: false, defaultValue: "''", description: 'Extra form classes.' },
    ],
    requiredExample: `const [query, setQuery] = useState('')

<MarketingSearchBar
  value={query}
  onChange={(e) => setQuery(e.target.value)}
  placeholder="Search photos…"
/>`,
    optionalExample: `<MarketingSearchBar
  value={query}
  onChange={(e) => setQuery(e.target.value)}
  onSubmit={() => runSearch(query)}
  placeholder="Search gallery…"
  className="max-w-md"
/>`,
    previewId: 'marketing-search-bar',
  },
  {
    id: 'plan-card',
    name: 'PlanCard',
    category: 'marketing',
    summary: 'Competition / album-type pricing card — Single Photo, 6-Photo Story, Zodiac Album.',
    path: 'src/components/marketing/PlanCard/',
    importExample:
      "import PlanCard from '@/components/marketing/PlanCard/PlanCard'\nimport { DEMO_COMPETITION_CARDS } from '@/data/demoData'",
    props: [
      { name: 'title', type: 'string', required: true, description: 'Card heading (album type name).' },
      { name: 'description', type: 'string', required: true, description: 'Short pitch under the title.' },
      { name: 'features', type: 'string[]', required: false, description: 'Bullet list with check icons.' },
      { name: 'prize', type: 'string', required: false, description: 'Prize amount (e.g. $1500.00).' },
      { name: 'prizeSuffix', type: 'string', required: false, description: 'Text after prize (e.g. /prize money).' },
      { name: 'icon', type: 'string', required: false, description: 'Top icon src.' },
      { name: 'checkIcon', type: 'string', required: false, description: 'Feature list check icon.' },
      { name: 'popular', type: 'boolean', required: false, description: 'Shows “Most Popular” pill.' },
      { name: 'popularLabel', type: 'string', required: false, description: 'Popular badge label.' },
      { name: 'ctaLabel', type: 'string', required: false, description: 'Bottom button label.' },
      { name: 'onCta', type: '() => void', required: false, description: 'CTA click handler.' },
    ],
    requiredExample: `<PlanCard
  title="Single Photo"
  description="Submit one outstanding photograph."
  prize="$1500.00"
  features={['Monthly competition', 'Community voting']}
/>`,
    optionalExample: `<PlanCard
  title="6-Photos Story"
  description="Craft a visual narrative in six frames."
  prize="$2500.00"
  popular
  popularLabel="MOST POPULAR"
  ctaLabel="Enter Now"
/>`,
    previewId: 'plan-card',
    variants: [
      { id: 'single', name: 'Single Photo', description: 'One-image competition tier.' },
      { id: 'six', name: '6-Photo Story', description: 'Most popular middle tier.' },
      { id: 'zodiac', name: 'Zodiac Album', description: '12-photo grand prize tier.' },
    ],
  },
  {
    id: 'filter-pill-group',
    name: 'FilterPillGroup',
    category: 'marketing',
    summary: 'Tab-style pill filters for album types, leaderboard tabs, etc.',
    path: 'src/components/marketing/FilterPillGroup/',
    importExample: "import FilterPillGroup from '@/components/marketing/FilterPillGroup/FilterPillGroup'",
    props: [
      { name: 'items', type: '{ id?, value, label }[]', required: true, description: 'Pill options.' },
      { name: 'value', type: 'string', required: true, description: 'Active value.' },
      { name: 'onChange', type: '(value) => void', required: true, description: 'Selection handler.' },
      { name: 'ariaLabel', type: 'string', required: false, description: 'Tablist aria-label.' },
      { name: 'density', type: "'default' | 'compact'", required: false, description: 'Pill size preset.' },
      { name: 'layout', type: "'default' | 'scroll'", required: false, description: 'Horizontal scroll on mobile.' },
    ],
    requiredExample: `<FilterPillGroup
  items={[
    { value: 'Single Photo', label: 'Single Photo' },
    { value: '6 Photos', label: '6 Photos' },
  ]}
  value={tab}
  onChange={setTab}
  ariaLabel="Album type"
/>`,
    optionalExample: `<FilterPillGroup layout="scroll" density="compact" ... />`,
    previewId: 'filter-pill-group',
  },
  {
    id: 'filter-checkbox-group',
    name: 'FilterCheckboxGroup',
    category: 'marketing',
    summary: 'Sidebar checkbox filters (gallery album type, categories).',
    path: 'src/components/marketing/FilterCheckboxGroup/',
    importExample: "import FilterCheckboxGroup from '@/components/marketing/FilterCheckboxGroup/FilterCheckboxGroup'",
    props: [
      { name: 'title', type: 'string', required: true, description: 'Group heading.' },
      { name: 'options', type: 'string[]', required: true, description: 'Checkbox values.' },
      { name: 'selected', type: 'string[]', required: true, description: 'Checked values.' },
      { name: 'onToggle', type: '(option) => void', required: true, description: 'Toggle one option.' },
      { name: 'getLabel', type: '(option) => string', required: false, description: 'Custom label renderer.' },
    ],
    requiredExample: `<FilterCheckboxGroup
  title="Album Type"
  options={['Single Photo', '6 Photo Story']}
  selected={selected}
  onToggle={toggle}
/>`,
    optionalExample: `<FilterCheckboxGroup getLabel={(o) => t(o)} ... />`,
    previewId: 'filter-checkbox-group',
  },
  {
    id: 'marketing-card',
    name: 'MarketingCard',
    category: 'marketing',
    summary: 'Base card shell — default, showcase, filled, inset variants.',
    path: 'src/components/marketing/MarketingCard/',
    importExample: "import MarketingCard from '@/components/marketing/MarketingCard/MarketingCard'",
    props: [
      { name: 'variant', type: "'default' | 'subtle' | 'showcase' | 'filled' | 'inset'", required: false, defaultValue: "'default'", description: 'Visual preset.' },
      { name: 'as', type: 'element', required: false, description: 'Polymorphic wrapper tag.' },
      { name: 'children', type: 'ReactNode', required: true, description: 'Card content.' },
      { name: 'className', type: 'string', required: false, description: 'Extra classes.' },
    ],
    requiredExample: `<MarketingCard variant="filled" className="p-6">
  <p>Card content</p>
</MarketingCard>`,
    optionalExample: `<MarketingCard variant="showcase" as="article">...</MarketingCard>`,
    previewId: 'marketing-card',
    variants: [
      { id: 'default', name: 'Default', description: 'White bordered card.' },
      { id: 'filled', name: 'Filled', description: 'Gray filled panel.' },
      { id: 'showcase', name: 'Showcase', description: 'Photo card wrapper.' },
    ],
  },
  {
    id: 'top-photographers',
    name: 'TopPhotographers',
    category: 'marketing',
    summary: 'Leaderboard section — podium, standings table, album tabs, month picker.',
    path: 'src/components/marketing/TopPhotographers/',
    importExample: "import TopPhotographers from '@/components/marketing/TopPhotographers/TopPhotographers'",
    props: [
      { name: 'variant', type: "'home' | 'page'", required: false, defaultValue: "'home'", description: 'home = compact CTA; page = full leaderboard layout.' },
    ],
    requiredExample: `<TopPhotographers variant="home" />`,
    optionalExample: `<TopPhotographers variant="page" />`,
    previewId: 'top-photographers',
    variants: [
      { id: 'home', name: 'Home section', description: 'Used on the landing page.' },
      { id: 'page', name: 'Leaderboard page', description: 'Full-width standings.' },
    ],
  },
  {
    id: 'active-competitions',
    name: 'ActiveCompetitions',
    category: 'marketing',
    summary: 'Home / competitions section with all three PlanCards in a grid.',
    path: 'src/components/marketing/ActiveCompetitions/',
    importExample: "import ActiveCompetitions from '@/components/marketing/ActiveCompetitions/ActiveCompetitions'",
    props: [],
    requiredExample: `<ActiveCompetitions />`,
    optionalExample: `<ActiveCompetitions />`,
    previewId: 'active-competitions',
  },
  {
    id: 'how-it-works',
    name: 'HowItWorks',
    category: 'marketing',
    summary: 'Four-step competition flow section (Home + Competitions).',
    path: 'src/components/marketing/HowItWorks/',
    importExample: "import HowItWorks from '@/components/marketing/HowItWorks/HowItWorks'",
    props: [],
    requiredExample: `<HowItWorks />`,
    optionalExample: `<HowItWorks />`,
    previewId: 'how-it-works',
  },
  {
    id: 'home-stats-section',
    name: 'HomeStatsSection',
    category: 'marketing',
    summary: 'Platform stats row (photographers, photos, votes, prizes).',
    path: 'src/components/marketing/HomeStatsSection/',
    importExample: "import HomeStatsSection from '@/components/marketing/HomeStatsSection/HomeStatsSection'",
    props: [],
    requiredExample: `<HomeStatsSection />`,
    optionalExample: `<HomeStatsSection />`,
    previewId: 'home-stats-section',
  },
  {
    id: 'gallery-detail-view',
    name: 'GalleryDetailView',
    category: 'data-display',
    summary: 'Full photo detail page — single, 6-photo story, or 12-photo zodiac.',
    path: 'src/components/data-display/GalleryDetailView/',
    importExample:
      "import GalleryDetailView from '@/components/data-display/GalleryDetailView/GalleryDetailView'\nimport { DEMO_GALLERY_ENTRY_SINGLE, DEMO_GALLERY_ENTRY_SIX, DEMO_GALLERY_ENTRY_TWELVE } from '@/data/demoData'",
    props: [
      { name: 'entry', type: 'object', required: true, description: 'Photo/story payload from gallery data.' },
      { name: 'variant', type: "'single' | 'six' | 'sixBlue' | 'twelve'", required: false, defaultValue: "'single'", description: 'Layout + strip type.' },
      { name: 'activeHref', type: 'string', required: false, description: 'Breadcrumb back link.' },
      { name: 'Breadcrumb', type: 'component', required: false, description: 'Custom breadcrumb component.' },
    ],
    requiredExample: `<GalleryDetailView entry={DEMO_GALLERY_ENTRY_SINGLE} variant="single" />`,
    optionalExample: `<GalleryDetailView entry={DEMO_GALLERY_ENTRY_TWELVE} variant="twelve" />`,
    previewId: 'gallery-detail-view',
    variants: [
      { id: 'single', name: 'Single Photo', description: 'One hero image + metadata + comments.' },
      { id: 'six', name: '6-Photo Story', description: 'Red-theme sign strip + carousel.' },
      { id: 'twelve', name: 'Zodiac Album', description: '12-sign strip (red + blue themes).' },
    ],
  },
  {
    id: 'gallery-detail-donation',
    name: 'GalleryDetailDonation',
    category: 'forms',
    summary: 'Support photographer donation form on gallery detail.',
    path: 'src/components/data-display/GalleryDetailDonation/',
    importExample:
      "import GalleryDetailDonation from '@/components/data-display/GalleryDetailDonation/GalleryDetailDonation'\nimport { DEMO_DONATION } from '@/data/demoData'",
    props: [
      { name: 'photographer', type: 'string', required: true, description: 'Photographer display name.' },
      { name: 'avatar', type: 'string', required: true, description: 'Avatar URL.' },
      { name: 'bio', type: 'string', required: false, description: 'Short bio under title.' },
      { name: 'onClose', type: '() => void', required: false, description: 'Dismiss panel.' },
    ],
    requiredExample: `<GalleryDetailDonation
  photographer={DEMO_DONATION.photographer}
  avatar={DEMO_DONATION.avatar}
  bio={DEMO_DONATION.bio}
/>`,
    optionalExample: `<GalleryDetailDonation ... onClose={() => setOpen(false)} />`,
    previewId: 'gallery-detail-donation',
  },
  {
    id: 'gallery-detail-video',
    name: 'GalleryDetailVideo',
    category: 'data-display',
    summary: 'Hero video player with play/pause overlay.',
    path: 'src/components/data-display/GalleryDetailVideo/',
    importExample:
      "import GalleryDetailVideo from '@/components/data-display/GalleryDetailVideo/GalleryDetailVideo'\nimport { DEMO_VIDEO } from '@/data/demoData'",
    props: [
      { name: 'poster', type: 'string', required: true, description: 'Video poster image.' },
      { name: 'src', type: 'string', required: true, description: 'Video URL.' },
      { name: 'title', type: 'string', required: false, description: 'Accessible label.' },
    ],
    requiredExample: `<GalleryDetailVideo poster={DEMO_VIDEO.poster} src={DEMO_VIDEO.src} title={DEMO_VIDEO.title} />`,
    optionalExample: `<GalleryDetailVideo poster="..." src="..." title="Golden Hour" />`,
    previewId: 'gallery-detail-video',
  },
  {
    id: 'six-story-strip',
    name: 'SixStoryStrip',
    category: 'data-display',
    summary: '6-photo story thumbnail strip + zodiac sign row.',
    path: 'src/components/data-display/SixStoryStrip/',
    importExample:
      "import SixStoryStrip from '@/components/data-display/SixStoryStrip/SixStoryStrip'\nimport { DEMO_SIX_STORY_SLIDES } from '@/data/demoData'",
    props: [
      { name: 'slides', type: 'object[]', required: true, description: 'Slide objects with sign, icon, thumb, number.' },
      { name: 'activeIndex', type: 'number', required: true, description: 'Selected slide index.' },
      { name: 'onSelect', type: '(index) => void', required: true, description: 'Thumb click handler.' },
      { name: 'stripAccent', type: "'red' | 'blue'", required: false, description: 'Red or blue zodiac theme.' },
    ],
    requiredExample: `<SixStoryStrip slides={slides} activeIndex={0} onSelect={setIndex} />`,
    optionalExample: `<SixStoryStrip stripAccent="blue" ... />`,
    previewId: 'six-story-strip',
  },
  {
    id: 'twelve-story-strip',
    name: 'TwelveStoryStrip',
    category: 'data-display',
    summary: '12-photo zodiac strip with red/blue theme per slide.',
    path: 'src/components/data-display/TwelveStoryStrip/',
    importExample:
      "import TwelveStoryStrip from '@/components/data-display/TwelveStoryStrip/TwelveStoryStrip'\nimport { DEMO_TWELVE_STORY_SLIDES } from '@/data/demoData'",
    props: [
      { name: 'slides', type: 'object[]', required: true, description: '12 slides with theme red|blue.' },
      { name: 'activeIndex', type: 'number', required: true, description: 'Selected slide.' },
      { name: 'onSelect', type: '(index) => void', required: true, description: 'Selection handler.' },
    ],
    requiredExample: `<TwelveStoryStrip slides={slides} activeIndex={0} onSelect={setIndex} />`,
    optionalExample: `<TwelveStoryStrip ... />`,
    previewId: 'twelve-story-strip',
  },
  {
    id: 'buy-photo-detail-view',
    name: 'BuyPhotoDetailView',
    category: 'data-display',
    summary: 'Marketplace photo detail — specs, price, buy CTA, image details.',
    path: 'src/components/data-display/BuyPhotoDetailView/',
    importExample:
      "import BuyPhotoDetailView from '@/components/data-display/BuyPhotoDetailView/BuyPhotoDetailView'\nimport { DEMO_BUY_PHOTO } from '@/data/demoData'",
    props: [
      { name: 'photo', type: 'object', required: true, description: 'Buy-photos item (title, image, price, badge, specs…).' },
    ],
    requiredExample: `<BuyPhotoDetailView photo={DEMO_BUY_PHOTO} />`,
    optionalExample: `<BuyPhotoDetailView photo={photo} />`,
    previewId: 'buy-photo-detail-view',
  },
  {
    id: 'favorite-heart-button',
    name: 'FavoriteHeartButton',
    category: 'data-display',
    summary: 'Toggle heart + vote count without navigating away.',
    path: 'src/components/data-display/FavoriteHeartButton/',
    importExample: "import FavoriteHeartButton from '@/components/data-display/FavoriteHeartButton/FavoriteHeartButton'",
    props: [
      { name: 'initialVotes', type: 'string', required: false, defaultValue: "'0'", description: 'Starting vote count.' },
      { name: 'title', type: 'string', required: false, description: 'For aria-label.' },
    ],
    requiredExample: `<FavoriteHeartButton initialVotes="1,488" title="Golden Hour Silence" />`,
    optionalExample: `<FavoriteHeartButton initialVotes="342" />`,
    previewId: 'favorite-heart-button',
  },
  {
    id: 'member-artwork-stat-card',
    name: 'MemberArtworkStatCard',
    category: 'data-display',
    summary: 'Dashboard stat tile (My Artwork page header row).',
    path: 'src/components/data-display/MemberArtworkStatCard/',
    importExample:
      "import MemberArtworkStatCard from '@/components/data-display/MemberArtworkStatCard/MemberArtworkStatCard'\nimport { DEMO_ARTWORK_STAT } from '@/data/demoData'",
    props: [
      { name: 'labelKey', type: 'string', required: true, description: 'i18n key for label.' },
      { name: 'value', type: 'string', required: true, description: 'Displayed number.' },
      { name: 'icon', type: 'string', required: true, description: 'Icon key: images, camera, layers, book, trophy.' },
      { name: 'iconBg', type: 'string', required: true, description: 'Icon background Tailwind class.' },
      { name: 'iconColor', type: 'string', required: true, description: 'Icon color Tailwind class.' },
    ],
    requiredExample: `<MemberArtworkStatCard {...DEMO_ARTWORK_STAT} />`,
    optionalExample: `<MemberArtworkStatCard labelKey="myArtwork.stats.total" value="8" icon="images" iconBg="bg-[#ede9fe]" iconColor="text-[#7c3aed]" />`,
    previewId: 'member-artwork-stat-card',
  },
  {
    id: 'member-artwork-card-footer',
    name: 'MemberArtworkCardFooter',
    category: 'data-display',
    summary: 'Competition footer slot inside MemberArtworkCard (active / ended / profile).',
    path: 'src/components/data-display/MemberArtworkCardFooter/',
    importExample:
      "import MemberArtworkCardFooter from '@/components/data-display/MemberArtworkCardFooter/MemberArtworkCardFooter'\nimport { DEMO_ARTWORK_ITEM } from '@/data/demoData'",
    props: [
      { name: 'item', type: 'object', required: true, description: 'Artwork with footerState: active | ended | profileOnly.' },
    ],
    requiredExample: `<MemberArtworkCardFooter item={DEMO_ARTWORK_ITEM} />`,
    optionalExample: `<MemberArtworkCardFooter item={DEMO_ARTWORK_ITEM_ENDED} />`,
    previewId: 'member-artwork-card-footer',
    variants: [
      { id: 'active', name: 'Live competition', description: 'Votes, rank, progress bar.' },
      { id: 'ended', name: 'Ended', description: 'Final vote count.' },
      { id: 'profile', name: 'Profile only', description: 'Promote CTA only.' },
    ],
  },
  {
    id: 'member-sell-photo-card',
    name: 'MemberSellPhotoCard',
    category: 'data-display',
    summary: 'Sell-photos grid card (price, expiry, same shell as artwork card).',
    path: 'src/components/data-display/MemberSellPhotoCard/',
    importExample:
      "import MemberSellPhotoCard from '@/components/data-display/MemberSellPhotoCard/MemberSellPhotoCard'\nimport { DEMO_SELL_PHOTO_ITEM } from '@/data/demoData'",
    props: [
      { name: 'item', type: 'object', required: true, description: 'Sell photo item with price, image, stats.' },
      { name: 'badgeLabel', type: 'string', required: true, description: 'Translated album badge.' },
      { name: 'onEdit', type: '(item) => void', required: false, description: 'Menu → Edit.' },
      { name: 'onDelete', type: '(item) => void', required: false, description: 'Menu → Delete.' },
      { name: 'onPromote', type: '(item) => void', required: false, description: 'Menu → Promote.' },
    ],
    requiredExample: `<MemberSellPhotoCard item={DEMO_SELL_PHOTO_ITEM} badgeLabel="Single Photo" />`,
    optionalExample: `<MemberSellPhotoCard item={item} badgeLabel="Single Photo" onEdit={...} />`,
    previewId: 'member-sell-photo-card',
  },
  {
    id: 'member-favourite-photographer-card',
    name: 'MemberFavouritePhotographerCard',
    category: 'data-display',
    summary: 'Favourite photographer card with follow toggle and stats.',
    path: 'src/components/data-display/MemberFavouritePhotographerCard/',
    importExample:
      "import MemberFavouritePhotographerCard from '@/components/data-display/MemberFavouritePhotographerCard/MemberFavouritePhotographerCard'\nimport { DEMO_FAVOURITE_PHOTOGRAPHER } from '@/data/demoData'",
    props: [
      { name: 'photographer', type: 'object', required: true, description: 'name, handle, avatar, specialtyKey, locationKey, quoteKey, followers, artworks, followedDate.' },
      { name: 'defaultFollowing', type: 'boolean', required: false, defaultValue: 'true', description: 'Initial follow state.' },
    ],
    requiredExample: `<MemberFavouritePhotographerCard photographer={DEMO_FAVOURITE_PHOTOGRAPHER} />`,
    optionalExample: `<MemberFavouritePhotographerCard photographer={p} defaultFollowing={false} />`,
    previewId: 'member-favourite-photographer-card',
  },
  {
    id: 'member-promote-panel',
    name: 'MemberPromotePanel',
    category: 'forms',
    summary: 'Promote artwork modal with tier radio selection.',
    path: 'src/components/forms/MemberPromotePanel/',
    importExample:
      "import MemberPromotePanel from '@/components/forms/MemberPromotePanel/MemberPromotePanel'\nimport { DEMO_ARTWORK_ITEM } from '@/data/demoData'",
    props: [
      { name: 'item', type: 'object', required: true, description: 'Artwork being promoted.' },
      { name: 'open', type: 'boolean', required: true, description: 'Visibility.' },
      { name: 'onClose', type: '() => void', required: true, description: 'Close handler.' },
      { name: 'onConfirm', type: '(item, tierId) => void', required: false, description: 'Confirm promote.' },
    ],
    requiredExample: `<MemberPromotePanel item={item} open={open} onClose={() => setOpen(false)} />`,
    optionalExample: `<MemberPromotePanel ... onConfirm={(item, tier) => promote(item, tier)} />`,
    previewId: 'member-promote-panel',
  },
  {
    id: 'photographer-profile-header',
    name: 'PhotographerProfileHeader',
    category: 'data-display',
    summary: 'Public profile header — avatar, follow, message.',
    path: 'src/components/data-display/PhotographerProfileHeader/',
    importExample:
      "import PhotographerProfileHeader from '@/components/data-display/PhotographerProfileHeader/PhotographerProfileHeader'\nimport { DEMO_PHOTOGRAPHER_PROFILE } from '@/data/demoData'",
    props: [
      { name: 'profile', type: 'object', required: true, description: 'name, handle, tagline, location, avatar.' },
    ],
    requiredExample: `<PhotographerProfileHeader profile={DEMO_PHOTOGRAPHER_PROFILE} />`,
    optionalExample: `<PhotographerProfileHeader profile={profile} />`,
    previewId: 'photographer-profile-header',
  },
  {
    id: 'photographer-stats-bar',
    name: 'PhotographerStatsBar',
    category: 'data-display',
    summary: 'Six-stat grid under photographer profile header.',
    path: 'src/components/data-display/PhotographerStatsBar/',
    importExample:
      "import PhotographerStatsBar from '@/components/data-display/PhotographerStatsBar/PhotographerStatsBar'\nimport { DEMO_PHOTOGRAPHER_PROFILE } from '@/data/demoData'",
    props: [
      { name: 'stats', type: 'object', required: true, description: 'followers, following, profileVisitors, totalArtwork, competitionEntries, totalHearts.' },
    ],
    requiredExample: `<PhotographerStatsBar stats={DEMO_PHOTOGRAPHER_PROFILE.stats} />`,
    optionalExample: `<PhotographerStatsBar stats={stats} />`,
    previewId: 'photographer-stats-bar',
  },
  {
    id: 'member-message-card',
    name: 'MemberMessageCard',
    category: 'data-display',
    summary: 'News / message card with image, likes, share.',
    path: 'src/components/data-display/MemberMessageCard/',
    importExample:
      "import MemberMessageCard from '@/components/data-display/MemberMessageCard/MemberMessageCard'\nimport { DEMO_MESSAGE } from '@/data/demoData'",
    props: [
      { name: 'message', type: 'object', required: true, description: 'authorName, authorAvatar, bodyKey, image, likes, postedDate, postedTime.' },
    ],
    requiredExample: `<MemberMessageCard message={DEMO_MESSAGE} />`,
    optionalExample: `<MemberMessageCard message={message} />`,
    previewId: 'member-message-card',
  },
  {
    id: 'member-notification-item',
    name: 'MemberNotificationItem',
    category: 'data-display',
    summary: 'Single notification row (platform or user avatar).',
    path: 'src/components/data-display/MemberNotificationItem/',
    importExample:
      "import MemberNotificationItem from '@/components/data-display/MemberNotificationItem/MemberNotificationItem'\nimport { DEMO_NOTIFICATION } from '@/data/demoData'",
    props: [
      { name: 'item', type: 'object', required: true, description: 'type (platform|user), messageKey, date, avatar?, icon?.' },
    ],
    requiredExample: `<MemberNotificationItem item={DEMO_NOTIFICATION} />`,
    optionalExample: `<MemberNotificationItem item={item} />`,
    previewId: 'member-notification-item',
  },
  {
    id: 'member-profile-cover-header',
    name: 'MemberProfileCoverHeader',
    category: 'data-display',
    summary: 'Member panel profile — cover image + avatar overlap.',
    path: 'src/components/data-display/MemberProfileCoverHeader/',
    importExample:
      "import MemberProfileCoverHeader from '@/components/data-display/MemberProfileCoverHeader/MemberProfileCoverHeader'\nimport { DEMO_MEMBER_PROFILE } from '@/data/demoData'",
    props: [
      { name: 'profile', type: 'object', required: true, description: 'cover, avatar, name, handle, tagline, location.' },
    ],
    requiredExample: `<MemberProfileCoverHeader profile={DEMO_MEMBER_PROFILE} />`,
    optionalExample: `<MemberProfileCoverHeader profile={profile} />`,
    previewId: 'member-profile-cover-header',
  },
  {
    id: 'member-profile-stats-bar',
    name: 'MemberProfileStatsBar',
    category: 'data-display',
    summary: 'Member profile stats row (7 metrics incl. premium photos).',
    path: 'src/components/data-display/MemberProfileStatsBar/',
    importExample:
      "import MemberProfileStatsBar from '@/components/data-display/MemberProfileStatsBar/MemberProfileStatsBar'\nimport { DEMO_MEMBER_PROFILE } from '@/data/demoData'",
    props: [
      { name: 'stats', type: 'object', required: true, description: 'Stats numbers keyed by metric name.' },
    ],
    requiredExample: `<MemberProfileStatsBar stats={DEMO_MEMBER_PROFILE.stats} />`,
    optionalExample: `<MemberProfileStatsBar stats={stats} />`,
    previewId: 'member-profile-stats-bar',
  },
  {
    id: 'admin-page-header',
    name: 'AdminPageHeader',
    category: 'common',
    summary: 'Admin panel page title block — eyebrow, title, description.',
    path: 'src/components/common/AdminPageHeader/',
    importExample: "import AdminPageHeader from '@/components/common/AdminPageHeader/AdminPageHeader'",
    props: [
      { name: 'title', type: 'ReactNode', required: true, description: 'Page heading.' },
      { name: 'eyebrow', type: 'ReactNode', required: false, description: 'Small uppercase label above title.' },
      { name: 'description', type: 'ReactNode', required: false, description: 'Supporting text.' },
      { name: 'as', type: "'header' | 'div'", required: false, description: 'Wrapper element.' },
      { name: 'titleId', type: 'string', required: false, description: 'For aria-labelledby.' },
    ],
    requiredExample: `<AdminPageHeader title="Users" description="Manage platform members." />`,
    optionalExample: `<AdminPageHeader eyebrow="Admin" title="Gallery" description="Review submissions." />`,
    previewId: 'admin-page-header',
  },
  {
    id: 'admin-pagination',
    name: 'AdminPagination',
    category: 'common',
    summary: 'Admin table pagination — users range, numbered pages, submissions style.',
    path: 'src/components/common/AdminPagination/',
    importExample: "import AdminPagination from '@/components/common/AdminPagination/AdminPagination'",
    props: [
      { name: 'variant', type: "'users' | 'submissions' | 'competitions' | …", required: true, description: 'Layout preset.' },
      { name: 'page', type: 'number', required: false, description: 'Current page (numbered variants).' },
      { name: 'totalPages', type: 'number', required: false, description: 'Total pages.' },
      { name: 'onPageChange', type: '(page) => void', required: false, description: 'Page change handler.' },
    ],
    requiredExample: `<AdminPagination
  variant="submissions"
  page={page}
  totalPages={12}
  onPageChange={setPage}
  navAriaLabel="Pagination"
  firstLabel="First"
  prevLabel="Previous"
  nextLabel="Next"
  lastLabel="Last"
  pageLabel={(n) => \`Page \${n}\`}
/>`,
    optionalExample: `<AdminPagination variant="users" from={1} to={10} total={240} ... />`,
    previewId: 'admin-pagination',
    variants: [
      { id: 'submissions', name: 'Numbered pages', description: 'Submissions / competitions style.' },
      { id: 'users', name: 'Users range', description: 'Showing X–Y of Z with prev/next.' },
    ],
  },
  {
    id: 'sign-badge',
    name: 'SignBadge',
    category: 'data-display',
    summary: 'Zodiac sign pill overlaid on a story slide — red or blue accent.',
    path: 'src/components/data-display/SignBadge/',
    importExample:
      "import SignBadge from '@/components/data-display/SignBadge/SignBadge'\nimport { DEMO_SIGN_SLIDE } from '@/data/demoData'",
    props: [
      { name: 'slide', type: 'object', required: true, description: 'Slide with icon, sign and iconBoxed.' },
      { name: 'blue', type: 'boolean', required: false, description: 'Blue accent instead of red.' },
    ],
    requiredExample: `<SignBadge slide={DEMO_SIGN_SLIDE} />`,
    optionalExample: `<SignBadge slide={DEMO_SIGN_SLIDE} blue />`,
    previewId: 'sign-badge',
    variants: [
      { id: 'red', name: 'Red accent', description: 'Default six-story styling.' },
      { id: 'blue', name: 'Blue accent', description: 'Zodiac / six-blue styling.' },
    ],
  },
  {
    id: 'overlay-badge',
    name: 'OverlayBadge',
    category: 'marketing',
    summary: 'Translucent white pill for labels placed over imagery.',
    path: 'src/components/marketing/OverlayBadge/',
    importExample: "import OverlayBadge from '@/components/marketing/OverlayBadge/OverlayBadge'",
    props: [
      { name: 'children', type: 'ReactNode', required: true, description: 'Badge content.' },
      { name: 'className', type: 'string', required: false, description: 'Positioning / spacing overrides.' },
    ],
    requiredExample: `<OverlayBadge>Single Photo</OverlayBadge>`,
    optionalExample: `<OverlayBadge className="absolute left-3 top-3">6 Photos Story</OverlayBadge>`,
    previewId: 'overlay-badge',
  },
  {
    id: 'photo-showcase-page-content',
    name: 'PhotoShowcasePageContent',
    category: 'marketing',
    summary: 'Full showcase page body — search, album filters, photo grid and pagination. Powers Gallery and Buy Photos.',
    path: 'src/components/marketing/PhotoShowcasePageContent/',
    importExample:
      "import PhotoShowcasePageContent from '@/components/marketing/PhotoShowcasePageContent/PhotoShowcasePageContent'",
    props: [
      { name: 'photos', type: 'object[]', required: true, description: 'Photos to list and filter.' },
      { name: 'i18nPrefix', type: 'string', required: true, description: 'Translation namespace, e.g. gallery or buyPhotos.' },
      { name: 'getDetailPath', type: '(photo) => string', required: false, description: 'Builds each card link.' },
      { name: 'activeHref', type: 'string', required: false, description: 'Active nav href.' },
      { name: 'rootClassName', type: 'string', required: false, description: 'Wrapper class overrides.' },
      { name: 'announcementTone', type: "'navy' | string", required: false, defaultValue: "'navy'", description: 'Site announcement tone.' },
      { name: 'newsletterVariant', type: "'page' | string", required: false, defaultValue: "'page'", description: 'Newsletter block variant.' },
    ],
    requiredExample: `<PhotoShowcasePageContent photos={GALLERY_PHOTOS} i18nPrefix="gallery" />`,
    optionalExample: `<PhotoShowcasePageContent
  photos={BUY_PHOTOS}
  i18nPrefix="buyPhotos"
  getDetailPath={buyPhotoDetailPath}
/>`,
    previewId: 'photo-showcase-page-content',
  },
  {
    id: 'community-work',
    name: 'CommunityWork',
    category: 'marketing',
    summary: 'Home section showing community photos with album-type filter pills and a CTA.',
    path: 'src/components/marketing/CommunityWork/',
    importExample: "import CommunityWork from '@/components/marketing/CommunityWork/CommunityWork'",
    props: [],
    requiredExample: `<CommunityWork />`,
    optionalExample: `<CommunityWork />`,
    previewId: 'community-work',
  },
  {
    id: 'member-artwork-actions-menu',
    name: 'MemberArtworkActionsMenu',
    category: 'data-display',
    summary: 'Overflow menu on artwork cards — edit, delete, promote. Closes on outside click and Escape.',
    path: 'src/components/data-display/MemberArtworkActionsMenu/',
    importExample:
      "import MemberArtworkActionsMenu from '@/components/data-display/MemberArtworkActionsMenu/MemberArtworkActionsMenu'\nimport { DEMO_ARTWORK_ITEM } from '@/data/demoData'",
    props: [
      { name: 'item', type: 'object', required: true, description: 'Row passed back to each handler.' },
      { name: 'onEdit', type: '(item) => void', required: false, description: 'Edit handler.' },
      { name: 'onDelete', type: '(item) => void', required: false, description: 'Delete handler.' },
      { name: 'onPromote', type: '(item) => void', required: false, description: 'Promote handler.' },
    ],
    requiredExample: `<MemberArtworkActionsMenu item={DEMO_ARTWORK_ITEM} />`,
    optionalExample: `<MemberArtworkActionsMenu
  item={item}
  onEdit={handleEdit}
  onDelete={handleDelete}
  onPromote={handlePromote}
/>`,
    previewId: 'member-artwork-actions-menu',
  },
  {
    id: 'member-artwork-global-rankings',
    name: 'MemberArtworkGlobalRankings',
    category: 'data-display',
    summary: 'Paginated global leaderboard table for a competition entry, highlighting the current user.',
    path: 'src/components/data-display/MemberArtworkGlobalRankings/',
    importExample:
      "import MemberArtworkGlobalRankings from '@/components/data-display/MemberArtworkGlobalRankings/MemberArtworkGlobalRankings'\nimport { DEMO_RANKINGS } from '@/data/demoData'",
    props: [
      { name: 'rankings', type: 'object[]', required: true, description: 'Rows with rank, name, votes and highlighted.' },
      { name: 'showingCount', type: 'number', required: false, description: 'Rows shown per page.' },
      { name: 'showingTotal', type: 'string', required: false, description: 'Total entrants label, e.g. 24,802.' },
    ],
    requiredExample: `<MemberArtworkGlobalRankings rankings={DEMO_RANKINGS} />`,
    optionalExample: `<MemberArtworkGlobalRankings
  rankings={detail.rankings}
  showingCount={5}
  showingTotal="24,802"
/>`,
    previewId: 'member-artwork-global-rankings',
  },
  {
    id: 'language-switcher',
    name: 'LanguageSwitcher',
    category: 'common',
    summary: 'EN / PL dropdown that persists the choice and updates i18n. Used in the site header and auth pages.',
    path: 'src/components/common/LanguageSwitcher/',
    importExample: "import LanguageSwitcher from '@/components/common/LanguageSwitcher/LanguageSwitcher'",
    props: [
      { name: 'className', type: 'string', required: false, description: 'Wrapper class overrides.' },
    ],
    requiredExample: `<LanguageSwitcher />`,
    optionalExample: `<LanguageSwitcher className="w-full [&_button]:w-full" />`,
    previewId: 'language-switcher',
  },
  {
    id: 'error-boundary',
    name: 'ErrorBoundary',
    category: 'common',
    summary: 'Class boundary that catches render errors and shows a retry / reload screen. Wraps the whole app.',
    path: 'src/components/common/ErrorBoundary/',
    importExample: "import ErrorBoundary from '@/components/common/ErrorBoundary/ErrorBoundary'",
    props: [
      { name: 'children', type: 'ReactNode', required: true, description: 'Subtree to protect.' },
    ],
    requiredExample: `<ErrorBoundary>
  <App />
</ErrorBoundary>`,
    optionalExample: `<ErrorBoundary>
  <RouterProvider router={router} />
</ErrorBoundary>`,
  },
  {
    id: 'scroll-to-top',
    name: 'ScrollToTop',
    category: 'common',
    summary: 'Router layout element that scrolls to the top on every navigation. Renders an Outlet.',
    path: 'src/components/common/ScrollToTop/',
    importExample: "import ScrollToTop from '@/components/common/ScrollToTop/ScrollToTop'",
    props: [],
    requiredExample: `<Route element={<ScrollToTop />}>
  {/* nested routes */}
</Route>`,
    optionalExample: `<Route element={<ScrollToTop />}>{routes}</Route>`,
  },
];

export function getComponentDoc(id) {
  return COMPONENT_DOCS.find((doc) => doc.id === id) || null;
}

export function filterComponentDocs({ category = 'all', query = '' } = {}) {
  const q = query.trim().toLowerCase();
  return COMPONENT_DOCS.filter((doc) => {
    const catOk = category === 'all' || doc.category === category;
    if (!catOk) return false;
    if (!q) return true;
    const hay = [
      doc.name,
      doc.summary,
      doc.path,
      doc.category,
      ...doc.props.map((p) => `${p.name} ${p.description}`),
    ]
      .join(' ')
      .toLowerCase();
    return hay.includes(q);
  });
}
