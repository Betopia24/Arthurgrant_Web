// components/subscription/SuccessStep.tsx
"use client";
import Link from "next/link";
import { FaCircleCheck } from "react-icons/fa6";

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

interface SuccessStepProps {
  selectedPlan: Plan;
}

export default function SuccessStep({ selectedPlan }: SuccessStepProps) {
  const formatPrice = (plan: Plan) => {
    if (plan.amount === 0) return "Free";
    return `$${plan.amount}/${plan.interval === "month" ? "mo" : "yr"}`;
  };

  return (
    <div className="w-full max-w-xl flex flex-col gap-8 bg-gradient-to-br from-[#28284A] to-[#12122A] text-white p-12 rounded-xl shadow-lg items-center justify-center text-center">
      <div className="bg-gradient-to-r from-green-500 via-green-600 to-green-700 p-4 rounded-full">
        <FaCircleCheck className="w-10 h-10" />
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="text-2xl font-semibold text-white">
          Payment Successful!
        </h2>
        <p className="text-gray-300 text-lg">
          Thank you for subscribing to <strong>{selectedPlan.planName}</strong>
        </p>
        <p className="text-gray-400">
          Your subscription is now active. You can start enjoying all the
          premium features immediately.
        </p>

        <div className="mt-4 p-4 bg-green-500/20 rounded-xl border border-green-500/30">
          <p className="text-green-300 font-semibold">
            Plan: {selectedPlan.planName} • {formatPrice(selectedPlan)}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3 w-full mt-4">
        <Link
          href="/profile"
          className="py-3 px-4 w-full rounded-xl font-semibold bg-gradient-brand hover:opacity-90 transition text-center"
        >
          Go to Dashboard
        </Link>
        <Link
          href="/"
          className="py-2.5 px-4 w-full rounded-xl font-semibold border border-gray-600 hover:bg-gray-700 transition text-center"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
