import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { User } from '@supabase/supabase-js';

export const GET = async (request: Request) => {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const signup = requestUrl.searchParams.get('signup') === 'true';
  const role = requestUrl.searchParams.get('role');
  
  console.log('[Auth Callback] URL:', requestUrl.toString());
  console.log('[Auth Callback] Code present:', !!code);
  console.log('[Auth Callback] Signup attempt:', signup);
  console.log('[Auth Callback] Role provided:', role);

  if (!code) {
    // Missing code, redirect to error page
    console.error('[Auth Callback] Missing code parameter');
    return NextResponse.redirect(`${requestUrl.origin}/auth/error?error=missing_code`);
  }
  
  // Create a Supabase client for the current request
  const supabase = createRouteHandlerClient({ cookies });

  try {
    // Exchange code for session
    console.log('[Auth Callback] Exchanging code for session');
    const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
    
    if (exchangeError || !data.session) {
      console.error('[Auth Callback] Error exchanging code:', exchangeError || 'No session returned');
      return NextResponse.redirect(`${requestUrl.origin}/auth/error?error=exchange_error`);
    }
    
    // Get user
    const { session } = data;
    const user = session.user;
    console.log('[Auth Callback] User authenticated:', user.id);
    console.log('[Auth Callback] Auth provider:', user.app_metadata.provider);
    console.log('[Auth Callback] User metadata:', JSON.stringify(user.user_metadata));
    
    // If this is a signup with a role provided, update the user's role
    if (signup && role && ['patient', 'doctor', 'clinic'].includes(role)) {
      console.log('[Auth Callback] Updating role for new user to:', role);
      
      const { error: updateError } = await supabase.auth.updateUser({
        data: { role, subscription_plan: 'free' }
      });
      
      if (updateError) {
        console.error('[Auth Callback] Error updating user role:', updateError);
        // Continue with redirection despite the error
      }
    }
    
    // Check if the user is a new social login (missing role)
    if (!getUserRole(user)) {
      console.log('[Auth Callback] New social login detected, redirecting to complete profile');
      return NextResponse.redirect(`${requestUrl.origin}/auth/complete-profile`);
    }
    
    // Redirect to appropriate dashboard based on role
    const redirectPath = getRedirectPath(user);
    console.log('[Auth Callback] Redirecting to:', redirectPath);
    
    // Set cache control headers
    const response = NextResponse.redirect(`${requestUrl.origin}${redirectPath}`);
    response.headers.set('Cache-Control', 'no-store, max-age=0');
    
    return response;
  } catch (error) {
    console.error('[Auth Callback] Error in auth callback:', error);
    return NextResponse.redirect(`${requestUrl.origin}/auth/error?error=callback_error`);
  }
};

/**
 * Get user role from user object
 */
function getUserRole(user: User): string | null {
  // First check the user metadata (this is where we store the role)
  const userRole = user.user_metadata?.role;
  
  if (userRole) {
    // Validate role
    if (['patient', 'doctor', 'clinic'].includes(userRole)) {
      return userRole;
    }
  }
  
  // If no valid role found, return null
  return null;
}

/**
 * Get redirect path based on user role
 */
function getRedirectPath(user: User): string {
  const role = getUserRole(user);
  
  // If no role found, redirect to complete profile
  if (!role) {
    return '/auth/complete-profile';
  }
  
  // Return appropriate dashboard path
  if (role === 'doctor') {
    return '/dashboard/doctor';
  } else if (role === 'clinic') {
    return '/dashboard/clinic';
  } else {
    // Default to patient dashboard
    return '/dashboard/patient';
  }
} 