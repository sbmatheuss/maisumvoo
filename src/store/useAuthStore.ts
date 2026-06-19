import { create } from "zustand";

interface AuthUser {
  id: string;
  email: string;
  name: string;
}

interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  isInitialized: boolean;
  setUser: (user: AuthUser | null) => void;
  fetchUser: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  isInitialized: false,

  setUser: (user) => set({ user }),

  fetchUser: async () => {
    set({ isLoading: true });
    try {
      const res = await fetch("/api/auth/me");
      const json = await res.json();
      set({ user: json.data ?? null });
    } catch {
      set({ user: null });
    } finally {
      set({ isLoading: false, isInitialized: true });
    }
  },

  logout: async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      set({ user: null });
    }
  },
}));
