import {MealType, Recipe, WeekDay} from "@/app/data/DataInterface";
import React, {useState} from "react";
import {Dialog, DialogBackdrop, DialogPanel} from "@headlessui/react";
import {XMarkIcon} from "@heroicons/react/20/solid";
import RecipeCard from "@/app/components/baseComponents/RecipeCard";
import {updateSchedule} from "@/app/utils/firebaseUtils/DailySchedule";
import {getImageCheckBoxCss} from "@/app/utils/CssUtils";

export interface AssignRecipeToWeekDayProps {
    isOpen: boolean;
    recipes: Recipe[];
    setIsOpenAction: (open: boolean, reload?: boolean) => void;
    weekDay: WeekDay;
    mealType: MealType;
    selectedRecipeList: Recipe[]
}

export const AssignRecipeToWeekDay: React.FC<AssignRecipeToWeekDayProps> = (assignRecipeToWeekDayProps: AssignRecipeToWeekDayProps) => {
    const [selectedRecipes, setSelectedRecipes] = useState<Recipe[]>(assignRecipeToWeekDayProps.selectedRecipeList);

    const toggleSelection = (recipe: Recipe) => {
        setSelectedRecipes((prevSelected) => {
            const isAlreadySelected = prevSelected.includes(recipe);
            if (isAlreadySelected) {
                return prevSelected.filter((_recipe) => _recipe !== recipe);
            } else {
                return [...prevSelected, recipe];
            }
        });
    };

    const handleUpdateSchedule = async () => {
        try {
            const recipeIds: string[] = [];
            if (selectedRecipes && selectedRecipes.length > 0) {
                selectedRecipes.map((r) => {
                    if (r.recipeId != null) {
                        recipeIds.push(r.recipeId);
                    }
                });
            }
            updateSchedule(assignRecipeToWeekDayProps.weekDay.value, assignRecipeToWeekDayProps.mealType, recipeIds).then(() => {
                assignRecipeToWeekDayProps.setIsOpenAction(false, true);
            })
        } catch (error) {
            console.error('Error assigning recipes to schedule:', error);
        }
    };

    return (
        <Dialog open={assignRecipeToWeekDayProps.isOpen}
                onClose={() => assignRecipeToWeekDayProps.setIsOpenAction(false)} className="relative z-10">
            <DialogBackdrop
                transition
                className="fixed inset-0 hidden bg-gray-500/75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in md:block"
            />
            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div
                    className="flex min-h-full items-stretch justify-center text-center md:items-center md:px-2 lg:px-4">
                    <DialogPanel
                        transition
                        className="flex w-full transform text-left text-base transition data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in md:my-8 md:max-w-2xl md:px-4 data-[closed]:md:translate-y-0 data-[closed]:md:scale-95 lg:max-w-4xl"
                    >
                        <div
                            className="relative flex w-full items-center overflow-hidden bg-white px-4 pb-8 pt-14 shadow-2xl sm:px-6 sm:pt-8 md:p-6 lg:p-8">
                            <button
                                type="button"
                                onClick={() => assignRecipeToWeekDayProps.setIsOpenAction(false)}
                                className="absolute right-4 top-4 text-gray-400 hover:text-gray-500 sm:right-6 sm:top-8 md:right-6 md:top-6 lg:right-8 lg:top-8"
                            >
                                <span className="sr-only">Close</span>
                                <XMarkIcon aria-hidden="true" className="size-6"/>
                            </button>

                            <div
                                className="grid w-full items-start gap-x-6 gap-y-8 lg:gap-x-8">
                                <section aria-labelledby="options-heading" className="mt-6">
                                    <div className="flex justify-center">
                                        <fieldset>
                                            <div className="mt-1 grid grid-cols-2 gap-4 sm:grid-cols-4">
                                                {assignRecipeToWeekDayProps.recipes.map((recipe) => (
                                                    <div
                                                        key={recipe.recipeId}
                                                        onClick={() => toggleSelection(recipe)}
                                                        className={`cursor-pointer rounded-lg border p-4 ${
                                                            selectedRecipes.includes(recipe)
                                                                ? getImageCheckBoxCss()
                                                                : getImageCheckBoxCss(false)
                                                        }`}
                                                    >
                                                        <RecipeCard recipe={recipe} isPreview={true}/>
                                                    </div>
                                                ))}
                                            </div>
                                        </fieldset>
                                    </div>
                                    <div className="mt-6">
                                        <button
                                            onClick={handleUpdateSchedule}
                                            className="flex w-full items-center justify-center rounded-md border border-transparent bg-green-600 px-8 py-3 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-50"
                                        >
                                            Assign
                                        </button>
                                    </div>
                                </section>
                            </div>
                        </div>
                    </DialogPanel>
                </div>
            </div>
        </Dialog>
    )
}