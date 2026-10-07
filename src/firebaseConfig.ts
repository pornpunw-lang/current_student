/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import firebaseConfig from "../firebase-applet-config.json";

// Operation Type Enum as specified in the firebase-integration skill
export enum OperationType {
  CREATE = "create",
  UPDATE = "update",
  DELETE = "delete",
  LIST = "list",
  GET = "get",
  WRITE = "write",
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

// Global detection of mock/active configurations
export const isMockFirebase = 
  !firebaseConfig || 
  firebaseConfig.apiKey === "mock-api-key-placeholder" || 
  firebaseConfig.apiKey === "";

// Handle Firestore Error complying exactly to system validation requirements
export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth?.currentUser?.uid || null,
      email: auth?.currentUser?.email || null,
      emailVerified: auth?.currentUser?.emailVerified || null,
      isAnonymous: auth?.currentUser?.isAnonymous || null,
      tenantId: auth?.currentUser?.tenantId || null,
      providerInfo: auth?.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error("Firestore Error: ", JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

let firebaseApp;
let firestoreDb: any;
let firebaseAuth: any;

if (!isMockFirebase) {
  try {
    firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    firestoreDb = getFirestore(firebaseApp);
    firebaseAuth = getAuth(firebaseApp);
  } catch (error) {
    console.warn("Error initializing real Firebase. Falling back to local storage simulator.", error);
  }
}

// Export references
export const db = firestoreDb;
export const auth = firebaseAuth;
export const googleProvider = new GoogleAuthProvider();

export { signInWithPopup, signOut };
