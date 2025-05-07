import { create } from "zustand";

interface TokenState {
  accessToken: string | null;
  setAccessToken: (token: string | null) => void;
  refreshToken: string | null;
  setRefreshToken: (token: string | null) => void;
}

export const useTokenStore = create<TokenState>((set) => ({
  accessToken: null,
  setAccessToken: (token) => set({ accessToken: token }),
  refreshToken: null,
  setRefreshToken: (token) => set({ refreshToken: token }),
}));
