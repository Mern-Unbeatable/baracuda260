export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",
    REFRESH: "/auth/refresh",
    ME: "/auth/me",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password",
    VERIFY_EMAIL: "/auth/verify-email",
  },

  USERS: {
    PROFILE: "/users/profile",
    UPDATE_PROFILE: "/users/profile",
    CHANGE_PASSWORD: "/users/change-password",
    LIST: "/users",
    BY_ID: (id) => `/users/${id}`,
  },

  CONTACT: {
    SEND: "/contact",
  },

  SERVICES: {
    LIST: "/services",
    BY_ID: (id) => `/services/${id}`,
  },

  CHAT: {
    ROOM: "/api/v1/chat/room",
    ROOMS: "/api/v1/chat/rooms",
    MESSAGES: (id) => `/api/v1/chat/rooms/${id}/messages`,
    SEND_MESSAGE: (id) => `/api/v1/chat/rooms/${id}/messages`,
    MARK_READ: (id) => `/api/v1/chat/rooms/${id}/read`,
  },

  PRODUCTS: {
    LIST: "/products",
    BY_ID: (id) => `/products/${id}`,
  },

  ORDERS: {
    LIST: "/orders",
    BY_ID: (id) => `/orders/${id}`,
  },

  EMAILS: {
    LIST: "/emails",
  },

  LEADS: {
    LIST: "/leads",
    BY_ID: (id) => `/leads/${id}`,
  },

  BLOG: {
    LIST: "/blog",
    BY_ID: (id) => `/blog/${id}`,
  },

  JOBS: {
    LIST: "/jobs",
    BY_ID: (id) => `/jobs/${id}`,
  },

  CASE_STUDIES: {
    LIST: "/case-studies",
    BY_ID: (id) => `/case-studies/${id}`,
  },

  PRICING: {
    LIST: "/pricing",
  },

  MARKETPLACE_ORDERS: {
    LIST: "/marketplace-orders",
  },

  ADMIN: {
    STATS: "/admin/stats",
  },
};

export default API_ENDPOINTS;
