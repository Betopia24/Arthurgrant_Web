// components/subscription/BillingWrapper.tsx
"use client";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import BillingStep from "./BillingStep";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

interface BillingWrapperProps {
  selectedPlan: any;
  paymentIntent: any;
  onBack: () => void;
  onPaymentSuccess: () => void;
}

export default function BillingWrapper({
  selectedPlan,
  paymentIntent,
  onBack,
  onPaymentSuccess,
}: BillingWrapperProps) {
  if (!paymentIntent?.clientSecret) {
    return (
      <div className="w-full max-w-7xl mx-auto flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
          <p className="mt-4 text-lg">Loading payment form...</p>
        </div>
      </div>
    );
  }

  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret: paymentIntent.clientSecret,
        appearance: {
          theme: "night",
          variables: {
            colorPrimary: "#6366f1",
            colorBackground: "#232339",
            colorText: "#ffffff",
            colorDanger: "#ef4444",
            fontFamily: "Inter, system-ui, sans-serif",
          },
        },
      }}
    >
      <BillingStep
        selectedPlan={selectedPlan}
        paymentIntent={paymentIntent}
        onBack={onBack}
        onPaymentSuccess={onPaymentSuccess}
      />
    </Elements>
  );
}
