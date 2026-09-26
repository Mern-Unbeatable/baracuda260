import React, { lazy } from 'react';
import { Route } from 'react-router-dom';
import { ROUTES } from '@/shared/config';

const seg = (route) => route.replace(`${ROUTES.USER}/`, '');

const Dashboard = lazy(() => import('@/portals/member/pages/Dashboard'));
const MyArtwork = lazy(() => import('@/portals/member/pages/MyArtwork'));
const MyArtworkContent = lazy(
  () => import('@/portals/member/views/MyArtworkContent'),
);
const MyArtworkUploadHub = lazy(
  () => import('@/portals/member/pages/my-artwork/MyArtworkUploadHub'),
);
const MyArtworkUploadSingle = lazy(
  () => import('@/portals/member/pages/my-artwork/MyArtworkUploadSingle'),
);
const MyArtworkUploadSix = lazy(
  () => import('@/portals/member/pages/my-artwork/MyArtworkUploadSix'),
);
const MyArtworkUploadZodiac = lazy(
  () => import('@/portals/member/pages/my-artwork/MyArtworkUploadZodiac'),
);
const MyArtworkDetail = lazy(
  () => import('@/portals/member/pages/my-artwork/MyArtworkDetail'),
);
const NewsMessages = lazy(() => import('@/portals/member/pages/NewsMessages'));
const MyMessagesContent = lazy(
  () => import('@/portals/member/views/MyMessagesContent'),
);
const MyMessageUpload = lazy(
  () => import('@/portals/member/pages/news-messages/MyMessageUpload'),
);
const SellPhotos = lazy(() => import('@/portals/member/pages/SellPhotos'));
const SellPhotosContent = lazy(
  () => import('@/portals/member/views/SellPhotosContent'),
);
const SellPhotosUploadHub = lazy(
  () => import('@/portals/member/pages/sell-photos/SellPhotosUploadHub'),
);
const SellPhotosUploadSingle = lazy(
  () => import('@/portals/member/pages/sell-photos/SellPhotosUploadSingle'),
);
const SellPhotosUploadSix = lazy(
  () => import('@/portals/member/pages/sell-photos/SellPhotosUploadSix'),
);
const SellPhotosUploadZodiac = lazy(
  () => import('@/portals/member/pages/sell-photos/SellPhotosUploadZodiac'),
);
const SellPhotosDetail = lazy(
  () => import('@/portals/member/pages/sell-photos/SellPhotosDetail'),
);
const MyStore = lazy(() => import('@/portals/member/pages/MyStore'));
const MyStoreUpload = lazy(
  () => import('@/portals/member/pages/MyStoreUpload'),
);
const FavouritePhotographers = lazy(
  () => import('@/portals/member/pages/FavouritePhotographers'),
);
const PurchasePhotos = lazy(
  () => import('@/portals/member/pages/PurchasePhotos'),
);
const MyOrders = lazy(() => import('@/portals/member/pages/MyOrders'));
const OrderDetails = lazy(() => import('@/portals/member/pages/OrderDetails'));
const Orders = lazy(() => import('@/portals/member/pages/Orders'));
const SellerOrderDetails = lazy(
  () => import('@/portals/member/pages/SellerOrderDetails'),
);
const MyCompetitions = lazy(
  () => import('@/portals/member/pages/MyCompetitions'),
);
const MyCompetitionDetails = lazy(
  () => import('@/portals/member/pages/MyCompetitionDetails'),
);
const Chat = lazy(() => import('@/portals/member/pages/Chat'));
const Notifications = lazy(
  () => import('@/portals/member/pages/Notifications'),
);
const PrizePayments = lazy(
  () => import('@/portals/member/pages/PrizePayments'),
);
const ContactUs = lazy(() => import('@/portals/member/pages/ContactUs'));
const Profile = lazy(() => import('@/portals/member/pages/Profile'));
const ProfileFollowing = lazy(
  () => import('@/portals/member/pages/profile/ProfileFollowing'),
);
const ProfileFollowers = lazy(
  () => import('@/portals/member/pages/profile/ProfileFollowers'),
);
const ProfileSettings = lazy(
  () => import('@/portals/member/pages/profile/ProfileSettings'),
);
const ProfileMainContent = lazy(
  () => import('@/portals/member/views/ProfileMainContent'),
);


