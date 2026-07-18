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
  subscriptionData: any;
  onBack: () => void;
  onPaymentSuccess: (successData?: any) => void;
}

export default function BillingWrapper({
  selectedPlan,
  subscriptionData,
  onBack,
  onPaymentSuccess,
}: BillingWrapperProps) {
  return (
    <Elements stripe={stripePromise}>
      <BillingStep
        selectedPlan={selectedPlan}
        subscriptionData={subscriptionData}
        onBack={onBack}
        onPaymentSuccess={onPaymentSuccess}
      />
    </Elements>
  );
}
