import { createSlice } from "@reduxjs/toolkit";

const UNAUTHENTICATED = {
  user: null,
  isAuthenticated: false,
  token: null,
  loading: false,
};

const isTokenExpired = (token) => {
  // Non-JWT demo/mock tokens stay valid for the session persistence path
  if (token === 'demo') return false;

  try {
    // JWT uses base64url — replace url-safe chars before atob()
    const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const payload = JSON.parse(atob(base64));
    return typeof payload?.exp === "number" && payload.exp * 1000 < Date.now();
  } catch {
    return true; // treat malformed/non-JWT tokens as expired
  }
};

const loadAuthState = () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return UNAUTHENTICATED;

    if (isTokenExpired(token)) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      return UNAUTHENTICATED;
    }

    const user = JSON.parse(localStorage.getItem("user") || "null");
    return { user, isAuthenticated: true, token, loading: false };
  } catch {
    return UNAUTHENTICATED;
  }
};

const authSlice = createSlice({
  name: "auth",
  initialState: loadAuthState(),
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.loading = false;
    },

    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },

    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
    },
  },
});

export const { loginSuccess, logout, setLoading, updateUser } =
  authSlice.actions;

export default authSlice.reducer;

export const selectUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectToken = (state) => state.auth.token;
export const selectAuthLoading = (state) => state.auth.loading;
