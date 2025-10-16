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
    const { isAuthenticated, accessToken } = useAuthStore();
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
      const checkAuthentication = () => {
        if (isAuthenticated && accessToken) {
          console.log('User is authenticated, redirecting to previous page...');
          
          // last visited route from sessionStorage or default to profile
          const lastRoute = sessionStorage.getItem('lastRoute') || '/profile';
          router.push(lastRoute);
          return;
        }
        setIsChecking(false);
      };

      checkAuthentication();
    }, [isAuthenticated, accessToken, router]);

    if (isChecking) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-brand-dark to-brand-darker flex items-center justify-center">
          <Loader2 className="w-10 h-10 animate-spin text-gray-500" />
        </div>
      );
    }

    // If not authenticated, render the wrapped component
    return <WrappedComponent {...props} />;
  };
}