// Import the necessary functions from Firebase SDK
import {initializeApp} from 'firebase/app';
import {getFirestore} from 'firebase/firestore';
import { getStorage } from "firebase/storage";
import { getAuth } from 'firebase/auth';

// Firebase configuration (replace with your own Firebase project config)
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_APP_ID,
};


export const RECIPE_TABLE_NAME = "recipe";
export const DAILY_SCHEDULE_TABLE_NAME = "dailySchedule";

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);
export const storage = getStorage(app); // Firebase Storage instance
export const auth = getAuth(app);
