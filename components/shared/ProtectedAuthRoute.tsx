"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { Loader2 } from 'lucide-react';

export function ProtectedAuthRoute<T extends object>(
  WrappedComponent: React.ComponentType<T>
) {
  return function AuthProtectedComponent(props: T) {
    const router = useRouter();
    const { isAuthenticated, accessToken, isLoading } = useAuthStore();
    const [isMounted, setIsMounted] = useState(false);

    // Wait for component to mount (client-side only)
    useEffect(() => {
      setIsMounted(true);
    }, []);

    // Handle redirect only after component is mounted
    useEffect(() => {
      if (isMounted && !isLoading) {
        if (isAuthenticated && accessToken) {
          console.log('User is authenticated, redirecting...');
          const lastRoute = sessionStorage.getItem('lastRoute') || '/profile';
          // a small timeout to avoid DOM conflicts
          setTimeout(() => {
            router.replace(lastRoute);
          }, 100);
        }
      }
    }, [isMounted, isAuthenticated, accessToken, isLoading, router]);

    // Show loading until we're sure about the auth state
    if (!isMounted || isLoading) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-brand-dark to-brand-darker flex items-center justify-center">
          <Loader2 className="w-10 h-10 animate-spin text-gray-500" />
        </div>
      );
    }

    // If authenticated, show redirect message
    if (isAuthenticated && accessToken) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-brand-dark to-brand-darker flex items-center justify-center">
          <div className="text-white">Redirecting to your profile...</div>
        </div>
      );
    }

    // Only render the signin form if not authenticated
    return <WrappedComponent {...props} />;
  };
}