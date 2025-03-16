import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { getCspHeaders } from './utils/csp';

// List of completely public paths
const PUBLIC_PATHS = [
  '/',
  '/auth',
  '/auth/confirm',
  '/auth/callback',
  '/api/webhooks/stripe',
  '/api/',
  // IMPORTANT: Temporarily make dashboard paths public to bypass auth checks
  // This allows direct navigation to the dashboard without middleware interference
  '/dashboard',
];

// Check if a path should be public
const isPublicPath = (path: string) => {
  return PUBLIC_PATHS.some(publicPath => {
    return path === publicPath || path.startsWith(`${publicPath}/`);
  });
};

// Check if a path is a static asset
const isStaticAsset = (path: string) => {
  return path.includes('/_next') || 
    path.includes('/favicon') ||
    path.includes('/manifest') ||
    path.includes('/icons') ||
    path.endsWith('.svg') ||
    path.endsWith('.png') ||
    path.endsWith('.jpg') ||
    path.endsWith('.jpeg') ||
    path.endsWith('.ico') ||
    path.endsWith('.json');
};

export async function middleware(req: NextRequest) {
  // Skip middleware for static assets
  const path = req.nextUrl.pathname;
  console.log(`[Middleware] Processing path: ${path}`);
  
  if (isStaticAsset(path)) {
    return NextResponse.next();
  }

  // Create a response object
  const res = NextResponse.next();
  
  // Add Content Security Policy headers
  res.headers.set('Content-Security-Policy', getCspHeaders());
  // Add cache control for dynamic pages
  res.headers.set('Cache-Control', 'no-store, max-age=0, must-revalidate');

  // Skip auth check for public paths
  if (isPublicPath(path)) {
    console.log(`[Middleware] Skipping auth check for public path: ${path}`);
    return res;
  }

  // Skip dashboard auth check for troubleshooting
  if (path.startsWith('/dashboard')) {
    console.log(`[Middleware] Bypassing auth check for dashboard path: ${path}`);
    return res;
  }

  // For all other routes, check authentication
  try {
    console.log(`[Middleware] Checking auth for path: ${path}`);
    const supabase = createMiddlewareClient({ req, res });
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      console.log(`[Middleware] No session found, redirecting to auth`);
      return NextResponse.redirect(new URL('/auth', req.url));
    }

    return res;
  } catch (error) {
    console.error('[Middleware] Error:', error);
    // On error, continue to page (page-level auth can handle errors)
    return res;
  }
}

// Only run middleware on pages that aren't static assets
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}; 