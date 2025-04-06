import { create } from "zustand";

interface AlbumCoverState {
  albumCover: string | null;
  setAlbumCover: (cover: string | null) => void;
}

export const useAlbumCoverStore = create<AlbumCoverState>((set) => ({
  albumCover: null,
  setAlbumCover: (cover) => set({ albumCover: cover }),
}));
