// components/subscription/BillingStep.tsx
"use client";
import { useState } from "react";
import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import { FaArrowRightLong } from "react-icons/fa6";

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
  paymentIntent: any;
  onBack: () => void;
  onPaymentSuccess: () => void;
}

export default function BillingStep({
  selectedPlan,
  onBack,
  onPaymentSuccess,
}: BillingStepProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [billingDetails, setBillingDetails] = useState({
    name: "",
    email: "",
    phone: "",
    address: {
      line1: "",
      line2: "",
      city: "",
      state: "",
      postal_code: "",
      country: "US", // Default country
    },
  });

  const formatPrice = (plan: Plan) => {
    if (plan.amount === 0) return "Free";
    return `$${plan.amount}/${plan.interval === "month" ? "mo" : "yr"}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      setErrorMessage("Payment system is not ready. Please try again.");
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/subscription`,
          payment_method_data: {
            billing_details: {
              name: billingDetails.name || "Customer", // Fallback name
              email: billingDetails.email,
              phone: billingDetails.phone,
              address: {
                line1: billingDetails.address.line1,
                line2: billingDetails.address.line2,
                city: billingDetails.address.city,
                state: billingDetails.address.state,
                postal_code: billingDetails.address.postal_code,
                country: billingDetails.address.country,
              },
            },
          },
        },
        redirect: "if_required",
      });

      if (error) {
        setErrorMessage(error.message || "Payment failed. Please try again.");
        setIsProcessing(false);
      } else {
        // Payment succeeded
        onPaymentSuccess();
        console.log("check payment is complete ===========NAHIAN");
        localStorage.removeItem("subscription_change_route");
      }
    } catch (error: any) {
      setErrorMessage(error.message || "An unexpected error occurred.");
      setIsProcessing(false);
    }
  };

  // Update billing details from form inputs
  const handleBillingDetailChange = (field: string, value: string) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".");
      if (parent === "address") {
        setBillingDetails((prev) => ({
          ...prev,
          address: {
            ...prev.address,
            [child]: value,
          },
        }));
      }
    } else {
      setBillingDetails((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
      {/* Left Section - Billing & Payment Form */}
      <div className="flex-1 bg-[#232339] p-8 rounded-xl">
        <h2 className="text-xl sm:text-2xl font-semibold mb-8">
          Billing Information
        </h2>

        {errorMessage && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500 rounded-xl text-red-200">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Billing Details Form */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Contact Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="John Doe"
                  className="w-full p-3 rounded-xl bg-[#2B2E4E] border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                  value={billingDetails.name}
                  onChange={(e) =>
                    handleBillingDetailChange("name", e.target.value)
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="john@example.com"
                  className="w-full p-3 rounded-xl bg-[#2B2E4E] border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                  value={billingDetails.email}
                  onChange={(e) =>
                    handleBillingDetailChange("email", e.target.value)
                  }
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                placeholder="+1 (555) 000-0000"
                className="w-full p-3 rounded-xl bg-[#2B2E4E] border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                value={billingDetails.phone}
                onChange={(e) =>
                  handleBillingDetailChange("phone", e.target.value)
                }
              />
            </div>
          </div>

          {/* Address Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Address Information</h3>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Street Address *
              </label>
              <input
                type="text"
                required
                placeholder="123 Main St"
                className="w-full p-3 rounded-xl bg-[#2B2E4E] border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                value={billingDetails.address.line1}
                onChange={(e) =>
                  handleBillingDetailChange("address.line1", e.target.value)
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Apartment, Suite, etc. (Optional)
              </label>
              <input
                type="text"
                placeholder="Apt 4B"
                className="w-full p-3 rounded-xl bg-[#2B2E4E] border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                value={billingDetails.address.line2}
                onChange={(e) =>
                  handleBillingDetailChange("address.line2", e.target.value)
                }
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  City *
                </label>
                <input
                  type="text"
                  required
                  placeholder="New York"
                  className="w-full p-3 rounded-xl bg-[#2B2E4E] border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                  value={billingDetails.address.city}
                  onChange={(e) =>
                    handleBillingDetailChange("address.city", e.target.value)
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  State *
                </label>
                <input
                  type="text"
                  required
                  placeholder="NY"
                  className="w-full p-3 rounded-xl bg-[#2B2E4E] border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                  value={billingDetails.address.state}
                  onChange={(e) =>
                    handleBillingDetailChange("address.state", e.target.value)
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  ZIP Code *
                </label>
                <input
                  type="text"
                  required
                  placeholder="10001"
                  className="w-full p-3 rounded-xl bg-[#2B2E4E] border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                  value={billingDetails.address.postal_code}
                  onChange={(e) =>
                    handleBillingDetailChange(
                      "address.postal_code",
                      e.target.value
                    )
                  }
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Country *
              </label>
              <select
                required
                className="w-full p-3 rounded-xl bg-[#2B2E4E] border border-gray-600 text-white focus:outline-none focus:border-purple-500"
                value={billingDetails.address.country}
                onChange={(e) =>
                  handleBillingDetailChange("address.country", e.target.value)
                }>
                <option value="US">United States</option>
                <option value="CA">Canada</option>
                <option value="GB">United Kingdom</option>
                <option value="AU">Australia</option>
                <option value="DE">Germany</option>
                <option value="FR">France</option>
                <option value="JP">Japan</option>
                {/* Add more countries as needed */}
              </select>
            </div>
          </div>

          {/* Payment Element */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Payment Details</h3>
            <PaymentElement
              options={{
                layout: "tabs",
                fields: {
                  billingDetails: {
                    name: "never", // We collect name in our form
                    email: "never", // We collect email in our form
                    phone: "never", // We collect phone in our form
                    address: {
                      country: "never", // We collect country in our form
                      line1: "never",
                      line2: "never",
                      city: "never",
                      state: "never",
                      postalCode: "never",
                    },
                  },
                },
              }}
            />
          </div>

          {/* Buttons */}
          <div className="flex flex-col gap-4 mt-8">
            <button
              type="submit"
              disabled={!stripe || isProcessing}
              className="w-full py-3.5 rounded-xl bg-gradient-brand text-white font-semibold hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Processing...
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
              className="relative py-2.5 w-full rounded-xl bg-gradient-brand h-12 cursor-pointer disabled:opacity-50">
              <div className="absolute inset-[1px] bg-[#3E3E51] rounded-xl p-2 flex justify-center items-center">
                <h1 className="text-gradient font-semibold">Go Back</h1>
              </div>
            </button>
          </div>
        </form>
      </div>

      {/* Right Section - Order Summary */}
      <div className="flex-1 bg-[#232339] rounded-xl p-8">
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
                  className="flex items-center gap-2 text-gray-300 text-sm">
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
