import { create } from "zustand";

interface CurrentSongState {
  currentSongID: {
    url: string | null;
    autoPlay: boolean;
  };
  action: "Play" | "Pause" | null;
  isLooped: "false" | "all" | "one";
  isLoading: boolean;
  isShuffle: boolean;
  isLyric: boolean;
  setIsLyric: (isLyric: boolean) => void;
  setIsLoading: (isLoading: boolean) => void;
  setIsLooped: (isLooped: "false" | "all" | "one") => void;
  setIsShuffle: (isShuffle: boolean) => void;
  setAction: (action: "Play" | "Pause" | null) => void;
  setCurrentSongID: (url: string | null, autoPlay: boolean) => void;
}

export const useCurrentSongStore = create<CurrentSongState>((set) => ({
  currentSongID: {
    url: null,
    autoPlay: false,
  },
  action: null,
  isLooped: "false",
  isShuffle: false,
  isLyric: false,
  isLoading: false,
  setIsLoading: (isLoading) => set({ isLoading }),
  setIsLyric: (isLyric) => set({ isLyric }),
  setIsLooped: (isLooped) => set({ isLooped }),
  setIsShuffle: (isShuffle) => set({ isShuffle }),
  setAction: (action) => set({ action }),
  setCurrentSongID: (url,autoPlay) => set({ currentSongID: { url, autoPlay } }),
}));
