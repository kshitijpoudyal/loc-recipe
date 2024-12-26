import {addDoc, collection, doc, getDocs, updateDoc} from "firebase/firestore";
import {DAILY_SCHEDULE_TABLE_NAME, db} from "@/app/data/firebaseController/firebase";
import {mockSchedule} from "@/app/data/mockData/DailyScheduleMockData";
import {DailySchedule, Recipe, WeekDay} from "@/app/data/DataInterface";

export const getWeekDayByValue = (weekday: WeekDay): DailySchedule | null => {
    const schedule = mockSchedule.find((schedule) => schedule.weekday.value === weekday.value);
    if (schedule) {
        return schedule
    } else {
        return null
    }
};

export const findRecipeById = (_recipes: Recipe[], recipeId: number): Recipe | undefined => {
    return _recipes.find((recipe) => recipe.recipeId === recipeId);
};

const updateDailySchedule = async (
    weekday: WeekDay,
    updates: Partial<Pick<DailySchedule, "breakfast" | "lunch" | "dinner">>
): Promise<void> => {
    try {
        // Reference to the specific document in the "dailySchedules" collection
        const scheduleRef = doc(db, DAILY_SCHEDULE_TABLE_NAME, weekday.name);

        // Update the specified fields in Firestore
        await updateDoc(scheduleRef, {
            ...updates,
            updatedAt: new Date(),
        });

        console.log(`Daily schedule ${weekday.name} updated successfully.`);
    } catch (error) {
        console.error("Error updating daily schedule:", error);
    }
};

export const fetchAllDailySchedules = async () => {
    const dailyScheduleCollection = collection(db, DAILY_SCHEDULE_TABLE_NAME);
    const dailyScheduleSnapshot = await getDocs(dailyScheduleCollection);
    return dailyScheduleSnapshot.docs.map((doc) => ({
        _id: doc.id,
        ...doc.data(),
    })) as DailySchedule[];
};

export const addScheduleToFirestore = async (dailySchedule: DailySchedule) => {
    const scheduleCollection = collection(db, DAILY_SCHEDULE_TABLE_NAME); // Replace "schedules" with your desired Firestore collection name

    try {
        await addDoc(scheduleCollection, {
            scheduleId: dailySchedule.scheduleId,
            weekday: dailySchedule.weekday,
            breakfast: dailySchedule.breakfast,
            lunch: dailySchedule.lunch,
            dinner: dailySchedule.dinner,
            createdAt: new Date(),
        });
    } catch (error) {
        console.error("Error adding schedule data:", error);
    }
};

