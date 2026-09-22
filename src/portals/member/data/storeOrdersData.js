/** Member seller Orders — store order management list + detail. */

const H = '/assets/home';

export const STORE_ORDERS_PAGE_SIZE = 8;

export const STORE_ORDER_STATUS = {
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
};

export const STORE_ORDER_STATUS_STYLES = {
  [STORE_ORDER_STATUS.PROCESSING]: {
    badge: 'bg-[#fff7ed] text-[#d97706]',
    dot: 'bg-[#f59e0b]',
  },
  [STORE_ORDER_STATUS.SHIPPED]: {
    badge: 'bg-[#f3eefc] text-[#7c3aed]',
    dot: 'bg-[#7c3aed]',
  },
  [STORE_ORDER_STATUS.DELIVERED]: {
    badge: 'bg-[#eaf8f1] text-[#059669]',
    dot: 'bg-[#10b981]',
  },
  [STORE_ORDER_STATUS.CANCELLED]: {
    badge: 'bg-[#fef2f2] text-[#dc2626]',
    dot: 'bg-[#ef4444]',
  },
};

export const STORE_ORDER_STATUS_LABEL_KEYS = {
  [STORE_ORDER_STATUS.PROCESSING]: 'storeOrders.status.processing',
  [STORE_ORDER_STATUS.SHIPPED]: 'storeOrders.status.shipped',
  [STORE_ORDER_STATUS.DELIVERED]: 'storeOrders.status.delivered',
  [STORE_ORDER_STATUS.CANCELLED]: 'storeOrders.status.cancelled',
};

export const STORE_ORDERS_STAT_CARDS = [
  {
    id: 'totalOrders',
    labelKey: 'storeOrders.stats.totalOrders',
    hintKey: 'storeOrders.stats.totalOrdersHint',
    icon: 'ShoppingBag',
    iconBg: 'bg-[#111827] text-white',
    cardClass: 'border-[#eceef3] bg-white',
    valueClass: 'text-[#111827]',
  },
  {
    id: 'totalSales',
    labelKey: 'storeOrders.stats.totalSales',
    hintKey: 'storeOrders.stats.totalSalesHint',
    icon: 'Banknote',
    iconBg: 'bg-[#eef2ff] text-[#4048cd]',
    cardClass: 'border-[#eceef3] bg-white',
    valueClass: 'text-[#111827]',
  },
  {
    id: 'commission',
    labelKey: 'storeOrders.stats.commission',
    hintKey: 'storeOrders.stats.commissionHint',
    icon: 'Percent',
    iconBg: 'bg-[#fff4e5] text-[#d97706]',
    cardClass: 'border-[#eceef3] bg-white',
    valueClass: 'text-[#111827]',
  },
  {
    id: 'earnings',
    labelKey: 'storeOrders.stats.earnings',
    hintKey: 'storeOrders.stats.earningsHint',
    icon: 'Wallet',
    iconBg: 'bg-[#eaf8f1] text-[#059669]',
    cardClass: 'border-[#86efac] bg-[#f0fdf4]',
    valueClass: 'text-[#059669]',
  },
];

/** Lifetime summary shown on the stats strip (independent of table filters). */
export const STORE_ORDERS_SUMMARY = {
  totalOrders: '128',
  totalSales: '$4,850.00',
  commission: '$485.00',
  earnings: '$4,365.00',
};

export const STORE_ORDER_STATUS_FILTERS = [
  { id: 'all', labelKey: 'storeOrders.filters.all' },
  {
    id: STORE_ORDER_STATUS.PROCESSING,
    labelKey: 'storeOrders.filters.processing',
  },
  { id: STORE_ORDER_STATUS.SHIPPED, labelKey: 'storeOrders.filters.shipped' },
  {
    id: STORE_ORDER_STATUS.DELIVERED,
    labelKey: 'storeOrders.filters.delivered',
  },
  {
    id: STORE_ORDER_STATUS.CANCELLED,
    labelKey: 'storeOrders.filters.cancelled',
  },
];

export const STORE_ORDER_DATE_FILTERS = [
  { id: 'today', labelKey: 'storeOrders.date.today' },
  { id: 'week', labelKey: 'storeOrders.date.week' },
  { id: 'month', labelKey: 'storeOrders.date.month' },
  { id: 'custom', labelKey: 'storeOrders.date.custom' },
];

export const STORE_ORDER_ACTION_STATUSES = [
  STORE_ORDER_STATUS.PROCESSING,
  STORE_ORDER_STATUS.SHIPPED,
  STORE_ORDER_STATUS.DELIVERED,
  STORE_ORDER_STATUS.CANCELLED,
];

