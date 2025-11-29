"use client";
import { useAuthStore } from "@/stores/authStore";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect } from "react";

interface ProtectPageProps {
  children: React.ReactNode;
}

const ProtectPage: React.FC<ProtectPageProps> = ({ children }) => {
  const path = usePathname();
  const router = useRouter();
  const user = useAuthStore().user;
  const isSubscribed = user?.isSubscribed;
  const isSubscriptionFree = user?.isSubscriptionFree;

  useEffect(() => {
    // User with free subscription can only access "/practice/writing"
    if (!isSubscribed && isSubscriptionFree) {
      const allowedRoute = "/practice/writing";
      const isPracticeRoute = path.startsWith("/practice");

      if (isPracticeRoute && path !== allowedRoute) {
        router.push("/pricing");
      }
    }
  }, [path, isSubscribed, isSubscriptionFree, router]);

  // Show loading or nothing during redirect
  if (!isSubscribed && isSubscriptionFree) {
    const isRestrictedRoute =
      path.startsWith("/practice") && path !== "/practice/writing";
    if (isRestrictedRoute) {
      return <div>Redirecting...</div>; // or null
    }
  }

  return <>{children}</>;
};

export default ProtectPage;
