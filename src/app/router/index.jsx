import React, { lazy, Suspense } from 'react';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  Navigate,
} from 'react-router-dom';
import PublicLayout from '@/layouts/PublicLayout';
import AppShellLayout from '@/layouts/AppShellLayout/Layout';
import ScrollToTop from '@/components/common/ScrollToTop/ScrollToTop';
import { ROUTES } from '@/shared/config';
import ProtectedRoute from './guards/ProtectedRoute';
import PageLoader from './ui/PageLoader';
import NotFound from './ui/NotFound';

const seg = (route) => route.replace(`${ROUTES.ADMIN}/`, '');

const Home = lazy(() => import('@/portals/public/home/Home'));
const PublicAlbumTypes = lazy(() => import('@/portals/public/album-types/AlbumTypes'));
const AdvertiseWithUs = lazy(() => import('@/portals/public/advertise-with-us/AdvertiseWithUs'));
const About = lazy(() => import('@/portals/public/about/About'));
const Contact = lazy(() => import('@/portals/public/contact/Contact'));
const Services = lazy(() => import('@/portals/public/services/Services'));
const Competitions = lazy(() => import('@/portals/public/competitions/Competitions'));
const Gallery = lazy(() => import('@/portals/public/gallery/Gallery'));
const BuyPhotos = lazy(() => import('@/portals/public/buy-photos/BuyPhotos'));
const BuyPhotoDetail = lazy(() => import('@/portals/public/buy-photos/detail/BuyPhotoDetail'));
const BuyPhotosCheckout = lazy(() => import('@/portals/public/buy-photos/checkout/BuyPhotosCheckout'));
const BuyPhotosSuccess = lazy(() => import('@/portals/public/buy-photos/success/BuyPhotosSuccess'));
const GalleryDetail = lazy(() => import('@/portals/public/gallery/detail/GalleryDetail'));
const GallerySixDetail = lazy(() => import('@/portals/public/gallery/detail/GallerySixDetail'));
const GallerySixBlueDetail = lazy(() => import('@/portals/public/gallery/detail/GallerySixBlueDetail'));
const GalleryTwelveDetail = lazy(() => import('@/portals/public/gallery/detail/GalleryTwelveDetail'));
const PhotographerProfile = lazy(() => import('@/portals/public/photographer/PhotographerProfile'));
const Leaderboard = lazy(() => import('@/portals/public/leaderboard/Leaderboard'));
const Winners = lazy(() => import('@/portals/public/winners/Winners'));
const WinnerDetail = lazy(() => import('@/portals/public/winners/WinnerDetail'));
const Privacy = lazy(() => import('@/portals/public/legal/privacy/Privacy'));
const Terms = lazy(() => import('@/portals/public/legal/terms/Terms'));
const Cookies = lazy(() => import('@/portals/public/legal/cookies/Cookies'));
const DeveloperPage = lazy(() => import('@/pages/DeveloperPage'));
const Login = lazy(() => import('@/portals/auth/pages/Login'));
const SignUp = lazy(() => import('@/portals/auth/pages/SignUp'));

