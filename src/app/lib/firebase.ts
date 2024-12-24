// Import the necessary functions from Firebase SDK
import {initializeApp} from 'firebase/app';
import {getFirestore} from 'firebase/firestore';

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

export const recipeTableName = "recipe";

export const dailyScheduleTableName = "dailySchedule";

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);
