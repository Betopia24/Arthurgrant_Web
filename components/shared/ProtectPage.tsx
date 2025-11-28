// components/withRouteGuard.tsx
"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";

const ALLOWED_ROUTES_KEY = "free_trial_allowed_route";

export const withRouteGuard = <P extends object>(
  Component: React.ComponentType<P>
) => {
  return function ProtectedComponent(props: P) {
    const router = useRouter();
    const pathname = usePathname();
    const user = useAuthStore((state) => state.user);
    console.log("check user data:==", user);

    useEffect(() => {
      if (!user) return;

      const savedRoute = localStorage.getItem(ALLOWED_ROUTES_KEY);

      // Case 1: Free subscription user
      if (user.isSubscriptionFree === true) {
        // Save first visited route and restrict access
        if (!savedRoute) {
          localStorage.setItem(ALLOWED_ROUTES_KEY, pathname);
        } else {
          // Only allow access to saved route or pricing page
          if (pathname !== savedRoute && pathname !== "/pricing") {
            router.replace("/pricing");
          }
        }
      }
      // Case 2: Not free subscription AND not subscribed → Redirect to pricing
      else if (
        user.isSubscriptionFree === false &&
        user.isSubscribed !== true
      ) {
        if (pathname !== "/pricing") {
          router.replace("/pricing");
        }
      }
      // Case 3: Not free subscription AND subscribed → Allow all routes (no action needed)
    }, [user, pathname, router]);

    return <Component {...props} />;
  };
};
