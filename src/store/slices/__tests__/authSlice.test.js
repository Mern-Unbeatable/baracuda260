import authReducer, {
  loginSuccess,
  logout,
  setLoading,
  updateUser,
  selectUser,
  selectIsAuthenticated,
  selectToken,
  selectAuthLoading,
} from '../authSlice';

// Explicit base state — avoids any dependency on localStorage at module import time
const unauthenticated = {
  user: null,
  isAuthenticated: false,
  token: null,
  loading: false,
};

const authenticatedState = {
  user: { id: 42, email: 'user@example.com' },
  isAuthenticated: true,
  token: 'some.jwt.token',
  loading: false,
};

describe('authSlice reducers', () => {
  describe('loginSuccess', () => {
    it('sets user, token, and isAuthenticated', () => {
      const action = loginSuccess({
        user: { id: 1, email: 'a@b.com' },
        token: 'access.token',
      });
      const state = authReducer(unauthenticated, action);
      expect(state.isAuthenticated).toBe(true);
      expect(state.token).toBe('access.token');
      expect(state.user).toEqual({ id: 1, email: 'a@b.com' });
      expect(state.loading).toBe(false);
    });
  });

  describe('logout', () => {
    it('clears user, token, and isAuthenticated', () => {
      const state = authReducer(authenticatedState, logout());
      expect(state.isAuthenticated).toBe(false);
      expect(state.token).toBeNull();
      expect(state.user).toBeNull();
    });
  });

  describe('setLoading', () => {
    it('sets loading to true', () => {
      const state = authReducer(unauthenticated, setLoading(true));
      expect(state.loading).toBe(true);
    });

    it('sets loading to false', () => {
      const state = authReducer({ ...unauthenticated, loading: true }, setLoading(false));
      expect(state.loading).toBe(false);
    });
  });

  describe('updateUser', () => {
    it('merges new fields into existing user', () => {
      const state = authReducer(
        authenticatedState,
        updateUser({ name: 'Jane' }),
      );
      expect(state.user).toEqual({ id: 42, email: 'user@example.com', name: 'Jane' });
    });
  });
});

describe('authSlice selectors', () => {
  const rootState = { auth: authenticatedState };

  it('selectUser returns the user object', () => {
    expect(selectUser(rootState)).toEqual({ id: 42, email: 'user@example.com' });
  });

  it('selectIsAuthenticated returns true', () => {
    expect(selectIsAuthenticated(rootState)).toBe(true);
  });

  it('selectToken returns the token string', () => {
    expect(selectToken(rootState)).toBe('some.jwt.token');
  });

  it('selectAuthLoading returns false', () => {
    expect(selectAuthLoading(rootState)).toBe(false);
  });
});
