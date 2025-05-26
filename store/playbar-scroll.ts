import { create } from "zustand";

interface PlaybarScrollState {
  scroll: number;
  setScroll: (scroll: number) => void;
}

export const usePlaybarScrollStore = create<PlaybarScrollState>((set) => ({
  scroll: 0,
  setScroll: (scroll) => set({ scroll }),
}));
