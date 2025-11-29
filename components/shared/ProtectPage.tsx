"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import useGetMe from "@/hooks/useGetMe";

export default function SubscriptionGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { data: user } = useGetMe();
  const [showModal, setShowModal] = useState(false);

  const isSubscribed = user?.isSubscribed;
  const isFree = user?.isSubscriptionFree;

  useEffect(() => {
    if (!user) return;

    if (isSubscribed) return;

    if (!isSubscribed && isFree === false) {
      setShowModal(true);
    }
  }, [user]);

  // While showing modal → don't load the practice page
  if (showModal) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all">
          {/* Header with gradient */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-t-2xl">
            <div className="flex items-center justify-center w-12 h-12 bg-white/20 rounded-lg mb-3">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-white text-center">
              Unlock Unlimited Practice
            </h2>
          </div>

          {/* Content */}
          <div className="p-6">
            <p className="text-gray-600 text-center leading-relaxed">
              You've used your free practice. Upgrade your plan to continue
              learning without limits.
            </p>

            {/* Feature highlights */}
            <div className="mt-4 space-y-2">
              <div className="flex items-center text-sm text-gray-600">
                <svg
                  className="w-4 h-4 text-green-500 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Unlimited practice sessions
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <svg
                  className="w-4 h-4 text-green-500 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Advanced learning features
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <svg
                  className="w-4 h-4 text-green-500 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Progress tracking
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 p-6 border-t border-gray-100">
            <button
              onClick={() => router.push("/")}
              className="flex-1 px-4 py-3 text-gray-600 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors duration-200">
              Cancel
            </button>
            <button
              onClick={() => router.push("/pricing")}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
              View Plans
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
