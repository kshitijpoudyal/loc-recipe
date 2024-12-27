import React, {useState, useEffect} from 'react';
import {MealType, Recipe, WeekDay} from "@/app/data/DataInterface";
import {WEEK_DAYS} from "@/app/data/ConstData";
import {mapAllRecipesToSchedule} from "@/app/data/firebaseController/DailySchedule";
import {fetchAllRecipes} from "@/app/data/firebaseController/Recipe";
import {SelectorForMealType} from "@/app/components/RecipeSelector";
import RecipeCard from "@/app/components/RecipeCard";

interface DailyScheduleComponentTemplateProps {
    schedule: Record<string, Record<MealType, Recipe[]>>;
    weekDay: WeekDay;
}

export default function DailyScheduleComponent() {
    const [recipesMap, setRecipesMap] = useState<Record<string, Record<MealType, Recipe[]>>>({});
    const [allRecipe, setAllRecipe] = useState<Recipe[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadSchedule = async () => {
            try {
                const recipes = await fetchAllRecipes();
                setAllRecipe(recipes);
                const mappedRecipes = await mapAllRecipesToSchedule(recipes);
                setRecipesMap(mappedRecipes);
            } catch (error) {
                console.error("Error loading schedule:", error);
            } finally {
                setLoading(false);
            }
        };

        loadSchedule().then(() => {
            setLoading(false);
        })
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="space-y-8">
                {WEEK_DAYS.map((day) => (
                    <div key={day.id} className="border-b pb-6">
                        <h2 className="text-2xl font-bold text-indigo-600">{day.name}</h2>
                        <DailyScheduleComponentTemplate schedule={recipesMap} weekDay={day}/>
                        <div className="mt-6">
                            <SelectorForMealType recipes={allRecipe} weekDay={day}/>
                        </div>
                    </div>
                ))}
            </div>
        </div>

    );
}

const DailyScheduleComponentTemplate: React.FC<DailyScheduleComponentTemplateProps> = ({schedule, weekDay}) => {
    return (
        <div className="mt-4 space-y-4">
            {(["breakfast", "lunch", "dinner"] as MealType[]).map((mealType) => (
                <div key={mealType} className="bg-white rounded-lg shadow p-4">
                    <h3 className="text-lg font-semibold text-gray-800 capitalize mb-2">
                        {mealType}
                    </h3>
                    <ul className="flex flex-wrap gap-4">
                        {schedule[weekDay.value]?.[mealType]?.length > 0 ? (
                            schedule[weekDay.value][mealType].map((recipe) => (
                                <RecipeCard key={recipe.recipeId} recipe={recipe} isPreview={true}/>
                            ))
                        ) : (
                            <p className="text-gray-500 italic text-sm">Not yet scheduled!</p>
                        )}
                    </ul>
                </div>
            ))}
        </div>
    );
};