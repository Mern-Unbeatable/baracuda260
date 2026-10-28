# User Dashboard (`/user/*`) Integration & Dummy Data Audit Report

> **Generated on:** October 28, 2026  
> **Repository:** `Mern-Unbeatable/baracuda260`  
> **Scope:** Member Portal (`src/portals/member/`) & User Routes (`/user/*`)

---

## 📊 Executive Summary

| Category | Count | Percentage | Description |
| :--- | :---: | :---: | :--- |
| **Total Member Portal Pages / Routes** | **35** | 100% | All routes defined under `/user/*` |
| 🟢 **Fully Integrated with API** | **24** | **68.6%** | Complete end-to-end API integration (GET, POST, PUT, DELETE, PayPal) |
| 🟡 **Partially Integrated** | **2** | **5.7%** | Base data / Admin flow integrated; sub-views or inner tabs use mock data |
| 🔴 **Using Dummy / Mock Data** | **9** | **25.7%** | Relying entirely on local dummy constants or simulated timeouts |

---

## 📈 Quick Breakdown by Status

```
[█████████████████████████████████████████░░░░░░░░░░░░░░░░░] 68.6% Fully Integrated (24)
[███░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░]  5.7% Partially Integrated (2)
[███████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░] 25.7% Dummy Data (9)
```

---

## 📋 Comprehensive Status Table

