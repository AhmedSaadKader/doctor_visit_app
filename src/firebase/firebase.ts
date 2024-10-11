// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics, isSupported } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';
import admin, { ServiceAccount } from 'firebase-admin';
import serviceAccount from './firebase_service_account.json';
import dotenv from 'dotenv';

dotenv.config();

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: 'G-F4PXPVM6SS'
};

// Initialize Firebase
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as ServiceAccount)
});
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Check if the environment supports analytics (browser only)
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      const analytics = getAnalytics(app);
      console.log('Analytics initialized');
    } else {
      console.log('Analytics not supported');
    }
  });
} else {
  console.log('Not a browser environment - Analytics skipped');
}

export { app, auth };
