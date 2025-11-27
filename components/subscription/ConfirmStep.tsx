// components/subscription/ConfirmStep.tsx
"use client";
import toast from "react-hot-toast";
import { FaCheck, FaArrowRightLong } from "react-icons/fa6";

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

interface ConfirmStepProps {
  selectedPlan: Plan;
  onNext: () => void;
  onBack: () => void;
  isAuthenticated: boolean;
}

export default function ConfirmStep({
  selectedPlan,
  onNext,
  onBack,
  isAuthenticated,
}: ConfirmStepProps) {
  const formatPrice = (plan: Plan) => {
    if (plan.amount === 0) return "Free";

    const intervalText =
      plan.interval === "month"
        ? "mo"
        : plan.interval === "year"
        ? "yr"
        : plan.interval;

    return `$${plan.amount}/${intervalText}`;
  };

  const formatDuration = (plan: Plan) => {
    if (plan.amount === 0) return "7-day trial";

    if (plan.interval === "lifetime") return "Lifetime access";

    const intervalCount = plan.intervalCount > 1 ? plan.intervalCount : "";
    const intervalText =
      plan.interval === "month"
        ? "month"
        : plan.interval === "year"
        ? "year"
        : plan.interval;

    return `Billed every ${intervalCount} ${intervalText}${
      plan.intervalCount > 1 ? "s" : ""
    }`;
  };

  const handleNextClick = () => {
    if (!isAuthenticated) {
      toast.error("Please login to continue with subscription");
      return;
    }
    onNext();
  };

  return (
    <div className="flex flex-col gap-6 w-full justify-center max-w-4xl">
      <div className="w-full max-w-7xl mx-auto flex flex-col gap-3 mb-10 text-center md:text-start">
        <h1 className="text-3xl sm:text-4xl font-semibold">
          Confirm Your Plan
        </h1>
        <p className="text-base sm:text-lg">
          Start your journey with our free trial, then choose the plan that fits
          your learning goals
        </p>
      </div>

      <div className="w-full flex flex-col md:flex-row gap-8 items-center justify-center">
        {/* Left Section (40% width) */}
        <div className="lg:w-[40%] flex justify-between flex-col">
          <div className="w-full flex items-center justify-center mb-6">
            <h1 className="text-xl md:text-2xl font-semibold text-gradient">
              Selected Plan
            </h1>
          </div>
          <div className="p-6 rounded-xl border-[2px] border-gradient-to-br from-purple-500 via-pink-500 to-blue-500">
            <h3 className="text-xl font-semibold mb-3">
              {selectedPlan.planName}
            </h3>
            <p className="text-3xl font-bold mb-2">
              {formatPrice(selectedPlan)}
            </p>
            <p className="text-gray-300 text-sm mb-6">
              {formatDuration(selectedPlan)}
            </p>
            <ul className="flex flex-col gap-3">
              {selectedPlan.features.map((feature, i) => (
                <li key={i} className="flex items-center gap-2 text-gray-200">
                  <FaCheck className="text-green-500" /> {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>
        {/* Right Section (60% width) */}
        <div className="lg:w-[60%] bg-gradient-to-br from-[#2B2E4E] via-[#12132F] to-[#12132F] rounded-xl p-8 flex flex-col gap-4">
          <h3 className="text-xl md:text-2xl font-semibold mb-2">
            Plan Summary
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between text-gray-300">
              <span>Plan Selected</span>
              <span className="text-white/80 font-semibold">
                {selectedPlan.planName}
              </span>
            </div>
            <div className="flex justify-between text-gray-300">
              <span>Billing Frequency</span>
              <span className="text-white/80 font-semibold">
                {selectedPlan.interval === "month"
                  ? "Monthly"
                  : selectedPlan.interval === "year"
                  ? "Yearly"
                  : selectedPlan.interval}
              </span>
            </div>
            <div className="flex justify-between text-gray-300">
              <span>Price</span>
              <span className="text-white/80 font-semibold">
                {formatPrice(selectedPlan)}
              </span>
            </div>
            <div className="flex justify-between text-gray-300">
              <span>Next Payment</span>
              <span className="text-white/80 font-semibold">
                {new Date().toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>
          <div className="border border-gray-500" />
          <div className="flex justify-between font-semibold text-white text-lg mt-2">
            <span>Total</span>
            <span className="text-white/80 font-semibold">
              {formatPrice(selectedPlan)}
            </span>
          </div>

          {/* Buttons */}
          <button
            className="mt-4 py-2.5 w-full rounded-xl bg-gradient-brand flex items-center justify-center gap-2 font-semibold hover:opacity-90 transition cursor-pointer"
            onClick={handleNextClick}
          >
            {isAuthenticated ? "Proceed to Payment" : "Login to Continue"}
            <FaArrowRightLong className="w-5 h-5" />
          </button>
          <button
            className="relative mt-2 py-2.5 w-full rounded-xl bg-gradient-brand h-10 cursor-pointer"
            onClick={onBack}
          >
            <div className="absolute inset-[1px] bg-[#0B0C23] rounded-xl p-2 flex justify-center items-center">
              <h1 className="text-gradient font-semibold">Go Back</h1>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