const AVATAR_COLORS = [
  'bg-[#4048cd] text-white',
  'bg-[#f59e0b] text-white',
  'bg-[#059669] text-white',
  'bg-[#7c3aed] text-white',
  'bg-[#ee1c25] text-white',
  'bg-[#0ea5e9] text-white',
];

export const STORE_ORDERS = [
  {
    id: 'ord-1848',
    orderNumber: 'ORD-1848',
    date: 'Sep 14, 2026',
    placedAt: 'September 14, 2026 - 10:32 AM',
    status: STORE_ORDER_STATUS.SHIPPED,
    customerName: 'Sarah Johnson',
    customerInitials: 'SJ',
    avatarClass: AVATAR_COLORS[1],
    customerEmail: 's.johnson@example.com',
    customerPhone: '+1 555 221 8840',
    shippingAddress: '123 Main Street New York, NY 10001 USA',
    productTitle: 'Handmade Ceramic Mug',
    productMeta: 'Stoneware · Set of styles',
    quantity: 2,
    unitPrice: '$22.50',
    total: '$45.00',
    commission: '-$4.50',
    earnings: '$40.50',
    paymentStatus: 'paid',
    image: `${H}/photo-harbor.webp`,
    transitNote: 'In transit — NYC hub',
    timeline: [
      { id: 'placed', state: 'done', date: 'Sep 14, 2026', time: '10:32 AM' },
      {
        id: 'processing',
        state: 'done',
        date: 'Sep 14, 2026',
        time: '11:10 AM',
      },
      { id: 'shipped', state: 'done', date: 'Sep 14, 2026', time: '4:20 PM' },
      { id: 'delivered', state: 'pending', date: null, time: null },
    ],
  },
  {
    id: 'ord-1043',
    orderNumber: 'ORD-1043',
    date: 'Sep 9, 2026',
    placedAt: 'September 9, 2026 • 2:14 PM',
    status: STORE_ORDER_STATUS.SHIPPED,
    customerName: 'James Carter',
    customerInitials: 'JC',
    avatarClass: AVATAR_COLORS[0],
    customerEmail: 'j.carter@example.com',
    customerPhone: '+1 555 654 1123',
    shippingAddress: '402 Birch Avenue Denver, CO 80206 USA',
    productTitle: 'Photo Book — Streets of Tokyo',
    productMeta: 'Hardcover • 120 pages',
    quantity: 1,
    unitPrice: '$60.00',
    total: '$60.00',
    commission: '-$6.00',
    earnings: '$54.00',
    paymentStatus: 'paid',
    image: `${H}/photo-city.webp`,
    transitNote: 'In transit — Denver facility',
    timeline: [
      { id: 'placed', state: 'done', date: 'Sep 9, 2026', time: '2:14 PM' },
      {
        id: 'processing',
        state: 'done',
        date: 'Sep 10, 2026',
        time: '9:00 AM',
      },
      { id: 'shipped', state: 'done', date: 'Sep 10, 2026', time: '4:44 PM' },
      { id: 'delivered', state: 'pending', date: null, time: null },
    ],
  },
  {
    id: 'ord-1839',
    orderNumber: 'ORD-1839',
    date: 'Sep 12, 2026',
    placedAt: 'September 12, 2026 - 3:18 PM',
    status: STORE_ORDER_STATUS.DELIVERED,
    customerName: 'Alex Morgan',
    customerInitials: 'AM',
    avatarClass: AVATAR_COLORS[2],
    customerEmail: 'a.morgan@example.com',
    customerPhone: '+1 555 332 9100',
    shippingAddress: '88 Pine Road Austin, TX 78701 USA',
    productTitle: 'Photography Art Print',
    productMeta: 'Fine art · A3',
    quantity: 1,
    unitPrice: '$35.00',
    total: '$35.00',
    commission: '-$3.50',
    earnings: '$31.50',
    paymentStatus: 'paid',
    image: `${H}/photo-golden.webp`,
    transitNote: null,
    timeline: [
      { id: 'placed', state: 'done', date: 'Sep 12, 2026', time: '3:18 PM' },
      {
        id: 'processing',
        state: 'done',
        date: 'Sep 12, 2026',
        time: '4:02 PM',
      },
      { id: 'shipped', state: 'done', date: 'Sep 13, 2026', time: '10:00 AM' },
      { id: 'delivered', state: 'done', date: 'Sep 15, 2026', time: '1:20 PM' },
    ],
  },
  {
    id: 'ord-1831',
    orderNumber: 'ORD-1831',
    date: 'Sep 10, 2026',
    placedAt: 'September 10, 2026 - 9:05 AM',
    status: STORE_ORDER_STATUS.PROCESSING,
    customerName: 'Lina Park',
    customerInitials: 'LP',
    avatarClass: AVATAR_COLORS[3],
    customerEmail: 'l.park@example.com',
    customerPhone: '+1 555 778 2211',
    shippingAddress: '15 Oak Lane Seattle, WA 98101 USA',
    productTitle: 'Custom Photographer T-Shirt',
    productMeta: 'Limited edition · M',
    quantity: 1,
    unitPrice: '$42.00',
    total: '$42.00',
    commission: '-$4.20',
    earnings: '$37.80',
    paymentStatus: 'paid',
    image: `${H}/photo-wings.webp`,
    transitNote: null,
    timeline: [
      { id: 'placed', state: 'done', date: 'Sep 10, 2026', time: '9:05 AM' },
      {
        id: 'processing',
        state: 'current',
        date: 'Sep 10, 2026',
        time: '10:20 AM',
      },
      { id: 'shipped', state: 'pending', date: null, time: null },
      { id: 'delivered', state: 'pending', date: null, time: null },
    ],
  },
  {
    id: 'ord-1824',
    orderNumber: 'ORD-1824',
    date: 'Sep 8, 2026',
    placedAt: 'September 8, 2026 - 6:44 PM',
    status: STORE_ORDER_STATUS.DELIVERED,
    customerName: 'Maya Chen',
    customerInitials: 'MC',
    avatarClass: AVATAR_COLORS[4],
    customerEmail: 'm.chen@example.com',
    customerPhone: '+1 555 441 0909',
    shippingAddress: '210 Lake View Chicago, IL 60601 USA',
    productTitle: 'Forest Cathedral Fine Art Print',
    productMeta: 'Giclée · 18×24',
    quantity: 1,
    unitPrice: '$58.00',
    total: '$58.00',
    commission: '-$5.80',
    earnings: '$52.20',
    paymentStatus: 'paid',
    image: `${H}/photo-forest.webp`,
    transitNote: null,
    timeline: [
      { id: 'placed', state: 'done', date: 'Sep 8, 2026', time: '6:44 PM' },
      { id: 'processing', state: 'done', date: 'Sep 8, 2026', time: '7:10 PM' },
      { id: 'shipped', state: 'done', date: 'Sep 9, 2026', time: '11:00 AM' },
      { id: 'delivered', state: 'done', date: 'Sep 12, 2026', time: '3:05 PM' },
    ],
  },
  {
    id: 'ord-1818',
    orderNumber: 'ORD-1818',
    date: 'Sep 6, 2026',
    placedAt: 'September 6, 2026 - 1:12 PM',
    status: STORE_ORDER_STATUS.DELIVERED,
    customerName: 'Noah Blake',
    customerInitials: 'NB',
    avatarClass: AVATAR_COLORS[5],
    customerEmail: 'n.blake@example.com',
    customerPhone: '+1 555 990 3344',
    shippingAddress: '77 Harbor Dr Miami, FL 33101 USA',
    productTitle: 'Zodiac Journey Photobook',
    productMeta: 'Softcover · 96 pages',
    quantity: 1,
    unitPrice: '$78.00',
    total: '$70.00',
    commission: '-$7.00',
    earnings: '$63.00',
    paymentStatus: 'paid',
    image: `${H}/photo-zodiac.webp`,
    transitNote: null,
    timeline: [
      { id: 'placed', state: 'done', date: 'Sep 6, 2026', time: '1:12 PM' },
      { id: 'processing', state: 'done', date: 'Sep 6, 2026', time: '2:00 PM' },
      { id: 'shipped', state: 'done', date: 'Sep 7, 2026', time: '9:30 AM' },
      {
        id: 'delivered',
        state: 'done',
        date: 'Sep 10, 2026',
        time: '12:40 PM',
      },
    ],
  },
  {
    id: 'ord-1812',
    orderNumber: 'ORD-1812',
    date: 'Sep 4, 2026',
    placedAt: 'September 4, 2026 - 11:25 AM',
    status: STORE_ORDER_STATUS.CANCELLED,
    customerName: 'Eva Rossi',
    customerInitials: 'ER',
    avatarClass: AVATAR_COLORS[1],
    customerEmail: 'e.rossi@example.com',
    customerPhone: '+1 555 612 7788',
    shippingAddress: '9 Market Street Boston, MA 02108 USA',
    productTitle: 'Morning Fields Preset Pack',
    productMeta: 'Digital download',
    quantity: 1,
    unitPrice: '$18.00',
    total: '$18.00',
    commission: '-$1.80',
    earnings: '$0.00',
    paymentStatus: 'refunded',
    image: `${H}/photo-morning.webp`,
    transitNote: null,
    timeline: [
      { id: 'placed', state: 'done', date: 'Sep 4, 2026', time: '11:25 AM' },
      {
        id: 'processing',
        state: 'done',
        date: 'Sep 4, 2026',
        time: '12:00 PM',
      },
      { id: 'shipped', state: 'pending', date: null, time: null },
      { id: 'delivered', state: 'pending', date: null, time: null },
    ],
  },
  {
    id: 'ord-1805',
    orderNumber: 'ORD-1805',
    date: 'Sep 2, 2026',
    placedAt: 'September 2, 2026 - 4:50 PM',
    status: STORE_ORDER_STATUS.DELIVERED,
    customerName: 'Tom Rivera',
    customerInitials: 'TR',
    avatarClass: AVATAR_COLORS[0],
    customerEmail: 't.rivera@example.com',
    customerPhone: '+1 555 203 6677',
    shippingAddress: '501 West End Portland, OR 97201 USA',
    productTitle: 'Harbor Mist Canvas Print',
    productMeta: 'Canvas · 24×36',
    quantity: 1,
    unitPrice: '$64.00',
    total: '$71.00',
    commission: '-$7.10',
    earnings: '$63.90',
    paymentStatus: 'paid',
    image: `${H}/photo-tidal.webp`,
    transitNote: null,
    timeline: [
      { id: 'placed', state: 'done', date: 'Sep 2, 2026', time: '4:50 PM' },
      { id: 'processing', state: 'done', date: 'Sep 2, 2026', time: '5:30 PM' },
      { id: 'shipped', state: 'done', date: 'Sep 3, 2026', time: '10:15 AM' },
      { id: 'delivered', state: 'done', date: 'Sep 7, 2026', time: '2:00 PM' },
    ],
  },
  {
    id: 'ord-1798',
    orderNumber: 'ORD-1798',
    date: 'Aug 28, 2026',
    placedAt: 'August 28, 2026 - 2:15 PM',
    status: STORE_ORDER_STATUS.DELIVERED,
    customerName: 'Ivy Brooks',
    customerInitials: 'IB',
    avatarClass: AVATAR_COLORS[2],
    customerEmail: 'i.brooks@example.com',
    customerPhone: '+1 555 881 4455',
    shippingAddress: '42 Willow Ct Nashville, TN 37201 USA',
    productTitle: 'Autumn Ridge Photo Frame Set',
    productMeta: 'Walnut frame · 11×14',
    quantity: 1,
    unitPrice: '$49.00',
    total: '$49.00',
    commission: '-$4.90',
    earnings: '$44.10',
    paymentStatus: 'paid',
    image: `${H}/photo-autumn.webp`,
    transitNote: null,
    timeline: [
      { id: 'placed', state: 'done', date: 'Aug 28, 2026', time: '2:15 PM' },
      {
        id: 'processing',
        state: 'done',
        date: 'Aug 28, 2026',
        time: '3:00 PM',
      },
      { id: 'shipped', state: 'done', date: 'Aug 29, 2026', time: '8:40 AM' },
      { id: 'delivered', state: 'done', date: 'Sep 1, 2026', time: '11:10 AM' },
    ],
  },
  {
    id: 'ord-1791',
    orderNumber: 'ORD-1791',
    date: 'Aug 22, 2026',
    placedAt: 'August 22, 2026 - 10:08 AM',
    status: STORE_ORDER_STATUS.DELIVERED,
    customerName: 'Omar Said',
    customerInitials: 'OS',
    avatarClass: AVATAR_COLORS[3],
    customerEmail: 'o.said@example.com',
    customerPhone: '+1 555 714 2200',
    shippingAddress: '18 Crescent Ave Philadelphia, PA 19103 USA',
    productTitle: 'Silent Peak Poster Print',
    productMeta: 'Matte poster · A2',
    quantity: 2,
    unitPrice: '$28.00',
    total: '$56.00',
    commission: '-$5.60',
    earnings: '$50.40',
    paymentStatus: 'paid',
    image: `${H}/photo-silent.webp`,
    transitNote: null,
    timeline: [
      { id: 'placed', state: 'done', date: 'Aug 22, 2026', time: '10:08 AM' },
      {
        id: 'processing',
        state: 'done',
        date: 'Aug 22, 2026',
        time: '11:00 AM',
      },
      { id: 'shipped', state: 'done', date: 'Aug 23, 2026', time: '1:30 PM' },
      { id: 'delivered', state: 'done', date: 'Aug 26, 2026', time: '4:15 PM' },
    ],
  },
  {
    id: 'ord-1784',
    orderNumber: 'ORD-1784',
    date: 'Aug 18, 2026',
    placedAt: 'August 18, 2026 - 5:40 PM',
    status: STORE_ORDER_STATUS.DELIVERED,
    customerName: 'Nina Vogel',
    customerInitials: 'NV',
    avatarClass: AVATAR_COLORS[5],
    customerEmail: 'n.vogel@example.com',
    customerPhone: '+1 555 356 1199',
    shippingAddress: '300 River Rd Minneapolis, MN 55401 USA',
    productTitle: 'Wings Over Water Art Print',
    productMeta: 'Archival ink · 16×20',
    quantity: 1,
    unitPrice: '$39.00',
    total: '$43.00',
    commission: '-$4.30',
    earnings: '$38.70',
    paymentStatus: 'paid',
    image: `${H}/photo-wings.webp`,
    transitNote: null,
    timeline: [
      { id: 'placed', state: 'done', date: 'Aug 18, 2026', time: '5:40 PM' },
      {
        id: 'processing',
        state: 'done',
        date: 'Aug 18, 2026',
        time: '6:20 PM',
      },
      { id: 'shipped', state: 'done', date: 'Aug 19, 2026', time: '9:00 AM' },
      { id: 'delivered', state: 'done', date: 'Aug 22, 2026', time: '2:45 PM' },
    ],
  },
  {
    id: 'ord-1777',
    orderNumber: 'ORD-1777',
    date: 'Aug 12, 2026',
    placedAt: 'August 12, 2026 - 9:22 AM',
    status: STORE_ORDER_STATUS.DELIVERED,
    customerName: 'Jade Kim',
    customerInitials: 'JK',
    avatarClass: AVATAR_COLORS[4],
    customerEmail: 'j.kim@example.com',
    customerPhone: '+1 555 468 3301',
    shippingAddress: '61 Broadway San Francisco, CA 94105 USA',
    productTitle: 'City Lights Metal Print',
    productMeta: 'Aluminum · 20×30',
    quantity: 1,
    unitPrice: '$72.00',
    total: '$72.00',
    commission: '-$7.20',
    earnings: '$64.80',
    paymentStatus: 'paid',
    image: `${H}/photo-city.webp`,
    transitNote: null,
    timeline: [
      { id: 'placed', state: 'done', date: 'Aug 12, 2026', time: '9:22 AM' },
      {
        id: 'processing',
        state: 'done',
        date: 'Aug 12, 2026',
        time: '10:05 AM',
      },
      { id: 'shipped', state: 'done', date: 'Aug 13, 2026', time: '3:20 PM' },
      {
        id: 'delivered',
        state: 'done',
        date: 'Aug 16, 2026',
        time: '11:50 AM',
      },
    ],
  },
];

