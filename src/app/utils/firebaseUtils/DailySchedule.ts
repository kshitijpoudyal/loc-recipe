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
    try {
        const scheduleDocRef = doc(db, userScheduleCol(userId), weekdayValue);
        await setDoc(scheduleDocRef, {
            weekday: weekdayValue,
            [mealType]: recipeIds,
        }, {merge: true});
    } catch (error) {
        console.error("Error updating schedule:", error);
    }
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
