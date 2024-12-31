import React, {useState, useMemo, useCallback, useEffect} from 'react';
import {MealType, Recipe, WeekDay} from "@/app/data/DataInterface";
import {DEFAULT_RECIPE, MEAL_TYPES, WEEK_DAYS} from "@/app/data/ConstData";
import {mapAllRecipesToSchedule} from "@/app/utils/firebaseUtils/DailySchedule";
import {fetchAllRecipes} from "@/app/utils/firebaseUtils/Recipe";
import RecipeCard from "@/app/components/baseComponents/RecipeCard";
import {LoaderComponent} from "@/app/components/baseComponents/LoaderView";
import AddImageIcon from "@/app/components/baseComponents/AddImageIcon";
import {AssignRecipeToWeekDay, AssignRecipeToWeekDayProps} from "@/app/components/AssignRecipeToWeekDay";
import RecipeDetailsTemplate from "@/app/components/RecipeDetailsTemplate";
import {FolderOpenIcon} from "@heroicons/react/20/solid";
import {getLocalWeekdayNumber} from "@/app/utils/dateUtils";

export default function DailyScheduleComponent() {
    const [recipesMap, setRecipesMap] = useState<Record<string, Record<MealType, Recipe[]>>>({});
    const [allRecipe, setAllRecipe] = useState<Recipe[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAddRecipeOpen, setIsAddRecipeOpen] = useState(false);
    const [isRecipeDetailsOpen, setIsRecipeDetailsOpen] = useState(false);
    const [selectedRecipeForDetails, setSelectedRecipeForDetails] = useState<Recipe>(DEFAULT_RECIPE);
    const [activeAccordion, setActiveAccordion] = useState<number | null>(getLocalWeekdayNumber()); // Track active accordion

    function callbackAfterRecipeChange(isAddRecipeOpen: boolean, refreshPage?: boolean) {
        setIsAddRecipeOpen(isAddRecipeOpen);
        if (refreshPage) {
            window.location.reload();
        }
    }

    const [recipeToWeekDayProps, setRecipeToWeekDayProps] = useState<AssignRecipeToWeekDayProps>({
        isOpen: false,
        recipes: [DEFAULT_RECIPE],
        setIsOpenAction: callbackAfterRecipeChange,
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

        loadSchedule();
    }, []);

    const handleAddImageClick = useCallback(
        (day: WeekDay, mealType: MealType, selectedRecipes: Recipe[]) => {
            setIsAddRecipeOpen(true);
            setRecipeToWeekDayProps({
                isOpen: true,
                recipes: allRecipe,
                setIsOpenAction: callbackAfterRecipeChange,
                weekDay: day,
                mealType: mealType,
                selectedRecipeList: selectedRecipes
            });
        },
        [allRecipe]
    );

    // Memoize the component rendering with accordion
    const renderDayCards = useMemo(() => {
        const toggleAccordion = (dayId: number) => {
            setActiveAccordion(activeAccordion === dayId ? null : dayId);
        };

        return WEEK_DAYS.map((day) => (
            <div key={day.id}>
                <button
                    className="w-full text-left text-2xl font-bold text-green-700 p-4 rounded-lg border-b mb-4 flex"
                    onClick={() => toggleAccordion(day.id)}
                >
                    {day.name} <FolderOpenIcon aria-hidden="true" className="size-10 text-gray-500"/>
                </button>
                {activeAccordion === day.id && (
                    <div className="p-4 space-y-4 shadow rounded-xl bg-white">
                        {MEAL_TYPES.map((mealType) => (
                            <div key={mealType} className="rounded-lg p-6">
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
                                                    onClick={() => {
                                                        setIsRecipeDetailsOpen(true);
                                                        setSelectedRecipeForDetails(recipe);
                                                    }}
                                                >
                                                    <RecipeCard recipe={recipe} isPreview={true}/>
                                                </li>
                                            ))}
                                            <li
                                                className="flex flex-col h-full w-40"
                                                onClick={() =>
                                                    handleAddImageClick(day, mealType, recipesMap[day.value][mealType])
                                                }
                                            >
                                                <AddImageIcon/>
                                            </li>
                                        </>
                                    ) : (
                                        <li
                                            className="flex flex-col h-full w-40"
                                            onClick={() =>
                                                handleAddImageClick(day, mealType, recipesMap[day.value][mealType])
                                            }
                                        >
                                            <AddImageIcon/>
                                        </li>
                                    )}
                                </ul>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        ));
    }, [activeAccordion, recipesMap, handleAddImageClick]);

    if (loading) {
        return <LoaderComponent loading={loading}/>;
    }

    return (
        <div>
            {isAddRecipeOpen && <AssignRecipeToWeekDay {...recipeToWeekDayProps} />}
            {isRecipeDetailsOpen && (
                <RecipeDetailsTemplate
                    isOpen={isRecipeDetailsOpen}
                    recipe={selectedRecipeForDetails}
                    setIsOpenAction={setIsRecipeDetailsOpen}
                />
            )}
            <div className="p-6">
                <div className="space-y-8">{renderDayCards}</div>
            </div>
        </div>
    );
}