export const getStoreOrderById = (orderId) =>
  STORE_ORDERS.find(
    (order) => order.id === orderId || order.orderNumber === orderId,
  ) || null;

export const countStoreOrdersByStatus = (orders) => {
  const counts = {
    all: orders.length,
    [STORE_ORDER_STATUS.PROCESSING]: 0,
    [STORE_ORDER_STATUS.SHIPPED]: 0,
    [STORE_ORDER_STATUS.DELIVERED]: 0,
    [STORE_ORDER_STATUS.CANCELLED]: 0,
  };
  orders.forEach((order) => {
    if (counts[order.status] !== undefined) counts[order.status] += 1;
  });
  return counts;
};

export const filterStoreOrders = (orders, statusFilter) => {
  if (!statusFilter || statusFilter === 'all') return orders;
  return orders.filter((order) => order.status === statusFilter);
};

export const getMarkActionLabelKey = (status) => {
  switch (status) {
    case STORE_ORDER_STATUS.PROCESSING:
      return 'storeOrders.detail.markProcessing';
    case STORE_ORDER_STATUS.SHIPPED:
      return 'storeOrders.detail.markShipped';
    case STORE_ORDER_STATUS.DELIVERED:
      return 'storeOrders.detail.markDelivered';
    case STORE_ORDER_STATUS.CANCELLED:
      return 'storeOrders.detail.markCancelled';
    default:
      return 'storeOrders.detail.markDelivered';
  }
};
