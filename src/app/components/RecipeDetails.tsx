'use client'

import {
    Dialog,
    DialogBackdrop,
    DialogPanel,
    DialogTitle
} from '@headlessui/react';
import {XMarkIcon} from '@heroicons/react/24/outline';
import Image from "next/image";
import {Recipe} from "@/app/data/DataInterface";

export interface RecipeDetailsProps {
    isOpen: boolean;
    recipe: Recipe;
    setIsOpenAction: (open: boolean) => void;
}

export const RecipeDetails = ({isOpen, recipe, setIsOpenAction}: RecipeDetailsProps) => (
    <Dialog open={isOpen} onClose={() => setIsOpenAction(false)} className="relative z-10">
        <DialogBackdrop
            transition
            className="fixed inset-0 bg-gray-500/75 transition-opacity duration-500 ease-in-out data-[closed]:opacity-0"
        />
        <div className="fixed inset-0"/>

        <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
                <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
                    <DialogPanel
                        transition
                        className="pointer-events-auto w-screen max-w-2xl transform transition duration-500 ease-in-out data-[closed]:translate-x-full sm:duration-700"
                    >
                        <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                            <div className="px-4 py-6 sm:px-6">
                                <div className="flex items-start justify-between">
                                    <DialogTitle
                                        className="text-base font-semibold text-gray-900">{recipe.name}</DialogTitle>
                                    <div className="ml-3 flex h-7 items-center">
                                        <button
                                            type="button"
                                            onClick={() => setIsOpenAction(false)}
                                            className="relative rounded-md bg-white text-gray-400 hover:text-gray-500 focus:ring-2 focus:ring-green-500"
                                        >
                                            <span className="absolute -inset-2.5"/>
                                            <span className="sr-only">Close panel</span>
                                            <XMarkIcon aria-hidden="true" className="size-6"/>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div
                                className="inline-flex overflow-hidden rounded-lg border-4 border-white">
                                {recipe.imageUrl && (
                                    <Image
                                        alt={recipe.name}
                                        src={recipe.imageUrl}
                                        height={600}
                                        width={600}
                                        className="absolute inset-0 size-full rounded-2xl bg-gray-50 object-cover"
                                    />
                                )}
                            </div>
                            <div className="p-4 bg-gray-100">
                                <div className="space-y-2">
                                    {/*{recipe.daysOfTheWeek && recipe.daysOfTheWeek.length > 0 && (*/}
                                    {/*    <div className="flex justify-between">*/}
                                    {/*        <span className="font-medium">Days Assigned:</span>*/}
                                    {/*        {recipe.daysOfTheWeek.map((day) => (*/}
                                    {/*            <span*/}
                                    {/*                key={day.id}*/}
                                    {/*                className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded-md"*/}
                                    {/*            >*/}
                                    {/*                {day.name}*/}
                                    {/*            </span>*/}
                                    {/*        ))}*/}
                                    {/*    </div>*/}
                                    {/*)}*/}

                                    {recipe.prepTime != null && (
                                        <div className="flex justify-between">
                                                                    <span
                                                                        className="font-medium">Preparation Time:</span>
                                            <span>{recipe.prepTime} minutes</span>
                                        </div>
                                    )}

                                    {recipe.cookTime != null && (
                                        <div className="flex justify-between">
                                            <span className="font-medium">Cooking Time:</span>
                                            <span>{recipe.cookTime} minutes</span>
                                        </div>
                                    )}

                                    {recipe.servings != null && (
                                        <div className="flex justify-between">
                                            <span className="font-medium">Servings:</span>
                                            <span>{recipe.servings}</span>
                                        </div>
                                    )}

                                    {recipe.mealType && recipe.mealType.length > 0 && (
                                        <div className="space-y-1">
                                            <span className="font-medium">Meal Type:</span>
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
                                        </div>
                                    )}

                                    {recipe.ageGroup && recipe.ageGroup.length > 0 && (
                                        <div className="space-y-1">
                                            <span className="font-medium">Age Group:</span>
                                            <div className="flex space-x-2">
                                                {recipe.ageGroup.map((age) => (
                                                    <span
                                                        key={age}
                                                        className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded-md"
                                                    >
                                                        {age}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {recipe.ingredients && recipe.ingredients.length > 0 && (
                                        <div className="space-y-1">
                                            <span className="font-medium">Ingredients:</span>
                                            <ul className="list-disc pl-6">
                                                {recipe.ingredients.map((ingredient, idx) => (
                                                    <li key={idx}>
                                                        {ingredient.quantity} {ingredient.unit} of{' '}
                                                        {ingredient.name}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {recipe.steps && recipe.steps.length > 0 && (
                                        <div className="space-y-1">
                                            <span className="font-medium">Steps:</span>
                                            <ol className="list-decimal pl-6">
                                                {recipe.steps.map((step, idx) => (
                                                    <li key={idx}>{step}</li>
                                                ))}
                                            </ol>
                                        </div>
                                    )}

                                    {recipe.nutrition && (
                                        <div className="space-y-1">
                                            <span className="font-medium">Nutrition:</span>
                                            <ul className="list-disc pl-6">
                                                {recipe.nutrition.calories != null && (
                                                    <li>
                                                        <span
                                                            className="font-medium">Calories:</span> {recipe.nutrition.calories} kcal
                                                    </li>
                                                )}
                                                {recipe.nutrition.protein != null && (
                                                    <li>
                                                        <span
                                                            className="font-medium">Protein:</span> {recipe.nutrition.protein} g
                                                    </li>
                                                )}
                                                {recipe.nutrition.carbohydrates != null && (
                                                    <li>
                                                        <span
                                                            className="font-medium">Carbohydrates:</span> {recipe.nutrition.carbohydrates} g
                                                    </li>
                                                )}
                                                {recipe.nutrition.fats != null && (
                                                    <li>
                                                        <span
                                                            className="font-medium">Fats:</span> {recipe.nutrition.fats} g
                                                    </li>
                                                )}
                                                {recipe.nutrition.sugar != null && (
                                                    <li>
                                                        <span
                                                            className="font-medium">Sugar:</span> {recipe.nutrition.sugar} g
                                                    </li>
                                                )}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </DialogPanel>
                </div>
            </div>
        </div>
    </Dialog>
)