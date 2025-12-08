import { useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { subscriptionApi } from '@/lib/api';

export const useSubscription = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, setUser } = useAuthStore();

  const createSubscription = async (planId: string) => {
    try {
      setLoading(true);
      setError(null);

      const result = await subscriptionApi.createSubscription(planId);
      return result;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to create subscription';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const refreshUserSubscription = async () => {
    try {
      const subscriptionData = await subscriptionApi.getMySubscription();
      // Update user subscription status in store
      if (user) {
        setUser({
          ...user,
          isSubscribed: true,
          isSubscriptionFree: subscriptionData.data.plan.amount === 0,
          planExpiration: subscriptionData.data.endDate,
          Subscription: subscriptionData.data
        });
      }
    } catch (error) {
      console.error('Failed to refresh subscription:', error);
    }
  };

  return {
    createSubscription,
    refreshUserSubscription,
    loading,
    error
  };
};