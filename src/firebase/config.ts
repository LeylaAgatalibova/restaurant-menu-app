// This file initializes the Firebase SDK exactly once and exports the
// two services we use: Auth and Firestore.
//
// Note: Firebase Storage is NOT used in this project. Product images are
// uploaded to Cloudinary instead (see src/services/storage.service.ts),
// since Firebase Storage requires the Blaze (pay-as-you-go) plan.
//
// Every value below comes from environment variables so no secrets are
// hardcoded in the source code. See .env.example for the full list.
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// getApps()/getApp() guard against Next.js re-initializing Firebase on
// every hot reload in development, which would otherwise throw an error.
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
