import {MealType, Recipe, WeekDay} from "@/app/data/DataInterface";
import React, {useState} from "react";
import {Dialog, DialogBackdrop, DialogPanel, Radio, RadioGroup} from "@headlessui/react";
import {XMarkIcon} from "@heroicons/react/20/solid";
import {updateSchedule} from "@/app/data/firebaseController/DailySchedule";

export interface AssignRecipeToWeekDayProps {
    addRecipeOpen: boolean;
    recipes: Recipe[];
    setIsOpenAction: (open: boolean) => void;
}

export const AssignRecipeToWeekDay: React.FC<AssignRecipeToWeekDayProps> = ({
                                                                                addRecipeOpen,
                                                                                recipes,
                                                                                setIsOpenAction,
                                                                            }: AssignRecipeToWeekDayProps) => {
    const [selectedRecipes, setSelectedRecipes] = useState<Recipe[]>([]);

    return (
        <Dialog open={addRecipeOpen} onClose={() => setIsOpenAction(false)} className="relative z-10">
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
                                onClick={() => setIsOpenAction(false)}
                                className="absolute right-4 top-4 text-gray-400 hover:text-gray-500 sm:right-6 sm:top-8 md:right-6 md:top-6 lg:right-8 lg:top-8"
                            >
                                <span className="sr-only">Close</span>
                                <XMarkIcon aria-hidden="true" className="size-6"/>
                            </button>

                            <div
                                className="grid w-full grid-cols-1 items-start gap-x-6 gap-y-8 sm:grid-cols-12 lg:gap-x-8">
                                <div className="sm:col-span-8 lg:col-span-7">
                                    <section aria-labelledby="information-heading" className="mt-4">
                                        <h3 id="information-heading" className="sr-only">
                                            Product information
                                        </h3>
                                    </section>

                                    <section aria-labelledby="options-heading" className="mt-6">
                                        <h3 id="options-heading" className="sr-only">
                                            Product options
                                        </h3>
                                        <form>
                                            <div className="sm:flex sm:justify-between">
                                                <fieldset>
                                                    <RadioGroup value={selectedRecipes} onChange={setSelectedRecipes}>
                                                        <div className="mt-1 grid grid-cols-1 gap-4 sm:grid-cols-2">
                                                            {recipes.map((recipe) => (
                                                                <Radio
                                                                    key={recipe.name}
                                                                    as="div"
                                                                    value={recipe}
                                                                    aria-label={recipe.name}
                                                                    className="group relative block cursor-pointer rounded-lg border border-gray-300 p-4 focus:outline-none data-[focus]:ring-2 data-[focus]:ring-indigo-500"
                                                                >
                                                                    <p className="text-base font-medium text-gray-900">{recipe.name}</p>
                                                                    <p className="mt-1 text-sm text-gray-500">{recipe.steps}</p>
                                                                    <div
                                                                        aria-hidden="true"
                                                                        className="pointer-events-none absolute -inset-px rounded-lg border-2 border-transparent group-data-[focus]:border group-data-[checked]:border-indigo-500"
                                                                    />
                                                                </Radio>
                                                            ))}
                                                        </div>
                                                    </RadioGroup>
                                                </fieldset>
                                            </div>
                                            <div className="mt-6">
                                                <button
                                                    type="submit"
                                                    className="flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50"
                                                >
                                                    Assign
                                                </button>
                                            </div>
                                        </form>
                                    </section>
                                </div>
                            </div>
                        </div>
                    </DialogPanel>
                </div>
            </div>
        </Dialog>
    )
}