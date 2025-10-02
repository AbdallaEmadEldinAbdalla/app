'use client';

import { useEffect, useState } from 'react';

export default function SessionGuard({ children }: { children: React.ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkSession = async () => {
            try {
                // Try to verify session with the auth service
                // Since __session is httpOnly, we can't read it client-side
                // We need to make an API call to verify it
                const response = await fetch('https://auth.arya.services/api/verify-session', {
                    method: 'GET',
                    credentials: 'include', // Important: include cookies
                });

                console.log('SessionGuard: Session verification response:', response.status);

                if (response.ok) {
                    const data = await response.json();
                    if (data.valid) {
                        console.log('SessionGuard: Session valid, user authenticated');
                        setIsAuthenticated(true);
                        return;
                    }
                }

                // No valid session, redirect to auth with return URL
                console.log('SessionGuard: No valid session, redirecting to auth');
                const returnUrl = encodeURIComponent(window.location.href);
                window.location.href = `https://auth.arya.services/login?redirect=${returnUrl}`;
            } catch (error) {
                console.error('SessionGuard: Error checking session:', error);
                const returnUrl = encodeURIComponent(window.location.href);
                window.location.href = `https://auth.arya.services/login?redirect=${returnUrl}`;
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
