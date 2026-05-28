/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { getFirestore, doc, getDocFromServer } from "firebase/firestore";
// Import firebaseConfig relative from /src/firebase.ts to root /firebase-applet-config.json
import firebaseConfig from "../firebase-applet-config.json";

let db: any = null;
let auth: any = null;
let isFirebaseConfigured = false;

// Check if firebase-applet-config has been populated securely by the platform
if (firebaseConfig && firebaseConfig.apiKey && firebaseConfig.apiKey !== "") {
  try {
    const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
    auth = getAuth(app);
    isFirebaseConfigured = true;
    
    // Validate connection to Firestore as requested by the Firebase integration guidelines
    const testConnection = async () => {
      try {
        await getDocFromServer(doc(db, "test", "connection"));
      } catch (error) {
        if (error instanceof Error && error.message.includes("the client is offline")) {
          console.warn("Please check your Firebase configuration: client is offline.");
        }
      }
    };
    testConnection();
  } catch (error) {
    console.error("Firebase SDK failed to initialize:", error);
  }
} else {
  console.log("Using standard local persistence (Firebase config not yet populated).");
}

export { db, auth, isFirebaseConfigured };
export const googleProvider = new GoogleAuthProvider();

export async function loginWithGoogle() {
  if (!auth) throw new Error("Firebase Authentication is not initialized.");
  return signInWithPopup(auth, googleProvider);
}

export async function logout() {
  if (!auth) throw new Error("Firebase Authentication is not initialized.");
  return signOut(auth);
}
