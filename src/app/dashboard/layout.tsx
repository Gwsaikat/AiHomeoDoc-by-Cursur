'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase';

// Safe localStorage helper
const safeLocalStorage = {
  getItem: (key: string): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(key);
    }
    return null;
  },
  setItem: (key: string, value: string): void => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, value);
    }
  },
  removeItem: (key: string): void => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(key);
    }
  }
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Check authentication
  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log('[DashboardLayout] Starting auth check...');
        
        // Check if we have query parameters from form submission
        const params = new URLSearchParams(window.location.search);
        const roleParam = params.get('role');
        const timestamp = params.get('ts');
        
        if (roleParam && timestamp) {
          console.log(`[DashboardLayout] Found role param: ${roleParam} with timestamp ${timestamp}`);
          
          // Check if timestamp is recent (within 10 seconds)
          const now = Date.now();
          const paramTime = parseInt(timestamp, 10);
          if (now - paramTime < 10000) {
            // Fresh redirect from sign-in, trust the role parameter
            console.log('[DashboardLayout] Recent redirect with role param, accepting as valid');
            localStorage.setItem('userRole', roleParam.toLowerCase());
            setIsAuthenticated(true);
            setIsLoading(false);
            
            // Remove query parameters from URL to clean it up
            window.history.replaceState({}, document.title, window.location.pathname);
            return;
          }
        }
        
        // Try to get session from localStorage first for faster response
        const storedSession = localStorage.getItem('supabase.auth.session');
        if (storedSession) {
          try {
            const parsed = JSON.parse(storedSession);
            if (parsed.user && parsed.session) {
              console.log('[DashboardLayout] Found valid session in localStorage');
              setIsAuthenticated(true);
              setIsLoading(false);
              
              // Still verify with Supabase in the background
              verifyWithSupabase();
              return;
            }
          } catch (e) {
            console.error('[DashboardLayout] Error parsing stored session:', e);
          }
        }
        
        // If we're here, we need to check with Supabase
        await verifyWithSupabase();
      } catch (err) {
        console.error('[DashboardLayout] Error during auth check:', err);
        redirectToAuth();
      }
    };
    
    // Helper to verify the session with Supabase
    const verifyWithSupabase = async () => {
      console.log('[DashboardLayout] Verifying session with Supabase...');
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('[DashboardLayout] Supabase session error:', error.message);
        redirectToAuth();
        return;
      }
      
      if (!data.session) {
        console.log('[DashboardLayout] No session found in Supabase');
        redirectToAuth();
        return;
      }
      
      // Valid session found
      const role = data.session.user.user_metadata?.role || 'patient';
      console.log(`[DashboardLayout] Valid session with role: ${role}`);
      
      // Store in localStorage
      localStorage.setItem('userRole', role.toLowerCase());
      
      // Update state
      setIsAuthenticated(true);
      setIsLoading(false);
      
      // Check if we need to redirect to the correct dashboard
      checkDashboardPath(role.toLowerCase());
    };
    
    // Helper to redirect to auth
    const redirectToAuth = () => {
      console.log('[DashboardLayout] Redirecting to auth page');
      // Clear localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('userRole');
        localStorage.removeItem('supabase.auth.session');
        window.location.href = '/auth';
      }
    };
    
    // Helper to check if we're on the correct dashboard path
    const checkDashboardPath = (role: string) => {
      if (typeof window !== 'undefined') {
        const path = window.location.pathname;
        
        // If we're at /dashboard, let the page component handle the redirect
        if (path === '/dashboard' || path === '/dashboard/') {
          return;
        }
        
        // If we're on a specific dashboard that doesn't match our role
        const segments = path.split('/');
        if (segments.length > 2 && segments[1] === 'dashboard') {
          const dashboardType = segments[2];
          
          // Only redirect if the path specifically indicates a different role
          if (['patient', 'doctor', 'clinic'].includes(dashboardType) && 
              dashboardType !== role) {
            console.log(`[DashboardLayout] Role mismatch: ${role} vs ${dashboardType}`);
            window.location.href = `/dashboard/${role}`;
          }
        }
      }
    };
    
    // Ensure we run this only in the browser
    if (typeof window !== 'undefined') {
      checkAuth();
    }
  }, []);
  
  // Render loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-600 font-medium">Verifying your session...</p>
        </div>
      </div>
    );
  }
  
  // If not authenticated, children can handle redirection
  // This is a fallback - middleware and useEffect should have redirected already
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md p-8 bg-white rounded-lg shadow">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Authentication Required</h2>
          <p className="text-gray-600 mb-4">Your session has expired or you're not signed in.</p>
          <a 
            href="/auth" 
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Sign In
          </a>
        </div>
      </div>
    );
  }
  
  // Render dashboard content
  return <>{children}</>;
} 