| # | Route | Page / View Name | Status | Backend Endpoints Used | Mock Data / Missing Requirements |
| :-: | :--- | :--- | :---: | :--- | :--- |
| **1** | `/user/dashboard` | [DashboardContent](file:///home/mehedi/dev/baracuda260/src/portals/member/views/DashboardContent.jsx) | 🟢 **Fully Integrated** | `GET /v1/user/dashboard` | None |
| **2** | `/user/my-artwork` | [MyArtworkContent](file:///home/mehedi/dev/baracuda260/src/portals/member/views/MyArtworkContent.jsx) | 🟢 **Fully Integrated** | `GET /v1/artworks`<br>`DELETE /v1/artworks/:id`<br>`POST /v1/artworks/promote`<br>`POST /v1/artworks/promote/capture` | None |
| **3** | `/user/my-artwork/:id` | [MemberArtworkDetailContent](file:///home/mehedi/dev/baracuda260/src/portals/member/views/MemberArtworkDetailContent.jsx) | 🟢 **Fully Integrated** | `GET /v1/artworks/:id`<br>`DELETE /v1/artworks/:id` | None |
| **4** | `/user/my-artwork/upload` | [MyArtworkUploadHub](file:///home/mehedi/dev/baracuda260/src/portals/member/pages/my-artwork/MyArtworkUploadHub.jsx) | 🟢 **Fully Integrated** | UI format selector (Single / Six / Zodiac) | Static navigation hub |
| **5** | `/user/my-artwork/upload/single` | [SinglePhotoContent](file:///home/mehedi/dev/baracuda260/src/portals/member/views/SinglePhotoContent.jsx) | 🟢 **Fully Integrated** | `GET /v1/categories`<br>`POST /v1/artworks`<br>`PUT /v1/artworks/:id` | None |
| **6** | `/user/my-artwork/upload/six` | [SixPhotoContent](file:///home/mehedi/dev/baracuda260/src/portals/member/views/SixPhotoContent.jsx) | 🟢 **Fully Integrated** | `GET /v1/categories`<br>`POST /v1/artworks`<br>`PUT /v1/artworks/:id` | None |
| **7** | `/user/my-artwork/upload/zodiac` | [Zodiac12Content](file:///home/mehedi/dev/baracuda260/src/portals/member/views/Zodiac12Content.jsx) | 🟢 **Fully Integrated** | `GET /v1/categories`<br>`POST /v1/artworks`<br>`PUT /v1/artworks/:id` | None |
| **8** | `/user/news-messages` | [MyMessagesContent](file:///home/mehedi/dev/baracuda260/src/portals/member/views/MyMessagesContent.jsx) | 🟢 **Fully Integrated** | `GET /v1/posts`<br>`DELETE /v1/posts/:id`<br>`PUT /v1/posts/:id` | None |
| **9** | `/user/news-messages/upload` | [MyMessageUploadContent](file:///home/mehedi/dev/baracuda260/src/portals/member/views/MyMessageUploadContent.jsx) | 🟢 **Fully Integrated** | `POST /v1/posts`<br>`PUT /v1/posts/:id` | None |
| **10** | `/user/sell-photos` | [SellPhotosContent](file:///home/mehedi/dev/baracuda260/src/portals/member/views/SellPhotosContent.jsx) | 🟢 **Fully Integrated** | `GET /v1/marketplace/premium-photos`<br>`DELETE /v1/marketplace/premium-photos/:id`<br>`POST /v1/marketplace/premium-photos/promote`<br>`POST /v1/marketplace/premium-photos/promote/capture` | None |
| **11** | `/user/sell-photos/:id` | [MemberSellPhotoDetailContent](file:///home/mehedi/dev/baracuda260/src/portals/member/views/MemberSellPhotoDetailContent.jsx) | 🟢 **Fully Integrated** | `GET /v1/marketplace/premium-photos/:id`<br>`DELETE /v1/marketplace/premium-photos/:id` | None |
| **12** | `/user/sell-photos/upload` | [SellPhotosUploadHub](file:///home/mehedi/dev/baracuda260/src/portals/member/pages/sell-photos/SellPhotosUploadHub.jsx) | 🟢 **Fully Integrated** | UI format selector (Single / Six / Zodiac) | Static navigation hub |
| **13** | `/user/sell-photos/upload/single` | [SinglePhotoContent](file:///home/mehedi/dev/baracuda260/src/portals/member/views/SinglePhotoContent.jsx) *(Sell Preset)* | 🟢 **Fully Integrated** | `POST /v1/marketplace/premium-photos`<br>`PUT /v1/marketplace/premium-photos/:id` | None |
| **14** | `/user/sell-photos/upload/six` | [SixPhotoContent](file:///home/mehedi/dev/baracuda260/src/portals/member/views/SixPhotoContent.jsx) *(Sell Preset)* | 🟢 **Fully Integrated** | `POST /v1/marketplace/premium-photos`<br>`PUT /v1/marketplace/premium-photos/:id` | None |
| **15** | `/user/sell-photos/upload/zodiac` | [Zodiac12Content](file:///home/mehedi/dev/baracuda260/src/portals/member/views/Zodiac12Content.jsx) *(Sell Preset)* | 🟢 **Fully Integrated** | `POST /v1/marketplace/premium-photos`<br>`PUT /v1/marketplace/premium-photos/:id` | None |
| **16** | `/user/my-store` | [MyStoreContent](file:///home/mehedi/dev/baracuda260/src/portals/member/views/MyStoreContent.jsx) | 🔴 **Dummy Data** | *None* | Uses `MY_STORE_PRODUCTS` from `myStoreData.js` |
| **17** | `/user/my-store/upload` & `.../:id/edit` | [MyStoreUploadContent](file:///home/mehedi/dev/baracuda260/src/portals/member/views/MyStoreUploadContent.jsx) | 🔴 **Dummy Data** | *None* | Simulated client timeout; uses `EMPTY_STORE_UPLOAD_FORM` |
| **18** | `/user/favourite-photographers` | [FavouritePhotographersContent](file:///home/mehedi/dev/baracuda260/src/portals/member/views/FavouritePhotographersContent.jsx) | 🟢 **Fully Integrated** | `GET /v1/users/profile/following`<br>`POST /v1/users/profile/:username/follow` | None |
| **19** | `/user/favourite-photos` | [FavouritePhotosContent](file:///home/mehedi/dev/baracuda260/src/portals/member/views/FavouritePhotosContent.jsx) | 🔴 **Dummy Data** | *None* | Uses `FAVOURITE_PHOTOS` from `favouritePhotosData.js` |
| **20** | `/user/purchase-photos` | [PurchasePhotosContent](file:///home/mehedi/dev/baracuda260/src/portals/member/views/PurchasePhotosContent.jsx) | 🟢 **Fully Integrated** | `GET /v1/marketplace/my-purchases/stats`<br>`GET /v1/marketplace/my-purchases` | None |
| **21** | `/user/my-orders` | [MyOrdersContent](file:///home/mehedi/dev/baracuda260/src/portals/member/views/MyOrdersContent.jsx) | 🟢 **Fully Integrated** | `GET /v1/orders/buyer` | None |
| **22** | `/user/my-orders/:id` | [OrderDetailsContent](file:///home/mehedi/dev/baracuda260/src/portals/member/views/OrderDetailsContent.jsx) | 🟢 **Fully Integrated** | `GET /v1/orders/buyer/:id` | None |
| **23** | `/user/orders` | [OrdersContent](file:///home/mehedi/dev/baracuda260/src/portals/member/views/OrdersContent.jsx) | 🟢 **Fully Integrated** | `GET /v1/orders/seller`<br>`GET /v1/orders/seller/status-cards`<br>`PUT /v1/orders/seller/:id/status` | None |
| **24** | `/user/orders/:id` | [SellerOrderDetailsContent](file:///home/mehedi/dev/baracuda260/src/portals/member/views/SellerOrderDetailsContent.jsx) | 🟢 **Fully Integrated** | `GET /v1/orders/seller/:id`<br>`PUT /v1/orders/seller/:id/status` | None |
| **25** | `/user/my-competitions` | [MyCompetitions](file:///home/mehedi/dev/baracuda260/src/portals/member/pages/MyCompetitions.jsx) | 🟡 **Partially Integrated** | `GET /v1/artworks` *(Admin only)* | Non-admin users are redirected to `/user/dashboard`. Member-specific competition entries endpoint pending. |
| **26** | `/user/chat` | [MemberChatContent](file:///home/mehedi/dev/baracuda260/src/portals/member/views/MemberChatContent.jsx) | 🔴 **Dummy Data** | *None* | Uses `CHAT_CONVERSATIONS` & local simulated messaging state |
| **27** | `/user/notifications` | [NotificationsContent](file:///home/mehedi/dev/baracuda260/src/portals/member/views/NotificationsContent.jsx) | 🔴 **Dummy Data** | *None* | Uses `MEMBER_NOTIFICATIONS` from `memberNotificationsData.js` |
| **28** | `/user/prize-payments` | [PrizePaymentsContent](file:///home/mehedi/dev/baracuda260/src/portals/member/views/PrizePaymentsContent.jsx) | 🔴 **Dummy Data** | *None* | Uses `PRIZING_ROWS`, `DONATION_TRANSACTION_ROWS`, `PHOTO_SALES_ROWS`, `PAYMENT_HISTORY_ROWS` |
| **29** | `/user/contact-us` | [ContactSupportContent](file:///home/mehedi/dev/baracuda260/src/portals/member/views/ContactSupportContent.jsx) | 🟢 **Fully Integrated** | `POST /v1/support/tickets`<br>`GET /v1/support/tickets/my` | None |
| **30** | `/user/profile` | [ProfileMainContent](file:///home/mehedi/dev/baracuda260/src/portals/member/views/ProfileMainContent.jsx) | 🟡 **Partially Integrated** | `GET /v1/user/profile/me` | User info, avatar, cover & stats are API-driven; sub-tabs (Artwork grid, Store, Premium, Posts) use mock arrays (`MEMBER_ARTWORK`, `MEMBER_PREMIUM`, etc.) |
| **31** | `/user/profile/following` | [ProfileFollowing](file:///home/mehedi/dev/baracuda260/src/portals/member/pages/profile/ProfileFollowing.jsx) | 🔴 **Dummy Data** | *None* | Uses `PROFILE_FOLLOWING` mock data *(Note: `/user/favourite-photographers` has real API)* |
| **32** | `/user/profile/followers` | [ProfileFollowers](file:///home/mehedi/dev/baracuda260/src/portals/member/pages/profile/ProfileFollowers.jsx) | 🔴 **Dummy Data** | *None* | Uses `PROFILE_FOLLOWERS` mock data |
| **33** | `/user/profile/settings` | [ProfileContent](file:///home/mehedi/dev/baracuda260/src/portals/member/views/ProfileContent.jsx) | 🟢 **Fully Integrated** | `GET /v1/user/profile/me`<br>`PUT /v1/user/profile/me`<br>`POST /v1/auth/change-password` | None |
| **34** | `/user/business-photos` | [BusinessLinkContent](file:///home/mehedi/dev/baracuda260/src/portals/member/views/BusinessLinkContent.jsx) | 🟢 **Fully Integrated** | `POST /v1/business-links` | None |
| **35** | `/user/settings` | [SettingsContent](file:///home/mehedi/dev/baracuda260/src/portals/member/views/SettingsContent.jsx) | 🟢 **Fully Integrated** | `GET /v1/user/profile/me`<br>`PUT /v1/user/profile/me`<br>`POST /v1/auth/change-password` | None |

---

## 🔍 Detailed Analysis of the 9 Dummy Data Pages

Here is the exact state and backend requirement for each of the 9 pages still using mock data:

### 1. `/user/my-store`
- **File:** [MyStoreContent.jsx](file:///home/mehedi/dev/baracuda260/src/portals/member/views/MyStoreContent.jsx)
- **Current Mock Source:** `MY_STORE_PRODUCTS` in `src/portals/member/data/myStoreData.js`
- **What's Needed from Backend:**
  - `GET /v1/store/products?seller={userId}` (returns user's listed physical/store merchandise).
  - `DELETE /v1/store/products/:id`

### 2. `/user/my-store/upload` & `/user/my-store/:id/edit`
- **File:** [MyStoreUploadContent.jsx](file:///home/mehedi/dev/baracuda260/src/portals/member/views/MyStoreUploadContent.jsx)
- **Current Mock Source:** Simulated 700ms `setTimeout` with dummy form defaults
- **What's Needed from Backend:**
  - `POST /v1/store/products` (multipart form data with banner and gallery images)
  - `GET /v1/store/products/:id` (fetch product for editing)
  - `PUT /v1/store/products/:id`

### 3. `/user/favourite-photos`
- **File:** [FavouritePhotosContent.jsx](file:///home/mehedi/dev/baracuda260/src/portals/member/views/FavouritePhotosContent.jsx)
- **Current Mock Source:** `FAVOURITE_PHOTOS` in `src/portals/member/data/favouritePhotosData.js`
- **What's Needed from Backend:**
  - `GET /v1/users/favorites/photos` (paginated list of photos saved/bookmarked by the logged-in user).
  - `POST /v1/users/favorites/photos/:id` (toggle bookmark).

### 4. `/user/chat`
- **File:** [MemberChatContent.jsx](file:///home/mehedi/dev/baracuda260/src/portals/member/views/MemberChatContent.jsx)
- **Current Mock Source:** `CHAT_CONVERSATIONS` & `getChatMessages` in `src/portals/member/data/chatMessagesData.js`
- **What's Needed from Backend:**
  - WebSocket or REST API: `GET /v1/chat/conversations`, `GET /v1/chat/conversations/:id/messages`, `POST /v1/chat/messages`.

### 5. `/user/notifications`
- **File:** [NotificationsContent.jsx](file:///home/mehedi/dev/baracuda260/src/portals/member/views/NotificationsContent.jsx)
- **Current Mock Source:** `MEMBER_NOTIFICATIONS` in `src/portals/member/data/memberNotificationsData.js`
- **What's Needed from Backend:**
  - `GET /v1/notifications` (user activity notifications: likes, comments, sales, system updates).
  - `PATCH /v1/notifications/:id/read`

### 6. `/user/prize-payments`
- **File:** [PrizePaymentsContent.jsx](file:///home/mehedi/dev/baracuda260/src/portals/member/views/PrizePaymentsContent.jsx)
- **Current Mock Source:** `PRIZING_ROWS`, `DONATION_TRANSACTION_ROWS`, `PHOTO_SALES_ROWS`, `PAYMENT_HISTORY_ROWS` in `src/portals/member/data/prizePaymentsData.js`
- **What's Needed from Backend:**
  - `GET /v1/payments/earnings` (summary totals for prize money, donations, photo sales)
  - `GET /v1/payments/prizing`
  - `GET /v1/payments/donations`
  - `GET /v1/payments/history`
  - `POST /v1/payments/request-payout`

### 7. `/user/profile/following`
- **File:** [ProfileFollowing.jsx](file:///home/mehedi/dev/baracuda260/src/portals/member/pages/profile/ProfileFollowing.jsx)
- **Current Mock Source:** `PROFILE_FOLLOWING` in `src/portals/member/data/profileConnectionsData.js`
- **Note:** The API hook `useUserFollowing` (`GET /v1/users/profile/following`) is already built and working on `/user/favourite-photographers`. Connecting this sub-route to that existing hook will convert it immediately to Fully Integrated.

### 8. `/user/profile/followers`
- **File:** [ProfileFollowers.jsx](file:///home/mehedi/dev/baracuda260/src/portals/member/pages/profile/ProfileFollowers.jsx)
- **Current Mock Source:** `PROFILE_FOLLOWERS` in `src/portals/member/data/profileConnectionsData.js`
- **What's Needed from Backend:**
  - `GET /v1/users/profile/followers` (returns list of users following the current user).

### 9. `/user/business-photos/:id`
- **File:** [BusinessLinkDetails.jsx](file:///home/mehedi/dev/baracuda260/src/portals/admin/pages/BusinessLinkDetails.jsx)
- **Current Mock Source:** Only rendered in admin mode; regular user has no member-specific view.
- **What's Needed from Backend:**
  - `GET /v1/business-links/:id` for user view if regular users are allowed to review their submitted portfolio.
