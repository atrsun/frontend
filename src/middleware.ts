import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { sessionOptions, type SessionData } from '@/lib/sessionConfig';
import { unsealData } from 'iron-session';

// Define the paths that require authentication
const protectedPaths = [
  '/dashboard',
  '/customers',
  '/invoices',
  '/products',
];

// Define the paths that are accessible only to non-authenticated users
const authOnlyPaths = [
  '/auth',
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if the path is protected
  const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path));
  const isAuthOnlyPath = authOnlyPaths.some(path => pathname.startsWith(path));
  
  // If the path is not protected and not auth-only, allow access
  if (!isProtectedPath && !isAuthOnlyPath) {
    return NextResponse.next();
  }
  
  // Get the session cookie
  const cookie = request.cookies.get(sessionOptions.cookieName);
  
  // If there's no cookie and the path is protected, redirect to login
  if (!cookie && isProtectedPath) {
    const url = new URL('/auth', request.url);
    return NextResponse.redirect(url);
  }
  
  try {
    // If there's a cookie, try to unseal it
    if (cookie) {
      const session = await unsealData<SessionData>(cookie.value, sessionOptions);
      
      // If the user is logged in and trying to access auth page, redirect to dashboard
      if (session.isLoggedIn && isAuthOnlyPath) {
        const url = new URL('/dashboard', request.url);
        return NextResponse.redirect(url);
      }
      
      // If the user is not logged in and trying to access protected page, redirect to login
      if (!session.isLoggedIn && isProtectedPath) {
        const url = new URL('/auth', request.url);
        return NextResponse.redirect(url);
      }
    }
    
    // Allow access
    return NextResponse.next();
  } catch (error) {
    console.error('Error in middleware:', error);
    
    // If there's an error and the path is protected, redirect to login
    if (isProtectedPath) {
      const url = new URL('/auth', request.url);
      return NextResponse.redirect(url);
    }
    
    // Otherwise, allow access
    return NextResponse.next();
  }
}

// Configure the middleware to run on specific paths
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