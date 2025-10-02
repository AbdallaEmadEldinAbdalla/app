'use client';

import { useEffect, useState } from 'react';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                // Check if we have an auth token
                const authToken = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');

                if (!authToken) {
                    console.log('No auth token found, redirecting to auth service');
                    window.location.href = 'http://auth.local:3000/login';
                    return;
                }

                // Verify the token with the auth service
                const response = await fetch('http://auth.local:3000/api/verify-token', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ authToken }),
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data.valid) {
                        console.log('Auth token valid, user authenticated');
                        setIsAuthenticated(true);
                    } else {
                        console.log('Auth token invalid, redirecting to auth service');
                        // Clear invalid token
                        localStorage.removeItem('auth_token');
                        sessionStorage.removeItem('auth_token');
                        window.location.href = 'http://auth.local:3000/login';
                    }
                } else {
                    console.log('Token verification failed, redirecting to auth service');
                    localStorage.removeItem('auth_token');
                    sessionStorage.removeItem('auth_token');
                    window.location.href = 'http://auth.local:3000/login';
                }
            } catch (error) {
                console.error('Auth check failed:', error);
                localStorage.removeItem('auth_token');
                sessionStorage.removeItem('auth_token');
                window.location.href = 'http://auth.local:3000/login';
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, []);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Checking authentication...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-600">Redirecting to authentication...</p>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
