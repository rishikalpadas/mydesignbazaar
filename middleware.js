import { NextResponse } from 'next/server';

export function middleware(request) {
  const token = request.cookies.get('auth-token')?.value;
  const { pathname } = request.nextUrl;

  console.log('[MIDDLEWARE] Processing:', pathname, 'Token present:', !!token);

  // Define protected routes
  const protectedRoutes = ['/dashboard', '/profile', '/designs', '/admin'];
  const authRoutes = ['/login', '/signup'];

  // Check if the current path is protected
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  );

  // Check if the current path is an auth route
  const isAuthRoute = authRoutes.some(route => 
    pathname.startsWith(route)
  );

  // If accessing protected route without token
  if (isProtectedRoute && !token) {
    console.log('[MIDDLEWARE] Redirecting to login - no token for protected route');
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If accessing auth routes with valid token, redirect to dashboard
  if (isAuthRoute && token) {
    // Only verify token if JWT_SECRET is available
    if (process.env.JWT_SECRET) {
      try {
        const jwt = require('jsonwebtoken');
        jwt.verify(token, process.env.JWT_SECRET);
        console.log('[MIDDLEWARE] Valid token, redirecting to dashboard');
        return NextResponse.redirect(new URL('/dashboard', request.url));
      } catch (error) {
        console.log('[MIDDLEWARE] Invalid token, allowing auth route access');
        // Token is invalid, allow access to auth routes
        return NextResponse.next();
      }
    } else {
      console.warn('[MIDDLEWARE] JWT_SECRET not available, skipping token verification');
    }
  }

  // For ALL API routes, let them handle their own authentication
  // Don't interfere with API route authentication
  if (pathname.startsWith('/api/')) {
    console.log('[MIDDLEWARE] API route - passing through');
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - uploads (uploaded files)
     * - public assets
     */
    '/((?!_next/static|_next/image|favicon.ico|uploads|.*\\.).*)',
  ],
};