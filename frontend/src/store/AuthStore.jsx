import { create } from "zustand";

const useAuthStore = create((set) => ({
  user: null,
  token: null,
  setUser: (user, token) => set({ user: user, token: token }),
}));

export default useAuthStore;
