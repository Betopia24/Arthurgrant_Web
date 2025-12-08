import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SubscriptionPlan {
  id: string;
  planName: string;
  amount: number;
  currency: string;
  interval: string;
  intervalCount: number;
  freeTrialDays: number | null;
  productId: string;
  priceId: string;
  active: boolean;
  description: string;
  maxMembers: number | null;
  features: string[];
  createdAt: string;
  updatedAt: string;
}

interface Subscription {
  id: string;
  userId: string;
  planId: string;
  startDate: string;
  endDate: string;
  amount: number;
  stripePaymentId: string;
  paymentStatus: string;
  createdAt: string;
  updatedAt: string;
  plan: SubscriptionPlan;
  members: any[];
}

interface User {
  id: string;
  firstName: string;
  lastName: string;
  age: string;
  hobbies: string;
  email: string;
  profilePic: string;
  role: string;
  isVerified: boolean;
  isSubscribed: boolean;
  isSubscriptionFree: boolean;
  planExpiration: string | null;
  Profile: any | null;
  Subscription: Subscription | null;
  language: string | null;
  userType: string;
  createdAt: string;
  updatedAt: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (accessToken: string) => void;
  logout: () => void;
  setUser: (user: User) => void;
  setLoading: (loading: boolean) => void;
  setToken: (token: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,
      login: (accessToken: string) =>
        set({ accessToken, isAuthenticated: true }),
      logout: () =>
        set({
          user: null,
          accessToken: null,
          isAuthenticated: false,
        }),
      setUser: (user: User) => set({ user }),
      setLoading: (isLoading: boolean) => set({ isLoading }),
      setToken: (accessToken: string) => set({ accessToken }),
    }),
    {
      name: "auth-storage",
    }
  )
);
