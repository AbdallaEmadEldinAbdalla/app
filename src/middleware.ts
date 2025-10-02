import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { adminAuth } from '@/lib/firebase-admin';

export async function middleware(request: NextRequest) {
    // Skip middleware for API routes and static files
    if (request.nextUrl.pathname.startsWith('/api') ||
        request.nextUrl.pathname.startsWith('/_next') ||
        request.nextUrl.pathname.includes('.')) {
        return NextResponse.next();
    }

    // Check for Firebase session cookie
    const cookie = request.headers.get('cookie') || '';
    const session = cookie.match(/__session=([^;]+)/)?.[1];

    if (!session) {
        console.log('App middleware: No session cookie found, redirecting to auth');
        return NextResponse.redirect('https://auth.arya.services/login');
    }

    try {
        // Check if adminAuth is properly initialized
        if (!adminAuth || typeof adminAuth.verifySessionCookie !== 'function') {
            console.log('App middleware: Firebase Admin SDK not initialized, redirecting to auth');
            return NextResponse.redirect('https://auth.arya.services/login');
        }

        // Verify the Firebase session cookie
        const decoded = await adminAuth.verifySessionCookie(session, true);
        console.log('App middleware: Session verified for user:', decoded.uid);

        // Add user info to headers for the page
        const response = NextResponse.next();
        response.headers.set('x-user-id', decoded.uid);
        return response;
    } catch (error) {
        console.log('App middleware: Session verification failed:', error);
        return NextResponse.redirect('https://auth.arya.services/login');
    }
}

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
