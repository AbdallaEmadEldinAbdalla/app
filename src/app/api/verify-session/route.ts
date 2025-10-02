import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase-admin';

export async function POST(request: NextRequest) {
    try {
        const { sessionCookie } = await request.json();

        if (!sessionCookie) {
            return NextResponse.json({ valid: false, error: 'No session cookie provided' }, { status: 400 });
        }

        // Verify the session cookie
        const decoded = await adminAuth.verifySessionCookie(sessionCookie, true);

        return NextResponse.json({
            valid: true,
            user: {
                uid: decoded.uid,
                email: decoded.email,
                name: decoded.name
            }
        });
    } catch (error) {
        console.error('Session verification failed:', error);
        return NextResponse.json({ valid: false, error: 'Invalid session' }, { status: 401 });
    }
}
