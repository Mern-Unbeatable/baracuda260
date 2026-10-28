import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import {
  getMyPurchasesApi,
  getMyPurchasesStatsApi,
  MY_PURCHASES_QUERY_KEY,
  MY_PURCHASES_STATS_QUERY_KEY,
  parsePurchasePrice,
} from '@/shared/api/premiumPhotos.api';
import { resolveMediaUrl } from '@/shared/utils/media';

export const mapPurchaseItem = (item) => {
  if (!item) return null;
  const photo = item.premiumPhoto || {};
  const user = photo.user || {};
  const mediaList = Array.isArray(photo.media) ? photo.media : [];
  const primaryMedia = mediaList[0] || {};
  const rawKind = String(photo.kind || 'SINGLE').toUpperCase();

  let badge = 'Single Photo';
  if (rawKind === 'TWELVE') {
    badge = '12 photos - full Zodiac Story';
  } else if (rawKind === 'SIX') {
    badge = '6 Photos Story';
  }

  const parsedPrice = parsePurchasePrice(item.price, photo.price);
  const formattedPrice = `$${parsedPrice.toFixed(2)}`;

  const photographer = user.name || 'Photographer';
  const initials =
    photographer
      .split(' ')
      .map((w) => w[0])
      .filter(Boolean)
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'PH';

  const dateStr = item.order?.createdAt || item.createdAt;
  const createdDate = dateStr ? new Date(dateStr) : null;
  const purchasedLabel =
    createdDate && !isNaN(createdDate.getTime())
      ? createdDate.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })
      : '';

  const mediaUrl = primaryMedia.url ? resolveMediaUrl(primaryMedia.url) : '';
  const imageUrl = resolveMediaUrl(
    primaryMedia.url || photo.coverImage || photo.image || '',
  );

  return {
    id: item.id,
    orderId: item.orderId,
    premiumPhotoId: item.premiumPhotoId || photo.id,
    title: photo.title || 'Purchased Photo',
    photographer,
    initials,
    price: formattedPrice,
    priceValue: parsedPrice,
    purchasedLabel,
    purchasedAt: dateStr,
    badge,
    image: imageUrl || '/assets/home/photo-city.webp',
    downloadUrl: mediaUrl,
    downloadAvailable: Boolean(item.premiumPhotoId || photo.id || mediaUrl),
    license: photo.license || 'Standard Commercial License (Royalty Free)',
    size: item.size || 'ORIGINAL_RAW',
    format: primaryMedia.format || 'image/jpeg',
    raw: item,
  };
};

export default function usePurchasePhotos({ page = 1, limit = 8 } = {}) {
  const statsQuery = useQuery({
    queryKey: MY_PURCHASES_STATS_QUERY_KEY,
    queryFn: getMyPurchasesStatsApi,
    staleTime: 30 * 1000,
  });

  const purchasesQuery = useQuery({
    queryKey: MY_PURCHASES_QUERY_KEY({ page, limit }),
    queryFn: () => getMyPurchasesApi({ page, limit }),
    staleTime: 30 * 1000,
    placeholderData: keepPreviousData,
  });

  const stats = useMemo(() => {
    const rawData = statsQuery.data || {};
    const totalPurchases = rawData.totalPurchases ?? 0;
    const totalSpent = Number(rawData.totalSpent ?? 0);
    const availableDownloads = rawData.availableDownloads ?? 0;

    return {
      total: totalPurchases,
      spent: `$${totalSpent.toFixed(2)}`,
      downloads: availableDownloads,
    };
  }, [statsQuery.data]);

  const { items, meta } = useMemo(() => {
    const rawList = purchasesQuery.data?.data || [];
    const rawMeta = purchasesQuery.data?.meta;

    const mapped = rawList.map(mapPurchaseItem).filter(Boolean);

    const resolvedMeta = {
      currentPage: rawMeta?.currentPage ?? page,
      totalPages: rawMeta?.totalPages ?? 1,
      totalRecords: rawMeta?.totalRecords ?? mapped.length,
      hasNext: Boolean(rawMeta?.hasNext),
      hasPrevious: Boolean(rawMeta?.hasPrevious),
    };

    return { items: mapped, meta: resolvedMeta };
  }, [purchasesQuery.data, page]);

  return {
    items,
    meta,
    stats,
    isLoading: purchasesQuery.isLoading || statsQuery.isLoading,
    isPurchasesLoading: purchasesQuery.isLoading,
    isStatsLoading: statsQuery.isLoading,
    isError: purchasesQuery.isError || statsQuery.isError,
    error: purchasesQuery.error || statsQuery.error,
    refetch: () => {
      purchasesQuery.refetch();
      statsQuery.refetch();
    },
  };
}
