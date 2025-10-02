'use client';

import { useState } from 'react';
import AuthGuard from '@/components/AuthGuard';

export default function Home() {
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      // Clear auth tokens
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_authenticated');
      localStorage.removeItem('auth_timestamp');
      sessionStorage.removeItem('auth_token');

      // Redirect to auth service
      window.location.href = 'https://auth.arya.services/login';
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <nav className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <h1 className="text-xl font-semibold text-gray-900">Main App</h1>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-500">app.arya.services</span>
                <button
                  onClick={handleLogout}
                  disabled={loading}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50"
                >
                  {loading ? 'Logging out...' : 'Logout'}
                </button>
              </div>
            </div>
          </div>
        </nav>

        <main className="flex-1 max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="border-4 border-dashed border-gray-200 rounded-lg p-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  🎉 Successfully Authenticated!
                </h2>
                <p className="text-lg text-gray-600 mb-8">
                  You are now logged into the main application via SSO.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                  <div className="bg-blue-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-blue-900 mb-2">
                      🔐 Single Sign-On
                    </h3>
                    <p className="text-blue-700">
                      You logged in once at auth.arya.services and are automatically authenticated here.
                    </p>
                  </div>

                  <div className="bg-green-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-green-900 mb-2">
                      🍪 Shared Session
                    </h3>
                    <p className="text-green-700">
                      Your session is shared across all subdomains using Firebase session cookies.
                    </p>
                  </div>

                  <div className="bg-purple-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-purple-900 mb-2">
                      🔄 Cross-Domain
                    </h3>
                    <p className="text-purple-700">
                      Visit admin.arya.services - you&apos;ll be automatically logged in there too!
                    </p>
                  </div>

                  <div className="bg-orange-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-orange-900 mb-2">
                      🚪 Global Logout
                    </h3>
                    <p className="text-orange-700">
                      Logout here and you&apos;ll be logged out everywhere automatically.
                    </p>
                  </div>
                </div>

                <div className="mt-8">
                  <a
                    href="https://admin.arya.services"
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    Visit Admin Panel →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}
