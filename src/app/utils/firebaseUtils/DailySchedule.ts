import {collection, doc, getDocs, setDoc} from "firebase/firestore";
import {dailyScheduleTable, db} from "@/app/config/firebase";
import {DailySchedule, MealType, Recipe} from "@/app/data/DataInterface";
import {WEEK_DAYS} from "@/app/data/ConstData";

export const updateSchedule = async (
    weekdayValue: string,
    mealType: MealType,
    recipeId: string[],
): Promise<void> => {
    console.log("updateSchedule called")
    try {
        // Reference the document for the specified weekday
        const scheduleDocRef = doc(db, dailyScheduleTable, weekdayValue);

        // Create document if missing, otherwise update the specified meal type
        await setDoc(scheduleDocRef, {
            weekday: weekdayValue,
            [mealType]: recipeId,
        }, {merge: true});

        console.log(`RecipeId ${recipeId} successfully added to ${weekdayValue}'s ${mealType}.`);
    } catch (error) {
        console.error("Error updating breakfast schedule:", error);
    }
};

export const fetchAllDailySchedules = async () => {
    const dailyScheduleCollection = collection(db, dailyScheduleTable);
    const dailyScheduleSnapshot = await getDocs(dailyScheduleCollection);
    return dailyScheduleSnapshot.docs.map((doc) => ({
        scheduleId: doc.id,
        ...doc.data(),
    })) as DailySchedule[];
};

export const addScheduleToFirestore = async (dailySchedule: DailySchedule) => {
    const scheduleCollection = collection(db, dailyScheduleTable); // Replace "schedules" with your desired Firestore collection name
    const scheduleDocRef = doc(scheduleCollection, dailySchedule.weekday);
    try {
        await setDoc(scheduleDocRef, {
            weekday: dailySchedule.weekday,
            breakfast: dailySchedule.breakfast,
            lunch: dailySchedule.lunch,
            dinner: dailySchedule.dinner,
            createdBy: dailySchedule.createdBy,
            createdAt: new Date(),
        });
    } catch (error) {
        console.error("Error adding schedule data:", error);
    }
};

export const mapAllRecipesToSchedule = (
    recipes: Recipe[],
    dailySchedules: DailySchedule[]
): Record<string, Record<MealType, Recipe[]>> => {
    const recipeMap = new Map(recipes.map(r => [r.recipeId!, r]));

    const scheduleLocal: Record<string, Record<MealType, Recipe[]>> = WEEK_DAYS.reduce((acc, day) => {
        acc[day.value] = {breakfast: [], lunch: [], dinner: []};
        return acc;
    }, {} as Record<string, Record<MealType, Recipe[]>>);

    dailySchedules.forEach((schedule) => {
        const weekdayKey = schedule.weekday ?? schedule.scheduleId;
        if (!weekdayKey || !scheduleLocal[weekdayKey]) return;

        const addRecipes = (mealType: MealType, recipeIds: string[]) => {
            recipeIds.forEach((recipeId) => {
                const recipe = recipeMap.get(recipeId);
                if (recipe) scheduleLocal[weekdayKey][mealType].push(recipe);
            });
        };

        addRecipes("breakfast", schedule.breakfast ?? []);
        addRecipes("lunch", schedule.lunch ?? []);
        addRecipes("dinner", schedule.dinner ?? []);
    });

    return scheduleLocal;
};

