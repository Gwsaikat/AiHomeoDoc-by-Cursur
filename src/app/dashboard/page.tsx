'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase';
import { FaSpinner } from 'react-icons/fa';

export default function DashboardRouter() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const redirectToDashboard = async () => {
      try {
        console.log('[Dashboard] Router checking user role...');
        
        // Try to get session from Supabase
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('[Dashboard] Session error:', error.message);
          throw new Error('Failed to get session');
        }
        
        if (!data.session) {
          console.log('[Dashboard] No session found, redirecting to auth');
          window.location.href = '/auth';
          return;
        }
        
        // Extract user role from metadata
        const user = data.session.user;
        let role = (user.user_metadata?.role || 'patient').toLowerCase();
        
        console.log('[Dashboard] User role found:', role);
        
        // Validate role
        if (!['patient', 'doctor', 'clinic'].includes(role)) {
          console.log('[Dashboard] Invalid role, defaulting to patient');
          role = 'patient';
        }
        
        // Save to localStorage for other components
        localStorage.setItem('userRole', role);
        
        // Redirect to role-specific dashboard
        const dashboardPath = `/dashboard/${role}`;
        console.log('[Dashboard] Redirecting to:', dashboardPath);
        window.location.href = dashboardPath;
        
      } catch (err) {
        console.error('[Dashboard] Error:', err);
        setError('Failed to load your dashboard. Please try signing in again.');
        setIsLoading(false);
      }
    };

    redirectToDashboard();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
        {error ? (
          <>
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Dashboard Error</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <a
              href="/auth"
              className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Return to Sign In
            </a>
          </>
        ) : (
          <>
            <FaSpinner className="w-16 h-16 text-blue-500 animate-spin mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Loading Your Dashboard</h2>
            <p className="text-gray-600 mb-6">We're personalizing your experience...</p>
          </>
        )}
      </div>
    </div>
  );
} 