import {DAILY_SCHEDULE_TABLE_NAME, db} from '../../lib/firebase';
import {addDoc, collection, doc, setDoc} from 'firebase/firestore';
import {DailySchedule, WEEK_DAYS} from "@/app/data/DailySchedule";

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

const mockSchedule: DailySchedule[] = [
    {
        scheduleId: 1000,
        weekday: WEEK_DAYS[0],
        breakfast: [1001, 1002],
        lunch: [1003, 1004],
        dinner: [1005],
    },
    {
        scheduleId: 1001,
        weekday: WEEK_DAYS[1],
        breakfast: [1002],
        lunch: [1005],
        dinner: [1006]
    },
    {
        scheduleId: 1002,
        weekday: WEEK_DAYS[2],
        breakfast: [1003],
        lunch: [1004],
        dinner: [1005]
    },
    {
        scheduleId: 1003,
        weekday: WEEK_DAYS[3],
        breakfast: [1003],
        lunch: [1004],
        dinner: [1005]
    },
    {
        scheduleId: 1004,
        weekday: WEEK_DAYS[4],
        breakfast: [1006],
        lunch: [1004],
        dinner: [1005]
    },
    {
        scheduleId: 1005,
        weekday: WEEK_DAYS[5],
        breakfast: [],
        lunch: [],
        dinner: []
    },
    {
        scheduleId: 1006,
        weekday: WEEK_DAYS[6],
        breakfast: [],
        lunch: [],
        dinner: []
    }
]

export const addMockScheduleToFirestore = async () => {
    const scheduleCollection = collection(db, DAILY_SCHEDULE_TABLE_NAME); // Replace "schedules" with your desired Firestore collection name

    try {
        for (const schedule of mockSchedule) {
            await addDoc(scheduleCollection, {
                scheduleId: schedule.scheduleId,
                weekday: schedule.weekday, // Optionally, save the name and value only if needed
                breakfast: schedule.breakfast,
                lunch: schedule.lunch,
                dinner: schedule.dinner,
                createdAt: new Date(),
            });
        }
        console.log("Mock schedule data added successfully!");
    } catch (error) {
        console.error("Error adding mock schedule data:", error);
    }
};