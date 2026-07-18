// components/profile/SubscriptionStatus.tsx
"use client";
import React, { useState } from "react";
import { FaCheck } from "react-icons/fa";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import { useSubscription } from "@/hooks/useSubscription";

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

export function SubscriptionStatus({
  user,
  plans,
  isLoadingPlans,
}: SubscriptionStatusProps) {
  const router = useRouter();
  const { cancelSubscription, reactivateSubscription, refreshUserSubscription } =
    useSubscription();
  const [isUpdatingSub, setIsUpdatingSub] = useState(false);

  const isSubCanceled =
    user?.Subscription?.isCanceled || user?.Subscription?.cancelAtPeriodEnd;

  // Get user's current plan data
  const getUserCurrentPlan = () => {
    if (!user) return null;

    if (user.Subscription && user.Subscription.plan) {
      return user.Subscription.plan;
    }

    if (user.isSubscribed || user.isSubscriptionFree === false) {
      return (
        plans.find((plan) => plan.planName === "Premium") ||
        plans.find((plan) => plan.planName === "Family")
      );
    }

    return plans.find((plan) => plan.planName === "Free Trial");
  };

  const getUserPlanData = () => {
    const currentPlan = getUserCurrentPlan();
    const isPaidUser = Boolean(
      user?.isSubscribed ||
        user?.Subscription ||
        user?.isSubscriptionFree === false
    );

    if (!currentPlan) {
      return {
        title: "Free Trial",
        price: "$0",
        duration: "7-day trial",
        features: [
          "5 Lessons per day",
          "Basic progress tracking",
          "Limited reward content",
          "Mercury AI guidance",
        ],
        buttonText: "Upgrade Plan",
        isPaid: false,
      };
    }

    return {
      title: currentPlan.planName,
      price: `$${currentPlan.amount}`,
      duration:
        currentPlan.interval === "month"
          ? "per month"
          : currentPlan.interval === "week"
          ? "per week"
          : currentPlan.interval === "year"
          ? "per year"
          : "lifetime",
      features: currentPlan.features || [],
      buttonText: isPaidUser ? "Current Plan" : "Upgrade Plan",
      isPaid: isPaidUser,
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

  const handleCancelSub = async () => {
    Swal.fire({
      title: "Cancel Subscription?",
      text: "Are you sure you want to cancel your subscription? Your access will remain active until the end of your billing cycle.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Cancel Subscription",
      confirmButtonColor: "#ef4444",
      cancelButtonText: "Keep Subscription",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          setIsUpdatingSub(true);
          const res = await cancelSubscription();
          if (res.success) {
            toast.success(res.message || "Subscription canceled successfully.");
            await refreshUserSubscription();
          }
        } catch (err: any) {
          toast.error(err.message || "Failed to cancel subscription.");
        } finally {
          setIsUpdatingSub(false);
        }
      }
    });
  };

  const handleReactivateSub = async () => {
    Swal.fire({
      title: "Reactivate Subscription?",
      text: "Your subscription will automatically renew at the end of the current billing cycle.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Reactivate",
      confirmButtonColor: "#10b981",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          setIsUpdatingSub(true);
          const res = await reactivateSubscription();
          if (res.success) {
            toast.success(
              res.message || "Subscription reactivated successfully."
            );
            await refreshUserSubscription();
          }
        } catch (err: any) {
          toast.error(err.message || "Failed to reactivate subscription.");
        } finally {
          setIsUpdatingSub(false);
        }
      }
    });
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
          <div className="flex items-center justify-between mt-2">
            <div>
              <p className="text-lg sm:text-xl text-gradient inline-block font-semibold">
                {userPlanData.title} Plan
              </p>
              <p className="text-sm text-gray-400 mt-0.5">
                {userPlanData.price} / {userPlanData.duration}
              </p>
            </div>

            {isSubCanceled ? (
              <span className="px-3 py-1 bg-amber-500/20 border border-amber-500/50 text-amber-300 text-xs font-semibold rounded-full">
                Canceled
              </span>
            ) : (
              <span className="px-3 py-1 bg-green-500/20 border border-green-500/50 text-green-300 text-xs font-semibold rounded-full flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                Active Plan
              </span>
            )}
          </div>

          {/* Subscription details for paid users */}
          {subscriptionDetails && (
            <div className="mt-4 text-sm text-gray-300 space-y-1 bg-[#1F203B] p-3.5 rounded-xl border border-gray-700/60">
              <p className="flex justify-between">
                <span className="text-gray-400">Start Date:</span>
                <span>{subscriptionDetails.startDate}</span>
              </p>
              <p className="flex justify-between">
                <span className="text-gray-400">Renewal / End Date:</span>
                <span>{subscriptionDetails.endDate}</span>
              </p>
              <p className="flex justify-between">
                <span className="text-gray-400">Payment Status:</span>
                <span
                  className={
                    isSubCanceled ? "text-amber-400 font-semibold" : "text-green-400 font-semibold"
                  }
                >
                  {isSubCanceled
                    ? "Canceled (Access until end date)"
                    : subscriptionDetails.paymentStatus}
                </span>
              </p>
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
            {/* Current Plan Badge Button */}
            <button
              disabled
              className="py-2.5 rounded-xl bg-gradient-brand flex items-center justify-center gap-2 font-semibold opacity-70 cursor-not-allowed"
            >
              Current Plan
            </button>

            {/* Cancel or Reactivate Action Button */}
            {isSubCanceled ? (
              <button
                onClick={handleReactivateSub}
                disabled={isUpdatingSub}
                className="py-2.5 rounded-xl border border-green-500 bg-green-500/10 text-green-300 flex items-center justify-center gap-2 font-semibold hover:bg-green-500/20 transition cursor-pointer disabled:opacity-50"
              >
                {isUpdatingSub ? "Reactivating..." : "Reactivate Subscription"}
              </button>
            ) : (
              <button
                onClick={handleCancelSub}
                disabled={isUpdatingSub}
                className="py-2.5 rounded-xl border border-red-500/60 bg-red-500/10 text-red-300 flex items-center justify-center gap-2 font-semibold hover:bg-red-500/20 transition cursor-pointer disabled:opacity-50"
              >
                {isUpdatingSub ? "Canceling..." : "Cancel Subscription"}
              </button>
            )}
          </div>
        </>
      ) : (
        // FREE TRIAL USER
        <>
          <p className="text-lg sm:text-xl text-gray-400 inline-block font-semibold">
            {userPlanData.title}
          </p>
          <p className="text-gray-400 mt-2 text-sm">{userPlanData.duration}</p>

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