import React, {useState, useEffect} from 'react';
import {MealType, Recipe} from "@/app/data/DataInterface";
import {WEEK_DAYS} from "@/app/data/ConstData";
import {mapAllRecipesToSchedule} from "@/app/data/firebaseController/DailySchedule";
import {fetchAllRecipes} from "@/app/data/firebaseController/Recipe";
import {SelectorForMealType} from "@/app/components/RecipeSelector";
import RecipeCard from "@/app/components/RecipeCard";
import {LoaderComponent} from "@/app/components/LoaderView";
import AddImage from "@/app/components/AddImage";
import {AssignRecipeToWeekDay} from "@/app/components/SelectRecipeFromWeekDay";

export default function DailyScheduleComponent() {
    const [recipesMap, setRecipesMap] = useState<Record<string, Record<MealType, Recipe[]>>>({});
    const [allRecipe, setAllRecipe] = useState<Recipe[]>([]);
    const [loading, setLoading] = useState(true);
    const [addRecipeOpen, setAddRecipeOpen] = useState(false);

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
            <LoaderComponent loading={loading}/>
        );
    }

    const handleAddImageClick = () => {
        setAddRecipeOpen(true); // Open the dialog
    };

    return (
        <div>
            {addRecipeOpen && (
                <AssignRecipeToWeekDay addRecipeOpen={addRecipeOpen} recipes={allRecipe}
                                       setIsOpenAction={setAddRecipeOpen}/>
            )}
            <div className="max-w-4xl mx-auto p-6">
                <div className="space-y-8">
                    {WEEK_DAYS.map((day) => (
                        <div key={day.id} className="border-b pb-6">
                            <h2 className="text-2xl font-bold text-green-700">{day.name}</h2>
                            <div className="mt-4 space-y-4">
                                {(["breakfast", "lunch", "dinner"] as MealType[]).map((mealType) => (
                                    <div key={mealType} className="frounded-lg shadow p-6 bg-gradient-to-b">
                                        <h3 className="text-lg font-semibold text-gray-800 capitalize mb-2">
                                            {mealType}
                                        </h3>
                                        <ul className="flex flex-wrap gap-4 justify-center sm:justify-start">
                                            {recipesMap[day.value]?.[mealType]?.length > 0 ? (
                                                <>
                                                    {recipesMap[day.value][mealType].map((recipe) => (
                                                        <li
                                                            key={recipe.recipeId}
                                                            className="flex flex-col h-full w-40"
                                                        >
                                                            <RecipeCard recipe={recipe} isPreview={true}/>
                                                        </li>
                                                    ))}
                                                    <li className="flex flex-col h-full w-40" onClick={handleAddImageClick}>
                                                        <AddImage/>
                                                    </li>
                                                </>
                                            ) : (
                                                <li className="flex flex-col h-full w-40" onClick={handleAddImageClick}>
                                                    <AddImage/>
                                                </li>
                                            )}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-6">
                                <SelectorForMealType recipes={allRecipe} weekDay={day}/>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}