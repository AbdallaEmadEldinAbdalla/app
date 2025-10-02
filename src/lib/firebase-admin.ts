import * as admin from 'firebase-admin';

let adminAuth: admin.auth.Auth;

try {
    const serviceAccount = {
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    };

    // Only initialize if we have all required environment variables
    if (serviceAccount.projectId && serviceAccount.clientEmail && serviceAccount.privateKey) {
        if (!admin.apps.length) {
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount),
            });
        }
        adminAuth = admin.auth();
    } else {
        // Create a mock auth object for build time
        adminAuth = {} as admin.auth.Auth;
    }
} catch {
    // Fallback for build time when env vars might not be available
    adminAuth = {} as admin.auth.Auth;
}

export { adminAuth };