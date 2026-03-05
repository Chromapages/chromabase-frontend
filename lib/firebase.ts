import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

/*
 * Guard Firebase initialization to browser environments only.
 *
 * Next.js SSR / static prerender runs module-level code on the server where
 * NEXT_PUBLIC_* env vars may be undefined (build-time) or browser APIs
 * unavailable. All actual auth usage (onAuthStateChanged, signInWithPopup,
 * signOut) lives inside useEffect / event handlers that only run in the
 * browser, so null server-side values are safe.
 */
const isClient = typeof window !== 'undefined';
const hasValidConfig = !!firebaseConfig.apiKey;

if (isClient && !hasValidConfig) {
    console.warn('[Firebase] NEXT_PUBLIC_FIREBASE_API_KEY is missing. Auth features will be disabled.');
}

const app: FirebaseApp = (isClient && hasValidConfig)
    ? (!getApps().length ? initializeApp(firebaseConfig) : getApp())
    : (null as unknown as FirebaseApp);

export const auth: Auth = (isClient && hasValidConfig)
    ? getAuth(app)
    : (null as unknown as Auth);

export default app;
