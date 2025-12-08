"use client";

import { useEffect, useState } from "react";
import { authApi } from "@/lib/api";

// --------------------- Types ---------------------
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

export interface UserProgress {
  dayStreak: number;
  totalWords: number;
  totalLessons: number;
  overallAccuracy: number;
  dailyGoal: number;
  lastActivityDate: string;
}

export interface UserData {
  id: string;
  firstName: string;
  lastName: string;
  age: string;
  hobbies: string;
  email: string;
  profilePic: string | null;
  role: "USER" | "ADMIN" | string;
  isVerified: boolean;
  isSubscribed: boolean;
  planExpiration: string | null;
  isSubscriptionFree: boolean;
  Profile: any | null;
  Subscription: Subscription | null;
  language: string;
  userType: string;
  createdAt: string;
  updatedAt: string;
  userProgress: UserProgress;
}

interface UserResponse {
  success: boolean;
  message: string;
  data: UserData;
}

// --------------------- Hook ---------------------
const useGetMe = (): {
  data: UserData | null;
  loading: boolean;
  error: any;
} => {
  const [data, setData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await authApi.getProfile();

        if (isMounted) {
          setData(res.data);
        }
      } catch (err) {
        console.error(err);
        if (isMounted) setError(err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  return { data, loading, error };
};

export default useGetMe;
