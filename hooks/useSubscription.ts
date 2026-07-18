import { useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { subscriptionApi } from '@/lib/api';

const extractErrorMessage = (err: any, fallback: string): string => {
  if (err.response?.data) {
    const data = err.response.data;
    if (data.message) return data.message;
    if (Array.isArray(data.errorMessages) && data.errorMessages.length > 0) {
      return data.errorMessages[0].message || fallback;
    }
    if (data.error?.message) return data.error.message;
  }
  if (err.message) return err.message;
  return fallback;
};

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
      const errorMessage = extractErrorMessage(err, 'Failed to create subscription');
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const createStripePaymentMethod = async (cardData: {
    number: string;
    exp_month: string;
    exp_year: string;
    cvc: string;
  }) => {
    try {
      setLoading(true);
      setError(null);

      const result = await subscriptionApi.createStripePaymentMethod(cardData);
      return result;
    } catch (err: any) {
      const errorMessage = extractErrorMessage(err, 'Failed to process card details');
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const confirmPayment = async (paymentMethodId: string) => {
    try {
      setLoading(true);
      setError(null);

      const result = await subscriptionApi.confirmPayment(paymentMethodId);
      return result;
    } catch (err: any) {
      const errorMessage = extractErrorMessage(err, 'Failed to confirm payment');
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const cancelSubscription = async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await subscriptionApi.cancelSubscription();
      return result;
    } catch (err: any) {
      const errorMessage = extractErrorMessage(err, 'Failed to cancel subscription');
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const reactivateSubscription = async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await subscriptionApi.reactivateSubscription();
      return result;
    } catch (err: any) {
      const errorMessage = extractErrorMessage(err, 'Failed to reactivate subscription');
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
      if (user && subscriptionData?.data) {
        setUser({
          ...user,
          isSubscribed: true,
          isSubscriptionFree: subscriptionData.data.plan?.amount === 0,
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
    createStripePaymentMethod,
    confirmPayment,
    cancelSubscription,
    reactivateSubscription,
    refreshUserSubscription,
    loading,
    error
  };
};