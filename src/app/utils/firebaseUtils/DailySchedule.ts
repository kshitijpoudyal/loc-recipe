import {collection, doc, getDocs, setDoc} from "firebase/firestore";
import {db, userScheduleCol} from "@/app/config/firebase";
import {DailySchedule, MealType, Recipe} from "@/app/data/DataInterface";
import {WEEK_DAYS} from "@/app/data/ConstData";

export const updateSchedule = async (
    weekdayValue: string,
    mealType: MealType,
    recipeIds: string[],
    userId: string,
): Promise<void> => {
    // Errors propagate so callers can tell the user the save failed.
    const scheduleDocRef = doc(db, userScheduleCol(userId), weekdayValue);
    await setDoc(scheduleDocRef, {
        weekday: weekdayValue,
        // De-duplicate so a recipe can't appear twice in the same slot.
        [mealType]: Array.from(new Set(recipeIds)),
    }, {merge: true});
};

export const fetchAllDailySchedules = async (userId: string): Promise<DailySchedule[]> => {
    const snapshot = await getDocs(collection(db, userScheduleCol(userId)));
    return snapshot.docs.map(d => ({scheduleId: d.id, ...d.data()})) as DailySchedule[];
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
            // Skip duplicate IDs (older data may contain them) to keep React keys unique.
            new Set(recipeIds).forEach((recipeId) => {
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
