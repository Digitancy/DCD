import { create } from 'zustand'

interface AppState {
  isDarkMode: boolean
  toggleDarkMode: () => void
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
}

export const useAppStore = create<AppState>((set) => ({
  isDarkMode: false,
  toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
  isLoading: false,
  setIsLoading: (loading) => set({ isLoading: loading }),
})) 