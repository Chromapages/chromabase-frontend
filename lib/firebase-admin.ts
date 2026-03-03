import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { getAuth, Auth } from 'firebase-admin/auth';

let firebaseApp: App;

// Configure Firebase Admin
if (!getApps().length) {
    let credential;

    // 1. Try environment variable first (Vercel Production)
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
        try {
            const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
            credential = cert(serviceAccount);
        } catch (e) {
            console.error('Failed to parse FIREBASE_SERVICE_ACCOUNT string from environment variables.');
        }
    }
    // 2. Fall back to local file (Local Development)
    else {
        try {
            // In Next.js, resolving paths correctly relative to the project root is important.
            // We assume service-account.json is in the root directory.
            const serviceAccount = require('../service-account.json');
            credential = cert(serviceAccount);
        } catch (e) {
            console.error('Local service-account.json not found or invalid format.');
        }
    }

    if (credential) {
        firebaseApp = initializeApp({ credential });
        console.log('[Firebase Admin] Initialized successfully.');
    } else {
        // Attempt default initialization if hosted on GCP/Firebase directly
        try {
            firebaseApp = initializeApp();
            console.log('[Firebase Admin] Initialized with default credentials.');
        } catch (e) {
            console.error('[Firebase Admin] Failed to initialize.');
        }
    }
} else {
    firebaseApp = getApps()[0];
}

const db: Firestore = getFirestore(firebaseApp!);
const auth: Auth = getAuth(firebaseApp!);

export { db, auth, firebaseApp };
