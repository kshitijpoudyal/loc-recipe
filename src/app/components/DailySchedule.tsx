import React, {useState, useEffect} from 'react';
import {Recipe} from "@/app/data/DataInterface";
import {WEEK_DAYS} from "@/app/data/ConstData";
import {mapAllRecipesToSchedule} from "@/app/data/firebaseController/DailySchedule";
import {fetchAllRecipes} from "@/app/data/firebaseController/Recipe";
import {SelectorForMealType} from "@/app/components/RecipeSelector";

interface DailyScheduleComponentTemplateProps {
    recipes: Recipe[];
}

export default function DailyScheduleComponent() {
    const [recipesMap, setRecipesMap] = useState<Record<string, Recipe[]>>({});
    const [allRecipe, setAllRecipe] = useState<Recipe[]>([]);

    useEffect(() => {
        const loadSchedule = async () => {
            const recipes = await fetchAllRecipes();
            setAllRecipe(recipes);
            return await mapAllRecipesToSchedule(recipes);
        };

        loadSchedule().then((_recipesMap) => {
            //TODO add loading state
            setRecipesMap(_recipesMap);
        })
    }, []);

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="space-y-6">
                {WEEK_DAYS.map((day) => (
                    <div key={day.id} className="border-b pb-4">
                        <h2 className="text-xl font-semibold text-indigo-600">{day.name}</h2>
                        <ul className="space-y-2">
                            <SelectorForMealType recipes={allRecipe} weekDay={day}/>
                            <DailyScheduleComponentTemplate recipes={recipesMap[day.value]}/>
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
}

const DailyScheduleComponentTemplate: React.FC<DailyScheduleComponentTemplateProps> = ({recipes}) => {
    return (
        <div>
            {recipes?.length > 0 ? (
                recipes.map((recipe) => (
                    <li key={recipe.recipeId} className="bg-gray-100 p-4 rounded-md shadow-sm">
                        <h3 className="font-medium">{recipe.name}</h3>
                        <p>Preparation Time: {recipe.prepTime} minutes</p>
                        <p>Cooking Time: {recipe.cookTime} minutes</p>
                        <p>Servings: {recipe.servings}</p>
                    </li>
                ))
            ) : (
                <p>No recipes for today!</p>
            )}
        </div>
    );
}
