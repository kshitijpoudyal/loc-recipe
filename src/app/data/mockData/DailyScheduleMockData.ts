import {dailyScheduleTableName, db} from '../../lib/firebase';
import { collection, doc, setDoc } from 'firebase/firestore';

// Schedule data for each day with meal types
export const daysData = {
    Monday: {
        breakfast: 1001, // Recipe ID range from 1001 to 1006
        lunch: 1002,
        dinner: 1003,
    },
    Tuesday: {
        breakfast: 1004,
        lunch: 1005,
        dinner: 1006,
    },
    Wednesday: {
        breakfast: 1001,
        lunch: 1002,
        dinner: 1003,
    },
    Thursday: {
        breakfast: 1004,
        lunch: 1005,
        dinner: 1006,
    },
    Friday: {
        breakfast: 1001,
        lunch: 1002,
        dinner: 1003,
    },
    Saturday: {
        breakfast: 1004,
        lunch: 1005,
        dinner: 1006,
    },
    Sunday: {
        breakfast: 1001,
        lunch: 1002,
        dinner: 1003,
    },
};

// Function to add daily schedule with weekdays as top-level documents
export const addMockDailyScheduleToFirebase = async () => {

    try {
        // Iterate through each day of the week and create documents
        for (const [day, meals] of Object.entries(daysData)) {
            const dayDocRef = doc(collection(db, dailyScheduleTableName), day); // Top-level document for each day

            await setDoc(dayDocRef, meals);

            console.log(`Daily schedule for ${day} added successfully!`);
        }
    } catch (error) {
        console.error("Error adding daily schedule: ", error);
    }
};