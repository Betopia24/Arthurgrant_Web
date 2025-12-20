"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { plansApi } from "@/lib/api";
import { useSubscription } from "@/hooks/useSubscription";
import PricingStep from "@/components/subscription/PricingStep";
import ConfirmStep from "@/components/subscription/ConfirmStep";
import SuccessStep from "@/components/subscription/SuccessStep";
import BillingWrapper from "@/components/subscription/BillingWrapper";
import { Plan } from "@/lib/types";

export default function SubscriptionPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const { createSubscription, refreshUserSubscription } = useSubscription();
  const [step, setStep] = useState<
    "pricing" | "confirm" | "billing" | "success"
  >("pricing");
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [paymentIntent, setPaymentIntent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Fetch plans from API
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true);
        const response = await plansApi.getAllPlans();
        setPlans(response.data);
      } catch (error) {
        console.error("Failed to fetch plans:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  // Check authentication when moving to billing step
  useEffect(() => {
    if (step === "billing" && !isAuthenticated) {
      router.push("/signin");
    }
  }, [step, isAuthenticated, router]);

  const handleSelectPlan = (plan: Plan) => {
    setSelectedPlan(plan);
    setStep("confirm");
  };

  const handleNextConfirm = async () => {
    if (!isAuthenticated) {
      router.push("/signin");
      return;
    }

    if (!selectedPlan) return;

    try {
      // Create subscription intent
      const result = await createSubscription(selectedPlan.id);
      setPaymentIntent(result.data);
      setStep("billing");
    } catch (error) {
      console.error("Failed to create subscription:", error);
    }
  };

  const handlePaymentSuccess = async () => {
    // Refresh user data to update subscription status
    await refreshUserSubscription();
    setStep("success");
  };

  const handleBack = () => {
    if (step === "confirm") {
      setStep("pricing");
    } else if (step === "billing") {
      setStep("confirm");
    }
  };

  if (loading) {
    return (
      <div className="pt-32 sm:pt-36 py-20 bg-gradient-to-br from-brand-dark via-brand-darker to-brand-darker text-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
          <p className="mt-4 text-lg">Loading plans...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 sm:pt-36 py-20 bg-gradient-to-br from-brand-dark via-brand-darker to-brand-darker text-white min-h-screen flex items-center justify-center">
      <div className="app-container flex flex-col items-center gap-12">
        {/* Step 1: Pricing */}
        {step === "pricing" && (
          <PricingStep plans={plans} onSelectPlan={handleSelectPlan} />
        )}

        {/* Step 2: Confirm Plan */}
        {step === "confirm" && selectedPlan && (
          <ConfirmStep
            selectedPlan={selectedPlan}
            onNext={handleNextConfirm}
            onBack={handleBack}
            isAuthenticated={isAuthenticated}
          />
        )}

        {/* Step 3: Billing */}
        {step === "billing" && selectedPlan && paymentIntent && (
          <BillingWrapper
            selectedPlan={selectedPlan}
            paymentIntent={paymentIntent}
            onBack={handleBack}
            onPaymentSuccess={handlePaymentSuccess}
          />
        )}

        {/* Step 4: Success */}
        {step === "success" && selectedPlan && (
          <SuccessStep selectedPlan={selectedPlan} />
        )}
      </div>
    </div>
  );
}
