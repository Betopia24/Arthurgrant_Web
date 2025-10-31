import React from "react";
import Heading from "../shared/Heading";
import {
  FaCheck,
  FaLock,
  FaShieldAlt,
  FaTimesCircle,
} from "react-icons/fa";
import { plans } from "@/lib/constants";
import Link from "next/link";

const Pricing = () => {
  return (
    <div className="py-20 bg-section-dark text-white">
      <div className="app-container flex flex-col items-center gap-12">
        {/* Heading */}
        <Heading
          heading="Choose Your Learning Path"
          subheading="Start your journey with our free trial, then choose the plan that fits your learning goals"
          specialText="Learning Path"
          align="left"
        />

        {/* Pricing Cards */}
        <div className="mt-2 flex flex-col md:flex-row gap-6 w-full justify-center">
          {plans.map((plan, idx) => (
            <div
              key={idx}
              className={`flex-1 p-8 rounded-2xl flex flex-col justify-between ${
                plan.highlight
                  ? "relative z-0" // For stacking
                  : "bg-gradient-to-br from-[#2B2E4E] to-[#12132F] border border-gray-700"
              }`}
            >
              {/* Gradient border for highlighted card */}
              {plan.highlight && (
                <div className="absolute inset-0 rounded-2xl p-[2px] bg-gradient-to-b from-gradient-from via-gradient-via to-gradient-to z-[-1]">
                  <div className="bg-[#171045] rounded-2xl h-full w-full"></div>
                </div>
              )}

              <div className="flex flex-col gap-4 relative z-10">
                <div className="w-full flex items-center flex-col gap-2">
                  <h3 className="text-xl font-semibold">{plan.title}</h3>
                  <p className="text-3xl font-bold">{plan.price}</p>
                  <span className="text-sm font-normal">{plan.duration}</span>
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
                <Link
                  href="/pricing"
                  className="mt-12 py-2.5 w-full rounded-xl bg-gradient-brand flex items-center justify-center gap-2 font-semibold hover:opacity-90 transition cursor-pointer"
                >
                  Start With {plan.title} Plan
                </Link>
              ) : (
                <>
                  <Link
                    href="/pricing"
                    className="relative mt-12 py-2.5 w-full rounded-xl bg-gradient-brand h-[44px] cursor-pointer"
                  >
                    <div className="absolute inset-[1px] bg-gradient-to-br from-[#2E2E43] via-[#2C2C41] to-[#27273B] rounded-xl p-2 flex justify-center items-center">
                      <h1 className="text-gradient font-semibold">
                        Start With {plan.title} Plan
                      </h1>
                    </div>
                  </Link>
                </>
              )}
            </div>
          ))}
        </div>

        {/* Bottom Guarantee Row */}
        <div
          className="flex flex-col md:flex-row gap-4 items-center justify-center mt-6 text-gray-400 text-sm 
                border-none lg:border lg:border-gray-500 rounded-full px-4 py-2 bg-[#1a1a3b]"
        >
          <p className="flex items-center gap-2">
            <FaShieldAlt className="text-blue-500 flex-shrink-0" />
            30-day money-back guarantee
          </p>

          <span className="hidden md:inline">|</span>

          <p className="flex items-center gap-2">
            <FaTimesCircle className="text-yellow-500 flex-shrink-0" />
            Cancel anytime
          </p>

          <span className="hidden md:inline">|</span>

          <p className="flex items-center gap-2">
            <FaLock className="text-green-500 flex-shrink-0" />
            Secure payments
          </p>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
