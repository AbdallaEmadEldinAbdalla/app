'use client';

import { useEffect, useState } from 'react';

export default function SessionGuard({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkSession = () => {
      try {
        // Check if we have a session cookie by trying to access document.cookie
        const cookies = document.cookie;
        const hasSession = cookies.includes('__session=');
        
        console.log('SessionGuard: Checking for session cookie:', hasSession);
        
        if (!hasSession) {
          console.log('SessionGuard: No session cookie found, redirecting to auth');
          window.location.href = 'https://auth.arya.services/login';
          return;
        }
        
        console.log('SessionGuard: Session cookie found, user authenticated');
        setIsAuthenticated(true);
      } catch (error) {
        console.error('SessionGuard: Error checking session:', error);
        window.location.href = 'https://auth.arya.services/login';
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect
  }

  return <>{children}</>;
}
