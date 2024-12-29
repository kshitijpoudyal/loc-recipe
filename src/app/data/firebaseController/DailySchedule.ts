import {collection, doc, getDocs, setDoc, updateDoc} from "firebase/firestore";
import {DAILY_SCHEDULE_TABLE_NAME, db} from "@/app/data/firebaseController/firebase";
import {DailySchedule, MealType, Recipe} from "@/app/data/DataInterface";
import {findRecipeById} from "@/app/data/firebaseController/Recipe";
import {WEEK_DAYS} from "@/app/data/ConstData";

export const updateSchedule = async (
    weekdayValue: string,
    mealType: MealType,
    recipeId: string[],
): Promise<void> => {
    console.log("updateSchedule called")
    try {
        // Reference the document for the specified weekday
        const scheduleDocRef = doc(db, DAILY_SCHEDULE_TABLE_NAME, weekdayValue);

        // Update the breakfast array with the new recipeId
        await updateDoc(scheduleDocRef, {
            [mealType]: recipeId,
        });

        console.log(`RecipeId ${recipeId} successfully added to ${weekdayValue}'s ${mealType}.`);
    } catch (error) {
        console.error("Error updating breakfast schedule:", error);
    }
};

export const fetchAllDailySchedules = async () => {
    const dailyScheduleCollection = collection(db, DAILY_SCHEDULE_TABLE_NAME);
    const dailyScheduleSnapshot = await getDocs(dailyScheduleCollection);
    return dailyScheduleSnapshot.docs.map((doc) => ({
        scheduleId: doc.id,
        ...doc.data(),
    })) as DailySchedule[];
};

export const addScheduleToFirestore = async (dailySchedule: DailySchedule) => {
    const scheduleCollection = collection(db, DAILY_SCHEDULE_TABLE_NAME); // Replace "schedules" with your desired Firestore collection name
    const scheduleDocRef = doc(scheduleCollection, dailySchedule.weekday);
    try {
        await setDoc(scheduleDocRef, {
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

export const mapAllRecipesToSchedule = async (
    recipes: Recipe[]
): Promise<Record<string, Record<MealType, Recipe[]>>> => {
    const dailySchedules = await fetchAllDailySchedules();

    // Create an empty schedule map with nested structure for meal types
    const scheduleLocal: Record<string, Record<MealType, Recipe[]>> = WEEK_DAYS.reduce((acc, day) => {
        acc[day.value] = {
            breakfast: [],
            lunch: [],
            dinner: [],
        };
        return acc;
    }, {} as Record<string, Record<MealType, Recipe[]>>);

    dailySchedules.forEach((schedule) => {
        const addRecipes = (mealType: MealType, recipeIds: string[]) => {
            recipeIds.forEach((recipeId) => {
                const recipe = findRecipeById(recipes, recipeId);
                if (recipe) scheduleLocal[schedule.weekday][mealType].push(recipe);
            });
        };

        // Add recipes for each meal type
        addRecipes("breakfast", schedule.breakfast);
        addRecipes("lunch", schedule.lunch);
        addRecipes("dinner", schedule.dinner);
    });

    return scheduleLocal;
};