const Dashboard = lazy(() => import('@/portals/member/pages/Dashboard'));
const MyArtwork = lazy(() => import('@/portals/member/pages/MyArtwork'));
const MyArtworkContent = lazy(() => import('@/portals/member/views/MyArtworkContent'));
const MyArtworkUploadHub = lazy(() => import('@/portals/member/pages/my-artwork/MyArtworkUploadHub'));
const MyArtworkUploadSingle = lazy(() => import('@/portals/member/pages/my-artwork/MyArtworkUploadSingle'));
const MyArtworkUploadSix = lazy(() => import('@/portals/member/pages/my-artwork/MyArtworkUploadSix'));
const MyArtworkUploadZodiac = lazy(() => import('@/portals/member/pages/my-artwork/MyArtworkUploadZodiac'));
const MyArtworkDetail = lazy(() => import('@/portals/member/pages/my-artwork/MyArtworkDetail'));
const NewsMessages = lazy(() => import('@/portals/member/pages/NewsMessages'));
const MyMessagesContent = lazy(() => import('@/portals/member/views/MyMessagesContent'));
const MyMessageUpload = lazy(() => import('@/portals/member/pages/news-messages/MyMessageUpload'));
const SellPhotos = lazy(() => import('@/portals/member/pages/SellPhotos'));
const SellPhotosContent = lazy(() => import('@/portals/member/views/SellPhotosContent'));
const SellPhotosUploadHub = lazy(() => import('@/portals/member/pages/sell-photos/SellPhotosUploadHub'));
const SellPhotosUploadSingle = lazy(() => import('@/portals/member/pages/sell-photos/SellPhotosUploadSingle'));
const SellPhotosUploadSix = lazy(() => import('@/portals/member/pages/sell-photos/SellPhotosUploadSix'));
const SellPhotosUploadZodiac = lazy(() => import('@/portals/member/pages/sell-photos/SellPhotosUploadZodiac'));
const SellPhotosDetail = lazy(() => import('@/portals/member/pages/sell-photos/SellPhotosDetail'));
const FavouritePhotographers = lazy(() => import('@/portals/member/pages/FavouritePhotographers'));
const MyCompetitions = lazy(() => import('@/portals/member/pages/MyCompetitions'));
const MyCompetitionDetails = lazy(() => import('@/portals/member/pages/MyCompetitionDetails'));
const AdminGallery = lazy(() => import('@/portals/admin/pages/Gallery'));
const AdminGalleryDetail = lazy(() => import('@/portals/admin/pages/GalleryDetail'));
const PremiumPhotos = lazy(() => import('@/portals/admin/pages/PremiumPhotos'));
const PremiumPhotosDetail = lazy(() => import('@/portals/admin/pages/PremiumPhotosDetail'));
const PromotedProducts = lazy(() => import('@/portals/admin/pages/PromotedProducts'));
// const Submissions = lazy(() => import('@/portals/admin/pages/Submissions'));
const Users = lazy(() => import('@/portals/admin/pages/Users'));
const Categories = lazy(() => import('@/portals/admin/pages/Categories'));
const AlbumTypes = lazy(() => import('@/portals/admin/pages/AlbumTypes'));
const AdminWinners = lazy(() => import('@/portals/admin/pages/Winners'));
const AdminPayouts = lazy(() => import('@/portals/admin/pages/Payouts'));
const AdminSupport = lazy(() => import('@/portals/admin/pages/Support'));
const BusinessPhotos = lazy(() => import('@/portals/admin/pages/BusinessPhotos'));
const BusinessLinkDetails = lazy(() => import('@/portals/admin/pages/BusinessLinkDetails'));
const AdminNewsletter = lazy(() => import('@/portals/admin/pages/Newsletter'));
const AdminComment = lazy(() => import('@/portals/admin/pages/Comment'));
const AdsManagement = lazy(() => import('@/portals/admin/pages/AdsManagement'));
const Reports = lazy(() => import('@/portals/admin/pages/Reports'));
const ReportDetail = lazy(() => import('@/portals/admin/pages/ReportDetail'));
const DemoProfiles = lazy(() => import('@/portals/admin/pages/DemoProfiles'));
const DemoProfilesCreate = lazy(() => import('@/portals/admin/pages/DemoProfilesCreate'));
const Chat = lazy(() => import('@/portals/member/pages/Chat'));
const Notifications = lazy(() => import('@/portals/member/pages/Notifications'));
const PrizePayments = lazy(() => import('@/portals/member/pages/PrizePayments'));
const ContactUs = lazy(() => import('@/portals/member/pages/ContactUs'));
const Profile = lazy(() => import('@/portals/member/pages/Profile'));
const ProfileFollowing = lazy(() => import('@/portals/member/pages/profile/ProfileFollowing'));
const ProfileFollowers = lazy(() => import('@/portals/member/pages/profile/ProfileFollowers'));
const ProfileSettings = lazy(() => import('@/portals/member/pages/profile/ProfileSettings'));
const ProfileMainContent = lazy(() => import('@/portals/member/views/ProfileMainContent'));
const SettingsRoute = lazy(() => import('@/portals/admin/pages/SettingsRoute'));

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<ScrollToTop />}>
      <Route
        element={
          <Suspense fallback={<PageLoader />}>
            <PublicLayout />
          </Suspense>
        }
      >
        <Route path={ROUTES.HOME} element={<Home />} />
        <Route path={ROUTES.ABOUT} element={<About />} />
        <Route path={ROUTES.SERVICES} element={<Services />} />
        <Route path={ROUTES.CONTACT} element={<Contact />} />
        <Route path={ROUTES.COMPETITIONS} element={<Competitions />} />
        <Route path={ROUTES.GALLERY} element={<Gallery />} />
        <Route path={ROUTES.ALBUM_TYPES} element={<PublicAlbumTypes />} />
        <Route path={ROUTES.ADVERTISE_WITH_US} element={<AdvertiseWithUs />} />
        <Route path={ROUTES.BUY_PHOTOS} element={<BuyPhotos />} />
        <Route path={ROUTES.BUY_PHOTOS_CHECKOUT} element={<BuyPhotosCheckout />} />
        <Route path={ROUTES.BUY_PHOTOS_SUCCESS} element={<BuyPhotosSuccess />} />
        <Route path={ROUTES.BUY_PHOTOS_DETAIL} element={<BuyPhotoDetail />} />
        <Route path={ROUTES.GALLERY_SIX_DETAIL} element={<GallerySixDetail />} />
        <Route path={ROUTES.GALLERY_SIX_BLUE_DETAIL} element={<GallerySixBlueDetail />} />
        <Route path={ROUTES.GALLERY_TWELVE_DETAIL} element={<GalleryTwelveDetail />} />
        <Route path={ROUTES.GALLERY_DETAIL} element={<GalleryDetail />} />
        <Route path={ROUTES.PHOTOGRAPHER_PROFILE} element={<PhotographerProfile />} />
        <Route path={ROUTES.LEADERBOARD} element={<Leaderboard />} />
        <Route path={ROUTES.WINNERS} element={<Winners />} />
        <Route path={ROUTES.WINNERS_DETAIL} element={<WinnerDetail />} />
        <Route path={ROUTES.PRIVACY} element={<Privacy />} />
        <Route path={ROUTES.TERMS} element={<Terms />} />
        <Route path={ROUTES.COOKIES} element={<Cookies />} />
      </Route>

      <Route
        path={ROUTES.LOGIN}
        element={
          <Suspense fallback={<PageLoader />}>
            <Login />
          </Suspense>
        }
      />

      <Route
        path={ROUTES.SIGNUP}
        element={
          <Suspense fallback={<PageLoader />}>
            <SignUp />
          </Suspense>
        }
      />

      <Route
        path={ROUTES.DEVELOPER}
        element={
          <Suspense fallback={<PageLoader />}>
            <DeveloperPage />
          </Suspense>
        }
      />
      <Route
        path={ROUTES.DEVELOPER_COMPONENT}
        element={
          <Suspense fallback={<PageLoader />}>
            <DeveloperPage />
          </Suspense>
        }
      />

      <Route
        path={ROUTES.ADMIN}
        element={
          <Suspense fallback={<PageLoader />}>
            <ProtectedRoute>
              <AppShellLayout />
            </ProtectedRoute>
          </Suspense>
        }
      >
        <Route index element={<Navigate to={ROUTES.ADMIN_DASHBOARD} replace />} />
        <Route path={seg(ROUTES.ADMIN_DASHBOARD)} element={<Dashboard />} />
        <Route path={seg(ROUTES.ADMIN_MY_ARTWORK)} element={<MyArtwork />}>
          <Route index element={<MyArtworkContent />} />
          <Route path="upload" element={<MyArtworkUploadHub />} />
          <Route path="upload/single" element={<MyArtworkUploadSingle />} />
          <Route path="upload/six" element={<MyArtworkUploadSix />} />
          <Route path="upload/zodiac" element={<MyArtworkUploadZodiac />} />
          <Route path=":id" element={<MyArtworkDetail />} />
        </Route>
        <Route path={seg(ROUTES.ADMIN_NEWS_MESSAGES)} element={<NewsMessages />}>
          <Route index element={<MyMessagesContent />} />
          <Route path="upload" element={<MyMessageUpload />} />
        </Route>
        <Route path={seg(ROUTES.ADMIN_SELL_PHOTOS)} element={<SellPhotos />}>
          <Route index element={<SellPhotosContent />} />
          <Route path="upload" element={<SellPhotosUploadHub />} />
          <Route path="upload/single" element={<SellPhotosUploadSingle />} />
          <Route path="upload/six" element={<SellPhotosUploadSix />} />
          <Route path="upload/zodiac" element={<SellPhotosUploadZodiac />} />
          <Route path=":id" element={<SellPhotosDetail />} />
        </Route>
        <Route path={seg(ROUTES.ADMIN_FAVOURITE_PHOTOGRAPHERS)} element={<FavouritePhotographers />} />
        <Route
          path={seg(ROUTES.ADMIN_UPLOAD_PHOTOS)}
          element={<Navigate to={ROUTES.ADMIN_MY_ARTWORK_UPLOAD} replace />}
        />
        <Route
          path={seg(ROUTES.ADMIN_UPLOAD_SINGLE)}
          element={<Navigate to={ROUTES.ADMIN_MY_ARTWORK_UPLOAD_SINGLE} replace />}
        />
        <Route
          path={seg(ROUTES.ADMIN_UPLOAD_SIX)}
          element={<Navigate to={ROUTES.ADMIN_MY_ARTWORK_UPLOAD_SIX} replace />}
        />
        <Route
          path={seg(ROUTES.ADMIN_UPLOAD_ZODIAC12)}
          element={<Navigate to={ROUTES.ADMIN_MY_ARTWORK_UPLOAD_ZODIAC12} replace />}
        />
        <Route path={seg(ROUTES.ADMIN_MY_COMPETITIONS)} element={<MyCompetitions />} />
        <Route path={seg(ROUTES.ADMIN_MY_COMPETITION_DETAIL)} element={<MyCompetitionDetails />} />
        <Route path={seg(ROUTES.ADMIN_GALLERY)} element={<AdminGallery />} />
        <Route path={seg(ROUTES.ADMIN_GALLERY_DETAIL)} element={<AdminGalleryDetail />} />
        <Route path={seg(ROUTES.ADMIN_PREMIUM_PHOTOS)} element={<PremiumPhotos />} />
        <Route path={seg(ROUTES.ADMIN_PREMIUM_PHOTOS_DETAIL)} element={<PremiumPhotosDetail />} />
        <Route path={seg(ROUTES.ADMIN_PROMOTED_PRODUCTS)} element={<PromotedProducts />} />
        <Route path={seg(ROUTES.ADMIN_PROMOTED_PRODUCTS_DETAIL)} element={<PromotedProducts />} />
        {/* <Route path={seg(ROUTES.ADMIN_SUBMISSIONS)} element={<Submissions />} /> */}
        <Route path={seg(ROUTES.ADMIN_USERS)} element={<Users />} />
        <Route path={seg(ROUTES.ADMIN_CATEGORIES)} element={<Categories />} />
        <Route path={seg(ROUTES.ADMIN_ALBUM_TYPES)} element={<AlbumTypes />} />
        <Route path={seg(ROUTES.ADMIN_WINNERS)} element={<AdminWinners />} />
        <Route path={seg(ROUTES.ADMIN_PAYOUTS)} element={<AdminPayouts />} />
        <Route path={seg(ROUTES.ADMIN_SUPPORT)} element={<AdminSupport />} />
        <Route path={seg(ROUTES.ADMIN_BUSINESS_PHOTOS)} element={<BusinessPhotos />} />
        <Route path={seg(ROUTES.ADMIN_BUSINESS_PHOTOS_DETAIL)} element={<BusinessLinkDetails />} />
        <Route path={seg(ROUTES.ADMIN_CHAT)} element={<Chat />} />
        <Route path={seg(ROUTES.ADMIN_NOTIFICATIONS)} element={<Notifications />} />
        <Route path={seg(ROUTES.ADMIN_PRIZE_PAYMENTS)} element={<PrizePayments />} />
        <Route path={seg(ROUTES.ADMIN_CONTACT_US)} element={<ContactUs />} />
        <Route path={seg(ROUTES.ADMIN_PROFILE)} element={<Profile />}>
          <Route index element={<ProfileMainContent />} />
          <Route path="following" element={<ProfileFollowing />} />
          <Route path="followers" element={<ProfileFollowers />} />
          <Route path="settings" element={<ProfileSettings />} />
        </Route>
        <Route path={seg(ROUTES.ADMIN_SETTINGS)} element={<SettingsRoute />} />
        <Route path={seg(ROUTES.ADMIN_NEWSLETTER)} element={<AdminNewsletter />} />
        <Route path={seg(ROUTES.ADMIN_COMMENT)} element={<AdminComment />} />
        <Route path={seg(ROUTES.ADMIN_ADS)} element={<AdsManagement />} />
        <Route path={seg(ROUTES.ADMIN_DEMO_PROFILES)} element={<DemoProfiles />} />
        <Route path={seg(ROUTES.ADMIN_DEMO_PROFILES_CREATE)} element={<DemoProfilesCreate />} />
        <Route path={seg(ROUTES.ADMIN_REPORTS)} element={<Reports />} />
        <Route path={seg(ROUTES.ADMIN_REPORTS_DETAIL)} element={<ReportDetail />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Route>,
  ),
);

export default router;
