'use client';

import { useEffect, useState } from 'react';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                // First check URL parameters for auth token (from cross-domain redirect)
                const urlParams = new URLSearchParams(window.location.search);
                const urlAuthToken = urlParams.get('auth_token');
                
                if (urlAuthToken) {
                    console.log('AuthGuard: Found auth token in URL, storing locally');
                    localStorage.setItem('auth_token', urlAuthToken);
                    sessionStorage.setItem('auth_token', urlAuthToken);
                    
                    // Clean up URL by removing the token parameter
                    const newUrl = new URL(window.location.href);
                    newUrl.searchParams.delete('auth_token');
                    window.history.replaceState({}, '', newUrl.toString());
                }

                // Check if we have an auth token
                const authToken = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
                console.log('AuthGuard: Checking for auth token:', !!authToken);

                if (!authToken) {
                    console.log('AuthGuard: No auth token found, redirecting to auth service');
                    window.location.href = 'https://auth.arya.services/login';
                    return;
                }

                console.log('AuthGuard: Found auth token, verifying...');

                // Verify the token with the auth service
                const response = await fetch('https://auth.arya.services/api/verify-token', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ authToken }),
                });

                console.log('AuthGuard: Token verification response status:', response.status);

                if (response.ok) {
                    const data = await response.json();
                    console.log('AuthGuard: Token verification response:', data);
                    if (data.valid) {
                        console.log('AuthGuard: Auth token valid, user authenticated');
                        setIsAuthenticated(true);
                    } else {
                        console.log('AuthGuard: Auth token invalid, redirecting to auth service');
                        // Clear invalid token
                        localStorage.removeItem('auth_token');
                        sessionStorage.removeItem('auth_token');
                        window.location.href = 'https://auth.arya.services/login';
                    }
                } else {
                    const errorData = await response.json();
                    console.log('AuthGuard: Token verification failed:', response.status, errorData);
                    localStorage.removeItem('auth_token');
                    sessionStorage.removeItem('auth_token');
                    window.location.href = 'https://auth.arya.services/login';
                }
            } catch (error) {
                console.error('Auth check failed:', error);
                localStorage.removeItem('auth_token');
                sessionStorage.removeItem('auth_token');
                window.location.href = 'https://auth.arya.services/login';
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
