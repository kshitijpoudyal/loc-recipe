import React, {useState} from 'react';
import {MealType, Recipe, WeekDay} from "@/app/data/DataInterface";
import {
    DisclosureButton,
    DisclosurePanel,
    Listbox,
    ListboxButton,
    ListboxOption,
    ListboxOptions
} from "@headlessui/react";
import {Disclosure} from "@headlessui/react";
import {CheckIcon, ChevronDownIcon} from "@heroicons/react/20/solid";
import {updateSchedule} from "@/app/data/firebaseController/DailySchedule";
import {ChevronUpDownIcon} from "@heroicons/react/16/solid";

interface RecipeSelectorProps {
    recipes: Recipe[];
    mealType: MealType;
    weekDay: WeekDay;
}

interface SelectorForMealTypeProps {
    recipes: Recipe[];
    weekDay: WeekDay;
}

export const RecipeSelector: React.FC<RecipeSelectorProps> = ({recipes, mealType, weekDay}) => {
    const [selectedRecipes, setSelectedRecipes] = useState<Recipe[]>([]);

    const handleUpdateSchedule = async () => {

        try {
            const recipeIds: string[] = []
            selectedRecipes.map((r) => {
                if (r.recipeId != null) {
                    recipeIds.push(r.recipeId);
                }
            })
            alert(`Recipes assigned to ${weekDay.name}!`);
            await updateSchedule(weekDay.value, mealType, recipeIds);
        } catch (error) {
            console.error('Error assigning recipes to schedule:', error);
        }
    };

    return (
        <div className="my-4">
            <Listbox value={selectedRecipes} onChange={setSelectedRecipes} multiple>
                <div className="relative mt-2.5">
                    <ListboxButton
                        className="grid w-full cursor-default grid-cols-1 rounded-md bg-white px-3.5 py-2 text-left text-gray-900 shadow-sm sm:text-sm"
                    >
                        <span className="truncate">
                            {selectedRecipes.length > 0
                                ? selectedRecipes.map((recipe) => recipe.name).join(", ")
                                : `Select ${mealType} recipes`}
                        </span>
                        <ChevronUpDownIcon
                            aria-hidden="true"
                            className="w-5 h-5 absolute inset-y-0 right-3 text-gray-500"
                        />
                    </ListboxButton>
                    <ListboxOptions
                        className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm"
                    >
                        {recipes.map((recipe) => (
                            <ListboxOption
                                key={recipe.recipeId}
                                value={recipe}
                                className="relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900"
                            >
                                <span
                                    className={`block truncate ${
                                        selectedRecipes.includes(recipe) ? "font-semibold" : "font-normal"
                                    }`}
                                >
                                    {recipe.name}
                                </span>
                                {selectedRecipes.includes(recipe) && (
                                    <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-indigo-600">
                                        <CheckIcon aria-hidden="true" className="w-5 h-5"/>
                                    </span>
                                )}
                            </ListboxOption>
                        ))}
                    </ListboxOptions>
                </div>
            </Listbox>
            <button
                onClick={handleUpdateSchedule}
                className="mt-4 w-full rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
            >
                Update {mealType} Schedule
            </button>
        </div>
    );
};

export const SelectorForMealType: React.FC<SelectorForMealTypeProps> = ({recipes, weekDay}) => {
    return (
        <div className="p-4">
            <div className="p-4">
                <div className="sm:col-span-2">
                    {/* Breakfast Accordion */}
                    <Disclosure>
                        {({open}) => (
                            <>
                                <DisclosureButton
                                    className="w-full text-left flex items-center justify-between p-4 bg-gray-200 text-gray-900 font-semibold rounded-md">
                                    <span>Select Recipes for Breakfast</span>
                                    <ChevronDownIcon
                                        className={`h-5 w-5 ${open ? "transform rotate-180" : ""}`}
                                    />
                                </DisclosureButton>
                                <DisclosurePanel className="p-4">
                                    <RecipeSelector recipes={recipes} mealType="breakfast" weekDay={weekDay}/>
                                </DisclosurePanel>
                            </>
                        )}
                    </Disclosure>

                    {/* Lunch Accordion */}
                    <Disclosure>
                        {({open}) => (
                            <>
                                <DisclosureButton
                                    className="w-full text-left flex items-center justify-between p-4 bg-gray-200 text-gray-900 font-semibold rounded-md mt-2">
                                    <span>Select Recipes for Lunch</span>
                                    <ChevronDownIcon
                                        className={`h-5 w-5 ${open ? "transform rotate-180" : ""}`}
                                    />
                                </DisclosureButton>
                                <DisclosurePanel className="p-4">
                                    <RecipeSelector recipes={recipes} mealType="lunch" weekDay={weekDay}/>
                                </DisclosurePanel>
                            </>
                        )}
                    </Disclosure>

                    {/* Dinner Accordion */}
                    <Disclosure>
                        {({open}) => (
                            <>
                                <DisclosureButton
                                    className="w-full text-left flex items-center justify-between p-4 bg-gray-200 text-gray-900 font-semibold rounded-md mt-2">
                                    <span>Select Recipes for Dinner</span>
                                    <ChevronDownIcon
                                        className={`h-5 w-5 ${open ? "transform rotate-180" : ""}`}
                                    />
                                </DisclosureButton>
                                <DisclosurePanel className="p-4">
                                    <RecipeSelector recipes={recipes} mealType="dinner" weekDay={weekDay}/>
                                </DisclosurePanel>
                            </>
                        )}
                    </Disclosure>
                </div>
            </div>
        </div>
    );
}
