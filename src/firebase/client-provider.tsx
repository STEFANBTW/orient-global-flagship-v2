'use client';

import React, { ReactNode, useEffect, useState } from 'react';
import { initializeFirebase } from './init';
import { FirebaseProvider } from './provider';
import { FirebaseApp } from 'firebase/app';
import { Firestore } from 'firebase/firestore';
import { Auth } from 'firebase/auth';
import { Loader2 } from 'lucide-react';

/**
 * Ensures Firebase is initialized only once on the client side.
 * Renders a minimal, stable loader during the initial setup to prevent hydration mismatches.
 */
export function FirebaseClientProvider({ children }: { children: ReactNode }) {
 const [instances, setInstances] = useState<{
 firebaseApp: FirebaseApp;
 firestore: Firestore;
 auth: Auth;
 } | null>(null);

 useEffect(() => {
 try {
 const { firebaseApp, firestore, auth } = initializeFirebase();
 setInstances({ firebaseApp, firestore, auth });
 } catch (error) {
 console.error("Critical: Firebase initialization failed", error);
 }
 }, []);

 if (!instances) {
 return (
 <div className="min-h-screen bg-foreground text-background flex items-center justify-center" aria-busy="true">
 <div className="flex flex-col items-center gap-4">
 <Loader2 className="w-8 h-8 text-primary animate-spin" />
 <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/40">Initializing Command Center...</p>
 </div>
 </div>
 );
 }

 return (
 <FirebaseProvider
 firebaseApp={instances.firebaseApp}
 firestore={instances.firestore}
 auth={instances.auth}
 >
 {children}
 </FirebaseProvider>
 );
}
