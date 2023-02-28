import { getApp, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_MEASUREMENT_ID
};

function createFirebaseApp(config) {
  try {
    return getApp();
  } catch(e) {
    return initializeApp(config);
  }
}

const app = createFirebaseApp(firebaseConfig);

export const firebaseAuth = getAuth(app);
export const firebaseAnalytics = typeof window !== "undefined" ? getAnalytics(app) : null;