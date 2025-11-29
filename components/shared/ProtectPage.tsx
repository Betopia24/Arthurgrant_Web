// // components/withRouteGuard.tsx
// "use client";

// import { useEffect } from "react";
// import { usePathname, useRouter } from "next/navigation";

// const ALLOWED_ROUTES_KEY = "subscription_change_route";

// export const withRouteGuard = <P extends object>(
//   Component: React.ComponentType<P>
// ) => {
//   return function ProtectedComponent(props: P) {
//     const router = useRouter();
//     const pathname = usePathname();

//     useEffect(() => {
//       const savedRoute = localStorage.getItem(ALLOWED_ROUTES_KEY);

//       // If there's a saved route, user can only access that route + pricing
//       if (savedRoute && pathname !== savedRoute && pathname !== "/pricing") {
//         router.replace("/pricing");
//       }
//     }, [pathname, router]);

//     return <Component {...props} />;
//   };
// };
