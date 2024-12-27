// Import the necessary functions from Firebase SDK
import {initializeApp} from 'firebase/app';
import {getFirestore} from 'firebase/firestore';
import { getStorage } from "firebase/storage";
import { getAuth } from 'firebase/auth';

// Firebase configuration (replace with your own Firebase project config)
const firebaseConfig = {
    apiKey: "AIzaSyCIQ6Fdv7mxpib9ykhCYw0Em0xdddhwWII",
    authDomain: "loc-recipe.firebaseapp.com",
    projectId: "loc-recipe",
    storageBucket: "loc-recipe.firebasestorage.app",
    messagingSenderId: "397427942472",
    appId: "1:397427942472:web:be949bc3d231689691247d",
    measurementId: "G-BGF2SSQLCM"
};

export const RECIPE_TABLE_NAME = "recipe";

export const DAILY_SCHEDULE_TABLE_NAME = "dailySchedule";

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);
export const storage = getStorage(app); // Firebase Storage instance
export const auth = getAuth(app);
