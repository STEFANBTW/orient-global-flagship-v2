'use client';

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import { firebaseConfig } from './config';

/**
 * Initializes Firebase services idempotently.
 * Separated from the barrel file to prevent circular dependencies during bundling.
 */
export function initializeFirebase() {
 const firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
 const firestore = getFirestore(firebaseApp);
 const auth = getAuth(firebaseApp);

 return { firebaseApp, firestore, auth };
}
