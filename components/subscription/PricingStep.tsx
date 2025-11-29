// components/subscription/PricingStep.tsx
"use client";
import Heading from "@/components/shared/Heading";
import { useAuthStore } from "@/stores/authStore";
import { FaCheck } from "react-icons/fa";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

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

interface PricingStepProps {
  plans: Plan[];
  onSelectPlan: (plan: Plan) => void;
}

export default function PricingStep({ plans, onSelectPlan }: PricingStepProps) {
  const { isAuthenticated, user } = useAuthStore();
  const router = useRouter();

  console.log(user, "user in pricing step");
  // Format price for display
  const Subscription = user?.Subscription;
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

  const handlePlanClick = (plan: Plan) => {
    if (plan.planName.toLowerCase() === "free") {
      return;
    }
    if (!isAuthenticated) {
      router.push("/signin");
      return;
    }
    onSelectPlan(plan);
  };

  const handlePlanStart = (plan: Plan) => {
    if (Subscription !== null) {
      Swal.fire({
        title: "You have an Active Subscription",
        text: "You already have an active subscription with us.",
        icon: "info",
        draggable: true,
        showCancelButton: true,
        confirmButtonText: "Manage subscription",
        cancelButtonText: "Close",
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.href = "/profile";
        }
      });
      return; // Stop here
    }

    // 👉 If no subscription → continue
    Swal.fire({
      title: `Start ${plan?.planName} Plan?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, start",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        console.log("Start plan API call here");
      }
    });
  };

  return (
    <>
      <Heading
        heading="Choose Your Learning Path"
        subheading="Start your journey with our free trial, then choose the plan that fits your learning goals"
        specialText="Learning Path"
        align="center"
      />
      <div className="mt-2 flex flex-col md:flex-row gap-6 w-full justify-center">
        {plans.map((plan, idx) => (
          <div
            key={plan.id}
            className={`flex-1 p-8 rounded-2xl flex flex-col justify-between cursor-pointer ${
              idx === 1 // Always highlight the second plan
                ? "relative z-0"
                : "bg-gradient-to-br from-[#2B2E4E] to-[#12132F] border border-gray-700"
            }`}
            onClick={() => handlePlanClick(plan)}
          >
            {idx === 1 && (
              <div className="absolute inset-0 rounded-2xl p-[2px] bg-gradient-to-r from-gradient-from via-gradient-via to-gradient-to z-[-1]">
                <div className="bg-[#171045] rounded-2xl h-full w-full"></div>
              </div>
            )}

            <div className="flex flex-col gap-4 relative z-10">
              <div className="w-full flex items-center flex-col gap-2">
                <h3 className="text-xl font-semibold">{plan.planName}</h3>
                <p className="text-3xl font-bold">{formatPrice(plan)}</p>
                <span className="text-sm font-normal">
                  {formatDuration(plan)}
                </span>
              </div>
              <ul className="flex flex-col gap-2 mt-4">
                {plan.features.map((feature, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-2 text-gray-200 tracking-wider"
                  >
                    <FaCheck className="text-green-500" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            {idx === 1 ? (
              // Middle Plan Button
              <button
                onClick={() => handlePlanStart(plan)}
                className={`mt-12 py-2.5 w-full rounded-xl bg-gradient-brand flex items-center justify-center gap-2 font-semibold hover:opacity-90 transition cursor-pointer ${
                  !isAuthenticated ? "opacity-70" : ""
                }`}
              >
                Start With {plan.planName}
              </button>
            ) : (
              // Other Plan Buttons
              <button
                onClick={handlePlanStart ? () => handlePlanStart(plan) : undefined}
                className={`relative mt-12 py-2.5 w-full rounded-xl bg-gradient-brand h-[44px] ${
                  !isAuthenticated || plan?.planName === "free"
                    ? "opacity-40 cursor-no-drop"
                    : "cursor-pointer"
                }`}
              >
                <div className="absolute inset-[1px] bg-gradient-to-br from-[#2E2E43] via-[#2C2C41] to-[#27273B] rounded-xl p-2 flex justify-center items-center">
                  <h1 className="text-gradient font-semibold">
                    Start With {plan.planName} Plan
                  </h1>
                </div>
              </button>
            )}

            {/* Buttons */}
          </div>
        ))}
      </div>
    </>
  );
}
