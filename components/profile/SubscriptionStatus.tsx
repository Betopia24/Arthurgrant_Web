"use client";
import React from "react";
import { FaCheck } from "react-icons/fa";
import { IoDiamond } from "react-icons/io5";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface Plan {
  id: string;
  planName: string;
  amount: number;
  PlanType: string;
  currency: string;
  interval: string;
  intervalCount: number;
  freeTrialDays: number | null;
  productId: string;
  priceId: string;
  active: boolean;
  description: string;
  maxMembers: number;
  features: string[];
  createdAt: string;
  updatedAt: string;
}

interface SubscriptionStatusProps {
  user: any;
  plans: Plan[];
  isLoadingPlans: boolean;
}

export function SubscriptionStatus({ user, plans, isLoadingPlans }: SubscriptionStatusProps) {
  const router = useRouter();

  // Get user's current plan data
  const getUserCurrentPlan = () => {
    if (!user) return null;

    // If user has a subscription, find the corresponding plan
    if (user.Subscription && user.Subscription.plan) {
      return user.Subscription.plan;
    }

    // If no subscription but isSubscriptionFree is false, find Premium plan
    if (user.isSubscriptionFree === false) {
      return plans.find(plan => plan.planName === "Premium") || plans.find(plan => plan.planName === "Family");
    }

    // Free trial user - find Free Trial plan
    return plans.find(plan => plan.planName === "Free Trial");
  };

  // Determine user plan status
  const getUserPlanStatus = () => {
    const currentPlan = getUserCurrentPlan();
    return currentPlan?.planName || "Free Trial";
  };

  // Get plan data for display
  const getUserPlanData = () => {
    const currentPlan = getUserCurrentPlan();
    
    if (!currentPlan) {
      // Fallback data if no plan found
      return {
        title: "Free Trial",
        price: "$0",
        duration: "7-day trial",
        features: ["5 Lessons per day", "Basic progress tracking", "Limited reward content", "Mercury AI guidance"],
        buttonText: "Upgrade Plan",
        isPaid: false,
      };
    }

    return {
      title: currentPlan.planName,
      price: `$${currentPlan.amount}`,
      duration: currentPlan.interval === "month" ? "per month" : 
                currentPlan.interval === "week" ? "per week" : 
                currentPlan.interval === "year" ? "per year" : "lifetime",
      features: currentPlan.features || [],
      buttonText: user?.isSubscriptionFree === false ? "Current Plan" : "Upgrade Plan",
      isPaid: user?.isSubscriptionFree === false,
    };
  };

  const getSubscriptionDetails = () => {
    if (!user?.Subscription) return null;

    return {
      planName: user.Subscription.plan?.planName || "Premium",
      startDate: new Date(user.Subscription.startDate).toLocaleDateString(),
      endDate: new Date(user.Subscription.endDate).toLocaleDateString(),
      paymentStatus: user.Subscription.paymentStatus,
      amount: user.Subscription.amount,
      currency: user.Subscription.plan?.currency || "USD",
    };
  };

  const handleUpgradePlan = () => {
    router.push("/pricing");
  };

  const handleManageSubscription = () => {
    router.push("/pricing");
  };

  const userPlanData = getUserPlanData();
  const subscriptionDetails = getSubscriptionDetails();

  return (
    <div className="bg-gradient-to-br from-[#28284A] to-[#12122A] text-white p-6 rounded-2xl">
      <h1 className="text-xl mb-2 sm:text-2xl font-semibold">
        Subscription Status
      </h1>

      {isLoadingPlans ? (
        <div className="flex justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-gray-500" />
        </div>
      ) : userPlanData.isPaid ? (
        // PAID USER - Has active subscription
        <>
          <p className="text-lg sm:text-xl text-gradient inline-block font-semibold">
            {userPlanData.title} Plan
          </p>
          
          {/* Subscription details for paid users */}
          {subscriptionDetails && (
            <div className="mt-4 text-sm text-gray-300">
              <p>Start Date: {subscriptionDetails.startDate}</p>
              <p>End Date: {subscriptionDetails.endDate}</p>
              <p>Status: <span className="text-green-400">{subscriptionDetails.paymentStatus}</span></p>
            </div>
          )}
          
          <ul className="flex flex-col gap-3 mt-6">
            {userPlanData.features.map((feature: string, index: number) => (
              <li
                key={index}
                className="flex items-center gap-2 text-gray-200"
              >
                <FaCheck className="text-green-500" /> {feature}
              </li>
            ))}
          </ul>
          
          <div className="mt-8 flex flex-col gap-3">
            {/* Current Plan Button - Non clickable */}
            <button
              disabled
              className="py-2.5 rounded-xl bg-gradient-brand flex items-center justify-center gap-2 font-semibold opacity-70 cursor-not-allowed"
            >
              Current Plan
            </button>
            
            {/* Manage Subscription - Still clickable */}
            <button
              onClick={handleManageSubscription}
              className="py-2.5 rounded-xl border border-gray-600 bg-transparent text-gray-300 flex items-center justify-center gap-2 font-semibold hover:bg-gray-700 transition cursor-pointer"
            >
              Manage Subscription
            </button>
          </div>
        </>
      ) : (
        // FREE TRIAL USER
        <>
          <p className="text-lg sm:text-xl text-gray-400 inline-block font-semibold">
            {userPlanData.title}
          </p>
          <p className="text-gray-400 mt-2 text-sm">
            {userPlanData.duration}
          </p>
          
          <ul className="flex flex-col gap-3 mt-6">
            {userPlanData.features.map((feature: string, index: number) => (
              <li
                key={index}
                className="flex items-center gap-2 text-gray-200"
              >
                <FaCheck className="text-green-500" /> {feature}
              </li>
            ))}
          </ul>
          
          <div className="mt-8">
            <button
              onClick={handleUpgradePlan}
              className="w-full py-2.5 rounded-xl bg-gradient-brand flex items-center justify-center gap-2 font-semibold hover:opacity-90 transition cursor-pointer"
            >
              Upgrade to Premium
            </button>
          </div>
        </>
      )}
    </div>
  );
}