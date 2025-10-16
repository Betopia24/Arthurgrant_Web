"use client";
import Heading from "@/components/shared/Heading";
import { plans } from "@/lib/constants";
import { ArrowBigRight, ArrowRight } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { FaCheck } from "react-icons/fa";
import { FaArrowRightLong, FaCircleCheck } from "react-icons/fa6";

export default function Page() {
  const [step, setStep] = useState<
    "pricing" | "confirm" | "billing" | "success"
  >("pricing");
  const [selectedPlan, setSelectedPlan] = useState<(typeof plans)[0] | null>(
    null
  );
  const [billingInfo, setBillingInfo] = useState({
    cardNumber: "",
    expiry: "",
    cvc: "",
  });
  const [isPaying, setIsPaying] = useState(false);

  const handleSelectPlan = (plan: (typeof plans)[0]) => {
    setSelectedPlan(plan);
    setStep("confirm");
  };

  const handleNextConfirm = () => {
    setStep("billing");
  };

  const handlePayNow = async () => {
    setIsPaying(true);
    // Mock API call
    await new Promise((res) => setTimeout(res, 1500));
    setIsPaying(false);
    setStep("success");
  };

  return (
    <div className="pt-32 sm:pt-36 py-20 bg-gradient-to-br from-brand-dark via-brand-darker to-brand-darker text-white min-h-screen flex items-center justify-center">
      <div className="app-container flex flex-col items-center gap-12">
        {/* Step 1: Pricing */}
        {step === "pricing" && (
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
                  key={idx}
                  className={`flex-1 p-8 rounded-2xl flex flex-col justify-between cursor-pointer ${
                    plan.highlight
                      ? "relative z-0"
                      : "bg-gradient-to-br from-[#2B2E4E] to-[#12132F] border border-gray-700"
                  }`}
                  onClick={() => handleSelectPlan(plan)}
                >
                  {plan.highlight && (
                    <div className="absolute inset-0 rounded-2xl p-[2px] bg-gradient-to-r from-gradient-from via-gradient-via to-gradient-to z-[-1]">
                      <div className="bg-[#171045] rounded-2xl h-full w-full"></div>
                    </div>
                  )}

                  <div className="flex flex-col gap-4 relative z-10">
                    <div className="w-full flex items-center flex-col gap-2">
                      <h3 className="text-xl font-semibold">{plan.title}</h3>
                      <p className="text-3xl font-bold">{plan.price}</p>
                      <span className="text-sm font-normal">
                        {plan.duration}
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

                  {/* Buttons */}
                  {idx === 1 ? (
                    <button className="mt-10 py-2.5 w-full rounded-xl bg-gradient-brand flex items-center justify-center gap-2 font-semibold hover:opacity-90 transition cursor-pointer">
                      Start With {plan.title} Plan
                    </button>
                  ) : (
                    <>
                      <button className="relative mt-10 py-2.5 w-full rounded-xl bg-gradient-brand h-[44px] cursor-pointer">
                        <div className="absolute inset-[1px] bg-gradient-to-br from-[#2E2E43] via-[#2C2C41] to-[#27273B] rounded-xl p-2 flex justify-center items-center">
                          <h1 className="text-gradient font-semibold">
                            Start With {plan.title} Plan
                          </h1>
                        </div>
                      </button>
                    </>
                  )}
                </div>
              ))}
            </div>
          </>
        )}

        {/* Step 2: Confirm Plan */}
        {step === "confirm" && selectedPlan && (
          <div className="flex flex-col gap-6 w-full justify-center max-w-4xl">
            <div className="w-full max-w-7xl mx-auto flex flex-col gap-3 mb-10 text-center md:text-start">
              <h1 className="text-3xl sm:text-4xl font-semibold">
                Confirm Your Plan
              </h1>
              <p className="text-base sm:text-lg">
                Start your journey with our free trial, then choose the plan
                that fits your learning goals
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
                    {selectedPlan.title}
                  </h3>
                  <p className="text-3xl font-bold mb-2">
                    {selectedPlan.price}
                  </p>
                  <p className="text-gray-300 text-sm mb-6">
                    {selectedPlan.duration}
                  </p>
                  <ul className="flex flex-col gap-3">
                    {selectedPlan.features.map((f, i) => (
                      <li
                        key={i}
                        className="flex items-center gap-2 text-gray-200"
                      >
                        <FaCheck className="text-green-500" /> {f}
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
                      {selectedPlan.title}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Billing Frequency</span>
                    <span className="text-white/80 font-semibold">Monthly</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Price</span>
                    <span className="text-white/80 font-semibold">
                      {selectedPlan.price}
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
                    {selectedPlan.price}
                  </span>
                </div>

                {/* Buttons */}
                <button
                  className="mt-4 py-2.5 w-full rounded-xl bg-gradient-brand flex items-center justify-center gap-2 font-semibold hover:opacity-90 transition cursor-pointer"
                  onClick={handleNextConfirm}
                >
                  Next
                  <FaArrowRightLong className="w-5 h-5" />
                </button>
                <button
                  className="relative mt-2 py-2.5 w-full rounded-xl bg-gradient-brand h-10 cursor-pointer"
                  onClick={() => setStep("pricing")}
                >
                  <div className="absolute inset-[1px] bg-[#0B0C23] rounded-xl p-2 flex justify-center items-center">
                    <h1 className="text-gradient font-semibold">Go Back</h1>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Billing */}
        {step === "billing" && selectedPlan && (
          <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
            {/* Left Form - Personal Info */}
            <div className="flex-1 bg-[#232339] p-8 rounded-xl">
              <h2 className="text-xl sm:text-2xl font-semibold mb-8">
                Personal Information
              </h2>
              <div className="flex flex-col lg:flex-row gap-4">
                <input
                  type="text"
                  placeholder="First Name"
                  className="flex-1 p-2.5 text-sm rounded-xl bg-transparent border-2 border-gray-600"
                  value={billingInfo.firstName}
                  onChange={(e) =>
                    setBillingInfo({
                      ...billingInfo,
                      firstName: e.target.value,
                    })
                  }
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  className="flex-1 p-2.5 text-sm rounded-xl bg-transparent border-2 border-gray-600"
                  value={billingInfo.lastName}
                  onChange={(e) =>
                    setBillingInfo({ ...billingInfo, lastName: e.target.value })
                  }
                />
              </div>
              <div className="flex flex-col lg:flex-row gap-4 mt-4">
                <input
                  type="text"
                  placeholder="Phone"
                  className="flex-1 p-2.5 text-sm rounded-xl bg-transparent border-2 border-gray-600"
                  value={billingInfo.phone}
                  onChange={(e) =>
                    setBillingInfo({ ...billingInfo, phone: e.target.value })
                  }
                />
                <input
                  type="email"
                  placeholder="Email"
                  className="flex-1 p-2.5 text-sm rounded-xl bg-transparent border-2 border-gray-600"
                  value={billingInfo.email}
                  onChange={(e) =>
                    setBillingInfo({ ...billingInfo, email: e.target.value })
                  }
                />
              </div>
              <div className="mt-4">
                <input
                  type="text"
                  placeholder="Country/Region"
                  className="w-full p-2.5 text-sm rounded-xl bg-transparent border-2 border-gray-600"
                  value={billingInfo.country}
                  onChange={(e) =>
                    setBillingInfo({ ...billingInfo, country: e.target.value })
                  }
                />
              </div>
              <div className="mt-4">
                <textarea
                  placeholder="Address"
                  className="w-full p-2.5 text-sm rounded-xl bg-transparent border-2 border-gray-600 min-h-[100px]"
                  value={billingInfo.address}
                  onChange={(e) =>
                    setBillingInfo({ ...billingInfo, address: e.target.value })
                  }
                />
              </div>
              <div className="flex flex-col lg:flex-row gap-4 mt-4">
                <input
                  type="text"
                  placeholder="City"
                  className="flex-1 p-2.5 text-sm rounded-xl bg-transparent border-2 border-gray-600"
                  value={billingInfo.city}
                  onChange={(e) =>
                    setBillingInfo({ ...billingInfo, city: e.target.value })
                  }
                />
                <input
                  type="text"
                  placeholder="State"
                  className="flex-1 p-2.5 text-sm rounded-xl bg-transparent border-2 border-gray-600"
                  value={billingInfo.state}
                  onChange={(e) =>
                    setBillingInfo({ ...billingInfo, state: e.target.value })
                  }
                />
                <input
                  type="text"
                  placeholder="ZIP Code"
                  className="flex-1 p-2.5 text-sm rounded-xl bg-transparent border-2 border-gray-600"
                  value={billingInfo.zip}
                  onChange={(e) =>
                    setBillingInfo({ ...billingInfo, zip: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Right Form - Payment Info */}
            <div className="flex-1 bg-[#232339] rounded-xl p-8">
              <h2 className="text-xl sm:text-2xl font-semibold mb-8">
                Payment Method
              </h2>
              <div className="flex flex-col gap-4">
                <input
                  type="text"
                  placeholder="Card Number"
                  className="w-full p-2.5 text-sm rounded-xl bg-transparent border-2 border-gray-600"
                  value={billingInfo.cardNumber}
                  onChange={(e) =>
                    setBillingInfo({
                      ...billingInfo,
                      cardNumber: e.target.value,
                    })
                  }
                />
                <div className="flex flex-col lg:flex-row gap-4 mt-2">
                  <input
                    type="text"
                    placeholder="MM/YY"
                    className="flex-1 p-2.5 text-sm rounded-xl bg-transparent border-2 border-gray-600"
                    value={billingInfo.expiry}
                    onChange={(e) =>
                      setBillingInfo({ ...billingInfo, expiry: e.target.value })
                    }
                  />
                  <input
                    type="text"
                    placeholder="CVC"
                    className="flex-1 p-2.5 text-sm rounded-xl bg-transparent border-2 border-gray-600"
                    value={billingInfo.cvc}
                    onChange={(e) =>
                      setBillingInfo({ ...billingInfo, cvc: e.target.value })
                    }
                  />
                </div>
                <input
                  type="text"
                  placeholder="Name on Card"
                  className="w-full p-2.5 text-sm rounded-xl bg-transparent border-2 border-gray-600"
                  value={billingInfo.nameOnCard}
                  onChange={(e) =>
                    setBillingInfo({
                      ...billingInfo,
                      nameOnCard: e.target.value,
                    })
                  }
                />
                <div className="mt-2">
                  <input
                    type="text"
                    placeholder="Country/Region"
                    className="w-full p-2.5 text-sm rounded-xl bg-transparent border-2 border-gray-600"
                    value={billingInfo.paymentCountry}
                    onChange={(e) =>
                      setBillingInfo({
                        ...billingInfo,
                        paymentCountry: e.target.value,
                      })
                    }
                  />
                </div>

                {/* Buttons */}
                <div className="mt-4 flex flex-col gap-4">
                  <button
                    className="w-full py-2.5 rounded-xl bg-gradient-brand text-white font-semibold hover:opacity-90 transition"
                    onClick={handlePayNow}
                    disabled={isPaying}
                  >
                    {isPaying
                      ? "Processing..."
                      : `Pay Now - ${selectedPlan.price}`}
                  </button>
                  <button
                    className="relative mt-2 py-2.5 w-full rounded-xl bg-gradient-brand h-10 cursor-pointer"
                    onClick={() => setStep("confirm")}
                  >
                    <div className="absolute inset-[1px] bg-[#3E3E51] rounded-xl p-2 flex justify-center items-center">
                      <h1 className="text-gradient font-semibold">Go Back</h1>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Success */}
        {step === "success" && selectedPlan && (
          <div className="w-full max-w-xl flex flex-col gap-8 bg-gradient-to-br from-[#28284A] to-[#12122A] text-white p-12 rounded-xl shadow-lg items-center justify-center text-center">
            <div className="bg-gradient-to-r from-green-500 via-green-600 to-green-700 p-4 rounded-full">
              <FaCircleCheck className="w-10 h-10" />
            </div>
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl font-semibold text-white">
                Payment Successful!
              </h2>
              <p className="text-gray-300">
                Thank you, your MANIFEX subscription is now active.
              </p>
            </div>
            <Link
              href="/"
              className="py-2.5 px-4 w-full rounded-xl font-semibold bg-gradient-brand hover:opacity-90 transition"
            >
              Go to Home
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
