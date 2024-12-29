import React, {useState, useEffect} from 'react';
import {MealType, Recipe, WeekDay} from "@/app/data/DataInterface";
import {DEFAULT_RECIPE, MEAL_TYPES, WEEK_DAYS} from "@/app/data/ConstData";
import {mapAllRecipesToSchedule} from "@/app/data/firebaseController/DailySchedule";
import {fetchAllRecipes} from "@/app/data/firebaseController/Recipe";
import RecipeCard from "@/app/components/RecipeCard";
import {LoaderComponent} from "@/app/components/LoaderView";
import AddImage from "@/app/components/AddImage";
import {AssignRecipeToWeekDay, AssignRecipeToWeekDayProps} from "@/app/components/SelectRecipeFromWeekDay";

export default function DailyScheduleComponent() {
    const [recipesMap, setRecipesMap] = useState<Record<string, Record<MealType, Recipe[]>>>({});
    const [allRecipe, setAllRecipe] = useState<Recipe[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAddRecipeOpen, setIsAddRecipeOpen] = useState(false);
    const [recipeToWeekDayProps, setRecipeToWeekDayProps] = useState<AssignRecipeToWeekDayProps>({
        isOpen: false,
        recipes: [DEFAULT_RECIPE],
        setIsOpenAction: () => {
        },
        weekDay: WEEK_DAYS[0],
        mealType: MEAL_TYPES[0],
        selectedRecipeList: [DEFAULT_RECIPE]
    });

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

    const handleAddImageClick = (day: WeekDay, mealType: MealType, selectedRecipes: Recipe[]) => {
        setIsAddRecipeOpen(true);
        const assignRecipeToWeekDayProps: AssignRecipeToWeekDayProps = {
            isOpen: true,
            recipes: allRecipe,
            setIsOpenAction: setIsAddRecipeOpen,
            weekDay: day,
            mealType: mealType,
            selectedRecipeList: selectedRecipes
        }
        setRecipeToWeekDayProps(assignRecipeToWeekDayProps)
    };

    return (
        <div>
            {isAddRecipeOpen && (
                <AssignRecipeToWeekDay
                    {
                        ...recipeToWeekDayProps
                    }
                />
            )}
            <div className="max-w-4xl mx-auto p-6">
                <div className="space-y-8">
                    {WEEK_DAYS.map((day) => (
                        <div key={day.id} className="border-b pb-6">
                            <h2 className="text-2xl font-bold text-green-700">{day.name}</h2>
                            <div className="mt-4 space-y-4">
                                {MEAL_TYPES.map((mealType) => (
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
                                                    <li className="flex flex-col h-full w-40"
                                                        onClick={() => handleAddImageClick(day, mealType, recipesMap[day.value][mealType])}>
                                                        <AddImage/>
                                                    </li>
                                                </>
                                            ) : (
                                                <li className="flex flex-col h-full w-40"
                                                    onClick={() => handleAddImageClick(day, mealType, recipesMap[day.value][mealType])}>
                                                    <AddImage/>
                                                </li>
                                            )}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}