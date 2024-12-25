import React, {useState, useEffect} from 'react';
import {fetchAllRecipes, findRecipeById, Recipe} from "@/app/data/Recipe";
import {DailySchedule, fetchAllDailySchedules, WEEK_DAYS} from "@/app/data/DailySchedule"; // Adjust path for fetching recipes

interface DailyScheduleProps {
    recipesMap: Record<string, Recipe[]>; // A map of days to recipe arrays
}

const DailyScheduleTemplate: React.FC<DailyScheduleProps> = ({recipesMap}) => {
    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="space-y-6">
                {WEEK_DAYS.map((day) => (
                    <div key={day.id} className="border-b pb-4">
                        <h2 className="text-xl font-semibold text-indigo-600">{day.name}</h2>
                        <ul className="space-y-2">
                            {recipesMap[day.id]?.length > 0 ? (
                                recipesMap[day.id].map((recipe) => (
                                    <li key={recipe.recipeId} className="bg-gray-100 p-4 rounded-md shadow-sm">
                                        <h3 className="font-medium">{recipe.name}</h3>
                                        <div className="flex space-x-2">
                                            {recipe.mealType && recipe.mealType.map((type) => (
                                                <span
                                                    key={type}
                                                    className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded-md"
                                                >
                                                        {type}
                                                    </span>
                                            ))}
                                        </div>
                                        <p>Preparation Time: {recipe.prepTime} minutes</p>
                                        <p>Cooking Time: {recipe.cookTime} minutes</p>
                                        <p>Servings: {recipe.servings}</p>
                                    </li>
                                ))
                            ) : (
                                <p>No recipes for today!</p>
                            )}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
};

const fetchDailySchedule = async (): Promise<Record<string, Recipe[]>> => {
    const recipes = await fetchAllRecipes(); // Fetch all recipes
    const dailySchedules = await fetchAllDailySchedules(); // Fetch all recipes
    const scheduleLocal: Record<number, Recipe[]> = {
        0: [],
        1: [],
        2: [],
        3: [],
        4: [],
        5: [],
        6: [],
    };

    dailySchedules.forEach((schedule: DailySchedule) => {
        schedule.breakfast.map((recipeId) => {
            // console.log("breakfast recipe", recipeId)
            const recipe = findRecipeById(recipes, recipeId);
            if (recipe) {
                // console.log("breakfast recipe found", recipe)
                // console.log("recipe id", schedule.weekday.id)
                scheduleLocal[schedule.weekday.id].push(recipe)
            }
        })
        schedule.lunch.map((recipeId) => {
            // console.log("lunch recipe", recipeId)
            const recipe = findRecipeById(recipes, recipeId);
            if (recipe) {
                scheduleLocal[schedule.weekday.id].push(recipe)
            }
        })
        schedule.dinner.map((recipeId) => {
            // console.log("dinner recipe", recipeId)
            const recipe = findRecipeById(recipes, recipeId);
            if (recipe) {
                scheduleLocal[schedule.weekday.id].push(recipe)
            }
        })
    });
    return scheduleLocal;
};

export default function DailyScheduleComponent() {
    const [recipesMap, setRecipesMap] = useState<Record<string, Recipe[]>>({});

    useEffect(() => {
        const loadSchedule = async () => {
            const dailySchedule = await fetchDailySchedule();
            setRecipesMap(dailySchedule);
        };

        loadSchedule();
    }, []);

    console.log(recipesMap)

    return <DailyScheduleTemplate recipesMap={recipesMap}/>;
}
