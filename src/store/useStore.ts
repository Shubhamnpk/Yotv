import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CustomTheme {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  background: string;
  text: string;
}

interface WatchHistoryItem {
  channelId: string;
  timestamp: number;
}

interface Settings {
  theme: 'light' | 'dark' | 'custom';
  customThemes: CustomTheme[];
  activeCustomTheme?: string;
  preferredLanguages: string[];
  preferredCountries: string[];
  preferredCategories: string[];
  favorites: string[];
  watchHistory: WatchHistoryItem[];
}

interface Store {
  settings: Settings;
  updateSettings: (settings: Partial<Settings>) => void;
  toggleFavorite: (channelId: string) => void;
  addToWatchHistory: (channelId: string) => void;
  clearWatchHistory: () => void;
  removeFromWatchHistory: (channelId: string) => void;
  addCustomTheme: (theme: CustomTheme) => void;
  removeCustomTheme: (themeId: string) => void;
}

const useStore = create<Store>()(
  persist(
    (set) => ({
      settings: {
        theme: 'light',
        customThemes: [],
        preferredLanguages: [],
        preferredCountries: [],
        preferredCategories: [],
        favorites: [],
        watchHistory: []
      },
      updateSettings: (newSettings) =>
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        })),
      toggleFavorite: (channelId) =>
        set((state) => ({
          settings: {
            ...state.settings,
            favorites: state.settings.favorites.includes(channelId)
              ? state.settings.favorites.filter((id) => id !== channelId)
              : [...state.settings.favorites, channelId],
          },
        })),
      addToWatchHistory: (channelId) =>
        set((state) => ({
          settings: {
            ...state.settings,
            watchHistory: [
              { channelId, timestamp: Date.now() },
              ...state.settings.watchHistory.filter(item => item.channelId !== channelId)
            ].slice(0, 50) // Keep only last 50 items
          }
        })),
      clearWatchHistory: () =>
        set((state) => ({
          settings: {
            ...state.settings,
            watchHistory: []
          }
        })),
      removeFromWatchHistory: (channelId) =>
        set((state) => ({
          settings: {
            ...state.settings,
            watchHistory: state.settings.watchHistory.filter(
              item => item.channelId !== channelId
            )
          }
        })),
      addCustomTheme: (theme) =>
        set((state) => ({
          settings: {
            ...state.settings,
            customThemes: [...state.settings.customThemes, theme]
          }
        })),
      removeCustomTheme: (themeId) =>
        set((state) => ({
          settings: {
            ...state.settings,
            customThemes: state.settings.customThemes.filter(theme => theme.id !== themeId),
            activeCustomTheme: state.settings.activeCustomTheme === themeId 
              ? undefined 
              : state.settings.activeCustomTheme
          }
        }))
    }),
    {
      name: 'iptv-settings',
    }
  )
);

export default useStore;