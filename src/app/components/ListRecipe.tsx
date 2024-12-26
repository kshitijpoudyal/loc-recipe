import {useEffect, useState} from "react";
import {fetchAllRecipes} from "@/app/data/firebaseController/Recipe";
import ExampleDetails from "@/app/components/RecipeDetails";
import Image from "next/image";
import {DEFAULT_RECIPE} from "@/app/data/ConstData";
import {Recipe} from "@/app/data/DataInterface";

export default function ListRecipeComponent() {
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [selectedRecipe, setSelectedRecipe] = useState<Recipe>(DEFAULT_RECIPE);
    const [open, setOpen] = useState(false)

    useEffect(() => {
        fetchAllRecipes().then((recipes) => {
            setRecipes(recipes)
        })
    }, []);

    return (
        <div>
            {open && (
                <ExampleDetails isOpen={open} recipe={selectedRecipe} setIsOpen={setOpen}/>
            )}
            <div className="mx-auto max-w-2xl px-4 py-24 sm:px-6 sm:py-32 lg:max-w-7xl lg:px-8">
                <div
                    className="mt-11 grid grid-cols-1 items-start gap-x-6 gap-y-16 sm:mt-16 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-8">
                    {recipes.map((recipe) => (
                        <div key={recipe.name} className="flex flex-col-reverse" onClick={() => {
                            console.log("clicked", open, selectedRecipe)
                            setOpen(!open)
                            setSelectedRecipe(recipe)
                        }}>
                            <div className="mt-6">
                                <h3 className="text-sm font-medium text-gray-900">
                                    {recipe.name}
                                    {recipe.mealType && recipe.mealType.length > 0 && (
                                        <div className="flex space-x-2">
                                            {recipe.mealType.map((type) => (
                                                <span
                                                    key={type}
                                                    className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20"
                                                >
                                                    {type}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </h3>
                            </div>
                            {recipe.imageUrl && (
                                <Image
                                    alt={recipe.name}
                                    src={recipe.imageUrl}
                                    height={400}
                                    width={400}
                                    className="aspect-square w-full rounded-lg bg-gray-100 object-cover"
                                />
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
