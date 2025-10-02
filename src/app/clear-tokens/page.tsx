'use client';

import { useEffect } from 'react';

export default function ClearTokensPage() {
    useEffect(() => {
        // Clear all tokens from localStorage and sessionStorage
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_authenticated');
        localStorage.removeItem('auth_timestamp');
        sessionStorage.removeItem('auth_token');

        console.log('Tokens cleared on app.arya.services');

        // Close the window immediately
        window.close();
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
                <p className="text-gray-600">Clearing tokens...</p>
            </div>
        </div>
    );
}
