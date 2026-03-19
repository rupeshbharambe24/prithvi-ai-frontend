import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Theme = 'light' | 'dark' | 'system';
export type Language = 'en' | 'hi';

export interface Region {
  id: string;
  numericId: number;
  name: string;
  coordinates: [number, number];
}

interface AppState {
  theme: Theme;
  language: Language;
  selectedRegion: Region | null;
  selectedDate: Date;
  leadTime: number; // days ahead for forecasts
  sidebarCollapsed: boolean;
  
  // Actions
  setTheme: (theme: Theme) => void;
  setLanguage: (language: Language) => void;
  setRegion: (region: Region | null) => void;
  setDate: (date: Date) => void;
  setLeadTime: (days: number) => void;
  toggleSidebar: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      theme: 'system',
      language: 'en',
      selectedRegion: null,
      selectedDate: new Date(),
      leadTime: 3,
      sidebarCollapsed: false,

      setTheme: (theme) => set({ theme }),
      setLanguage: (language) => set({ language }),
      setRegion: (region) => set({ selectedRegion: region }),
      setDate: (date) => set({ selectedDate: date }),
      setLeadTime: (days) => set({ leadTime: days }),
      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
    }),
    {
      name: 'prithvi-app-store',
    }
  )
);
