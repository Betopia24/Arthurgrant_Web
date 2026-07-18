// components/subscription/BillingStep.tsx
"use client";
import { useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { useSubscription } from "@/hooks/useSubscription";
import { FaArrowRightLong, FaCreditCard, FaLock } from "react-icons/fa6";

import toast from "react-hot-toast";

interface Plan {
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

interface BillingStepProps {
  selectedPlan: Plan;
  subscriptionData?: any;
  onBack: () => void;
  onPaymentSuccess: (successData?: any) => void;
}

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: "#ffffff",
      fontFamily: "Inter, system-ui, sans-serif",
      fontSmoothing: "antialiased",
      fontSize: "16px",
      "::placeholder": {
        color: "#9ca3af",
      },
      iconColor: "#a855f7",
    },
    invalid: {
      color: "#ef4444",
      iconColor: "#ef4444",
    },
  },
};

export default function BillingStep({
  selectedPlan,
  onBack,
  onPaymentSuccess,
}: BillingStepProps) {
  const stripe = useStripe();
  const elements = useElements();
  const { confirmPayment, refreshUserSubscription } = useSubscription();

  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [name, setName] = useState("");

  const formatPrice = (plan: Plan) => {
    if (plan.amount === 0) return "Free";
    return `$${plan.amount}/${plan.interval === "month" ? "mo" : "yr"}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      setErrorMessage("Stripe has not loaded yet. Please refresh the page.");
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setErrorMessage("Card component not found.");
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      // Step 2: Create Stripe Payment Method using official Stripe CardElement
      const { paymentMethod, error: stripeError } =
        await stripe.createPaymentMethod({
          type: "card",
          card: cardElement,
          billing_details: {
            name: name || undefined,
          },
        });

      if (stripeError || !paymentMethod) {
        throw new Error(
          stripeError?.message || "Failed to process card details."
        );
      }

      // Step 3: Confirm Payment with backend using paymentMethod.id
      const confirmRes = await confirmPayment(paymentMethod.id);

      if (confirmRes.success) {
        await refreshUserSubscription();
        onPaymentSuccess(confirmRes.data);
      } else {
        throw new Error(confirmRes.message || "Payment confirmation failed.");
      }
    } catch (error: any) {
      const msg = error.message || "An unexpected error occurred during payment.";
      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
      {/* Left Section - Payment Form */}
      <div className="flex-1 bg-[#232339] p-8 rounded-xl border border-gray-700 shadow-xl">
        <h2 className="text-xl sm:text-2xl font-semibold mb-6 flex items-center justify-between">
          <span className="flex items-center gap-3">
            <FaCreditCard className="text-purple-400" />
            Payment Information
          </span>
          <span className="flex items-center gap-1 text-xs font-normal text-gray-400 bg-white/5 px-3 py-1 rounded-full border border-white/10">
            <FaLock className="text-green-400" /> Encrypted & Secure
          </span>
        </h2>

        {errorMessage && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 text-sm">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Cardholder Name */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Cardholder Name *
            </label>
            <input
              type="text"
              required
              placeholder="John Doe"
              className="w-full p-3.5 rounded-xl bg-[#2B2E4E] border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Official Stripe Card Element */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Card Details *
            </label>
            <div className="p-4 rounded-xl bg-[#2B2E4E] border border-gray-600 focus-within:border-purple-500 transition">
              <CardElement options={CARD_ELEMENT_OPTIONS} />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-4 mt-8">
            <button
              type="submit"
              disabled={!stripe || isProcessing}
              className="w-full py-3.5 rounded-xl bg-gradient-brand text-white font-semibold hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Confirming Payment...
                </>
              ) : (
                <>
                  Pay Now - {formatPrice(selectedPlan)}
                  <FaArrowRightLong className="w-4 h-4" />
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onBack}
              disabled={isProcessing}
              className="relative py-2.5 w-full rounded-xl bg-gradient-brand h-12 cursor-pointer disabled:opacity-50"
            >
              <div className="absolute inset-[1px] bg-[#3E3E51] rounded-xl p-2 flex justify-center items-center">
                <h1 className="text-gradient font-semibold">Go Back</h1>
              </div>
            </button>
          </div>
        </form>
      </div>

      {/* Right Section - Order Summary */}
      <div className="flex-1 bg-[#232339] rounded-xl p-8 border border-gray-700 shadow-xl">
        <h2 className="text-xl sm:text-2xl font-semibold mb-8">
          Order Summary
        </h2>

        <div className="space-y-6">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-white">
                {selectedPlan.planName}
              </h3>
              <p className="text-gray-300 text-sm mt-1">
                {selectedPlan.description}
              </p>
            </div>
            <span className="font-semibold text-white">
              {formatPrice(selectedPlan)}
            </span>
          </div>

          <div className="border-t border-gray-600 pt-4">
            <div className="space-y-2">
              <div className="flex justify-between text-gray-300">
                <span>Plan</span>
                <span>{selectedPlan.planName}</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>Billing Cycle</span>
                <span>
                  {selectedPlan.interval === "month"
                    ? "Monthly"
                    : selectedPlan.interval === "year"
                    ? "Yearly"
                    : selectedPlan.interval}
                </span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>Features Included</span>
                <span>{selectedPlan.features.length}</span>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-600 pt-4">
            <div className="flex justify-between font-semibold text-white text-lg">
              <span>Total</span>
              <span>{formatPrice(selectedPlan)}</span>
            </div>
          </div>

          {/* Features List */}
          <div className="mt-6">
            <h4 className="font-semibold text-white mb-3">What's included:</h4>
            <ul className="space-y-2">
              {selectedPlan.features.map((feature, index) => (
                <li
                  key={index}
                  className="flex items-center gap-2 text-gray-300 text-sm"
                >
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
