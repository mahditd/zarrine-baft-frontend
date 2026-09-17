import { create } from "zustand";
import { persist } from "zustand/middleware";

export type AuthUser = {
  id: number;
  full_name: string;
  phone: string;
  email?: string | null;

  role: string;

  company_name?: string | null;
  company_phone?: string | null;

  country?: string;
  address?: string;
};

type AuthStore = {
  user: AuthUser | null;
  token: string | null;

  isAuthenticated: boolean;

  updateUser: (user: AuthUser) => void;

  login: (user: AuthUser, token: string) => void;

  logout: () => void;
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,

      token: null,

      isAuthenticated: false,

      login: (user, token) =>
        set({
          user,
          token,
          isAuthenticated: true,
        }),

      updateUser: (user) =>
        set({
          user,
        }),

      logout: () =>
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        }),
    }),

    {
      name: "zarrine-auth",
    },
  ),
);
