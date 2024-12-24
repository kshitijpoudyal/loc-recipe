import React, {useState, useEffect} from 'react';
import {fetchRecipes, Recipe} from "@/app/data/Recipe";
import {daysOfWeek} from "@/app/data/DailySchedule"; // Adjust path for fetching recipes

interface DailyScheduleProps {
    recipesMap: Record<string, Recipe[]>; // A map of days to recipe arrays
}

const DailySchedule: React.FC<DailyScheduleProps> = ({recipesMap}) => {

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-bold text-center mb-6">Daily Recipe Schedule</h1>
            <div className="space-y-6">
                {daysOfWeek.map((day) => (
                    <div key={day} className="border-b pb-4">
                        <h2 className="text-xl font-semibold text-indigo-600">{day}</h2>
                        <ul className="space-y-2">
                            {recipesMap[day]?.length > 0 ? (
                                recipesMap[day].map((recipe) => (
                                    <li key={recipe.id} className="bg-gray-100 p-4 rounded-md shadow-sm">
                                        <h3 className="font-medium">{recipe.name}</h3>
                                        <div className="flex space-x-2">
                                            {recipe.mealType.map((type) => (
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
    const recipes = await fetchRecipes(); // Fetch all recipes
    const schedule: Record<string, Recipe[]> = {
        sunday: [],
        monday: [],
        tuesday: [],
        wednesday: [],
        thursday: [],
        friday: [],
        saturday: [],
    };

    recipes.forEach((recipe: Recipe) => {
        if (recipe.daysOfTheWeek && recipe.daysOfTheWeek.length > 0) {
            daysOfWeek.forEach((day) => {
                if (recipe.daysOfTheWeek!!.includes(day)) {
                        schedule[day].push(recipe);
                }
            })
        }
    });

    return schedule;
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

    return <DailySchedule recipesMap={recipesMap}/>;
}