const BusinessPhotos = lazy(() => import('@/portals/admin/pages/BusinessPhotos'));
const BusinessLinkDetails = lazy(() => import('@/portals/admin/pages/BusinessLinkDetails'));
const SettingsRoute = lazy(() => import('@/portals/admin/pages/SettingsRoute'));

export const memberRoutes = (
  <>
    <Route path={seg(ROUTES.USER_DASHBOARD)} element={<Dashboard />} />
    <Route path={seg(ROUTES.USER_MY_ARTWORK)} element={<MyArtwork />}>
      <Route index element={<MyArtworkContent />} />
      <Route path="upload" element={<MyArtworkUploadHub />} />
      <Route path="upload/single" element={<MyArtworkUploadSingle />} />
      <Route path="upload/six" element={<MyArtworkUploadSix />} />
      <Route path="upload/zodiac" element={<MyArtworkUploadZodiac />} />
      <Route path=":id" element={<MyArtworkDetail />} />
    </Route>
    <Route path={seg(ROUTES.USER_NEWS_MESSAGES)} element={<NewsMessages />}>
      <Route index element={<MyMessagesContent />} />
      <Route path="upload" element={<MyMessageUpload />} />
    </Route>
    <Route path={seg(ROUTES.USER_SELL_PHOTOS)} element={<SellPhotos />}>
      <Route index element={<SellPhotosContent />} />
      <Route path="upload" element={<SellPhotosUploadHub />} />
      <Route path="upload/single" element={<SellPhotosUploadSingle />} />
      <Route path="upload/six" element={<SellPhotosUploadSix />} />
      <Route path="upload/zodiac" element={<SellPhotosUploadZodiac />} />
      <Route path=":id" element={<SellPhotosDetail />} />
    </Route>
    <Route path={seg(ROUTES.USER_MY_STORE)} element={<MyStore />} />
    <Route
      path={seg(ROUTES.USER_MY_STORE_UPLOAD)}
      element={<MyStoreUpload />}
    />
    <Route path={seg(ROUTES.USER_MY_STORE_EDIT)} element={<MyStoreUpload />} />
    <Route
      path={seg(ROUTES.USER_FAVOURITE_PHOTOGRAPHERS)}
      element={<FavouritePhotographers />}
    />
    <Route
      path={seg(ROUTES.USER_PURCHASE_PHOTOS)}
      element={<PurchasePhotos />}
    />
    <Route path={seg(ROUTES.USER_MY_ORDERS)} element={<MyOrders />} />
    <Route
      path={seg(ROUTES.USER_MY_ORDERS_DETAIL)}
      element={<OrderDetails />}
    />
    <Route path={seg(ROUTES.USER_ORDERS)} element={<Orders />} />
    <Route
      path={seg(ROUTES.USER_ORDERS_DETAIL)}
      element={<SellerOrderDetails />}
    />
    <Route
      path={seg(ROUTES.USER_MY_COMPETITIONS)}
      element={<MyCompetitions />}
    />
    <Route
      path={seg(ROUTES.USER_MY_COMPETITION_DETAIL)}
      element={<MyCompetitionDetails />}
    />
    <Route path={seg(ROUTES.USER_CHAT)} element={<Chat />} />
    <Route path={seg(ROUTES.USER_NOTIFICATIONS)} element={<Notifications />} />
    <Route
      path={seg(ROUTES.USER_PRIZE_PAYMENTS)}
      element={<PrizePayments />}
    />
    <Route path={seg(ROUTES.USER_CONTACT_US)} element={<ContactUs />} />
    <Route path={seg(ROUTES.USER_PROFILE)} element={<Profile />}>
      <Route index element={<ProfileMainContent />} />
      <Route path="following" element={<ProfileFollowing />} />
      <Route path="followers" element={<ProfileFollowers />} />
      <Route path="settings" element={<ProfileSettings />} />
    </Route>
  
    <Route path={seg(ROUTES.USER_BUSINESS_PHOTOS)} element={<BusinessPhotos />} />
    <Route path={seg(ROUTES.USER_BUSINESS_PHOTOS_DETAIL)} element={<BusinessLinkDetails />} />
    <Route path={seg(ROUTES.USER_SETTINGS)} element={<SettingsRoute />} />
  </>
);
