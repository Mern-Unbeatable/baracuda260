import { GALLERY_PHOTOS } from '@/shared/data/galleryPhotos';

const BUY_PHOTO_PRICES = {
  'Single Photo': '$2.00',
  '6 Photos Story': '$5.00',
  '12 photos - full Zodiac Story': '$5.00',
};

export const BUY_PHOTO_LICENSE = 'Standard Commercial';

export const BUY_PHOTO_DEFAULT_SPECS = {
  resolution: '6000 × 4000 px',
  format: 'JPG, RAW',
  camera: 'Sony A7R IV',
};

export const LAST_BUY_PURCHASE_KEY = 'buyPhotos.lastPurchase';

const BUY_PHOTO_PRICES_NUMERIC = {
  'Single Photo': 2,
  '6 Photos Story': 5,
  '12 photos - full Zodiac Story': 5,
};

export const parseBuyPhotoPrice = (priceLabel) => {
  const parsed = Number(String(priceLabel ?? '').replace(/[^0-9.]/g, ''));
  return Number.isFinite(parsed) ? parsed : 0;
};

export const formatBuyPhotoPrice = (amount) =>
  `$${Number(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export const BUY_PHOTOS = GALLERY_PHOTOS.map((photo) => ({
  ...photo,
  price: BUY_PHOTO_PRICES[photo.badge] ?? '$2.00',
  priceAmount: BUY_PHOTO_PRICES_NUMERIC[photo.badge] ?? 2,
  ...BUY_PHOTO_DEFAULT_SPECS,
}));

export const getBuyPhotoById = (id) =>
  BUY_PHOTOS.find((photo) => photo.id === id) || null;

export const buyPhotoDetailPath = (id) => `/buy-photos/${id}`;

export const toBuyPhotoCartItem = (photo) => ({
  id: photo.id,
  title: photo.title,
  image: photo.image,
  photographer: photo.photographer,
  price: photo.priceAmount ?? parseBuyPhotoPrice(photo.price),
  priceLabel: photo.price,
});

export const createBuyPurchaseRecord = ({ photo, buyerName, buyerEmail }) => ({
  id: `TXN-${Math.random().toString(36).slice(2, 6).toUpperCase()}-${Math.random().toString(36).slice(2, 5).toUpperCase()}`,
  photoId: photo.id,
  title: photo.title,
  image: photo.image,
  photographer: photo.photographer,
  price: photo.price,
  priceAmount: photo.priceAmount ?? parseBuyPhotoPrice(photo.price),
  buyerName,
  buyerEmail,
  paymentMethod: 'PayPal · **** 4242',
  license: BUY_PHOTO_LICENSE,
  date: new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }),
});

export const saveLastBuyPurchase = (purchase) => {
  try {
    sessionStorage.setItem(LAST_BUY_PURCHASE_KEY, JSON.stringify(purchase));
  } catch {
    // Storage unavailable — checkout still works via router state.
  }
};

export const loadLastBuyPurchase = () => {
  try {
    const raw = sessionStorage.getItem(LAST_BUY_PURCHASE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};
