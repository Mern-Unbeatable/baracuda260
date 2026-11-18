import React, { memo } from 'react';
import { useSEO } from '@/shared/hooks/useSEO';
import ItemWatchlistContent from '@/portals/member/views/ItemWatchlistContent';

const ItemWatchlist = memo(() => {
  useSEO({
    title: 'Item Watchlist',
    description: 'Browse your saved store items and products.',
    keywords: ['item watchlist', 'saved products', 'my store', 'watchlist'],
  });

  return <ItemWatchlistContent />;
});

ItemWatchlist.displayName = 'ItemWatchlist';

export default ItemWatchlist;
