import themeReducer, {
  toggleTheme,
  setTheme,
  setPrimaryColor,
  selectThemeMode,
  selectPrimaryColor,
} from '../themeSlice';

// localStorage is mocked by JSDOM — clear before each test to avoid bleed-through
beforeEach(() => {
  localStorage.clear();
});

describe('themeSlice reducers', () => {
  const lightState = { mode: 'light', primaryColor: '#3B82F6' };
  const darkState = { mode: 'dark', primaryColor: '#3B82F6' };

  describe('toggleTheme', () => {
    it('switches light → dark', () => {
      const state = themeReducer(lightState, toggleTheme());
      expect(state.mode).toBe('dark');
    });

    it('switches dark → light', () => {
      const state = themeReducer(darkState, toggleTheme());
      expect(state.mode).toBe('light');
    });
  });

  describe('setTheme', () => {
    it('sets mode to dark', () => {
      const state = themeReducer(lightState, setTheme('dark'));
      expect(state.mode).toBe('dark');
    });

    it('sets mode to light', () => {
      const state = themeReducer(darkState, setTheme('light'));
      expect(state.mode).toBe('light');
    });
  });

  describe('setPrimaryColor', () => {
    it('updates the primary color', () => {
      const state = themeReducer(lightState, setPrimaryColor('#FF0000'));
      expect(state.primaryColor).toBe('#FF0000');
    });
  });
});

describe('themeSlice selectors', () => {
  const rootState = { theme: { mode: 'dark', primaryColor: '#10B981' } };

  it('selectThemeMode returns the current mode', () => {
    expect(selectThemeMode(rootState)).toBe('dark');
  });

  it('selectPrimaryColor returns the primary color', () => {
    expect(selectPrimaryColor(rootState)).toBe('#10B981');
  });
});
