import {Dialog, DialogBackdrop, DialogPanel} from '@headlessui/react'
import {XMarkIcon} from '@heroicons/react/24/outline'
import {RecipeDetailsProps} from "@/app/components/RecipeDetails";
import Image from "next/image";

export default function RecipeDetailsTemplate({isOpen, recipe, setIsOpenAction}: RecipeDetailsProps) {
    return (
        <Dialog open={isOpen} onClose={() => setIsOpenAction(false)} className="relative z-10">
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
                                {recipe.imageUrl && (
                                    <div className="sm:col-span-4 lg:col-span-5">
                                        <Image
                                            alt={recipe.name}
                                            src={recipe.imageUrl}
                                            height={600}
                                            width={600}
                                            className="w-full h-auto object-cover"
                                        />
                                    </div>
                                )}
                                <div className="sm:col-span-8 lg:col-span-7">
                                    <h2 className="text-2xl font-bold text-gray-900 sm:pr-12">{recipe.name}</h2>

                                    <section aria-labelledby="information-heading" className="mt-3">
                                        <div className="space-y-2">
                                            <div className="space-x-2">
                                                {recipe.prepTime != null && recipe.prepTime > 0 && (
                                                    <span
                                                        className="inline-flex items-center gap-x-2 rounded-full px-2 py-2 text-xs font-medium text-gray-900 ring-1 ring-inset ring-gray-200">
                                                        Prep Time: {recipe.prepTime} minutes
                                                    </span>
                                                )}
                                                {recipe.cookTime != null && recipe.cookTime > 0 && (
                                                    <span
                                                        className="inline-flex items-center gap-x-2 rounded-full px-2 py-2 text-xs font-medium text-gray-900 ring-1 ring-inset ring-gray-200"
                                                    >
                                                        Cook Time: {recipe.cookTime} minutes
                                                    </span>
                                                )}
                                            </div>
                                            <div className="space-x-2">
                                                {recipe.servings != null && recipe.servings > 0 && (
                                                    <span
                                                        className="inline-flex items-center gap-x-2 rounded-full px-2 py-2 text-xs font-medium text-gray-900 ring-1 ring-inset ring-gray-200">
                                                        {recipe.servings} servings
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="mt-6">
                                            {recipe.ingredients && recipe.ingredients.length > 0 && (
                                                <div>
                                                    <div>
                                                        <span className="font-medium">Ingredients:</span>
                                                    </div>
                                                    <div className="space-y-2 space-x-1 mt-4">
                                                        {recipe.ingredients.map((ingredient, idx) => (
                                                            <span
                                                                key={idx}
                                                                className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700"
                                                            >
                                                            {ingredient.quantity} {ingredient.unit} of{' '} {ingredient.name}
                                                        </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <div className="mt-6">
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
                                        </div>
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