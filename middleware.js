import { NextResponse } from 'next/server';
import { getCspHeaders } from './src/utils/csp';

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};

export default function middleware(request) {
  // Clone the request headers
  const requestHeaders = new Headers(request.headers);
  
  // Get CSP headers
  const cspContent = getCspHeaders();
  
  // Apply security headers
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
  
  // Security headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=()'
  );
  
  // Content Security Policy
  response.headers.set('Content-Security-Policy', cspContent);
  
  return response;
} 