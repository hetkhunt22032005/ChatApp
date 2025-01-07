import { create } from "zustand";

export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  setUser: (user, token) => set({ user: user, token: token }),
}));
