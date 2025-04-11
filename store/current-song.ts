import { create } from "zustand";

interface CurrentSongState {
  currentSongID: string | null;
  action: "Play" | "Pause" | null;
  isLooped: "false" | "all" | "one";
  isShuffle: boolean;
  setIsLooped: (isLooped: "false" | "all" | "one") => void;
  setIsShuffle: (isShuffle: boolean) => void;
  setAction: (action: "Play" | "Pause" | null) => void;
  setCurrentSongID: (url: string | null) => void;
}

export const useCurrentSongStore = create<CurrentSongState>((set) => ({
  currentSongID: null,
  action: null,
  isLooped: "false",
  isShuffle: false,
  setIsLooped: (isLooped) => set({ isLooped }),
  setIsShuffle: (isShuffle) => set({ isShuffle }),
  setAction: (action) => set({ action }),
  setCurrentSongID: (url) => set({ currentSongID: url }),
}));
