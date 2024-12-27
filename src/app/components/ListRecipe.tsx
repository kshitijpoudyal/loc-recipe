import React, {useEffect, useState} from "react";
import {fetchAllRecipes} from "@/app/data/firebaseController/Recipe";
import {DEFAULT_RECIPE} from "@/app/data/ConstData";
import {Recipe} from "@/app/data/DataInterface";
import {RecipeDetails} from "@/app/components/RecipeDetails";
import RecipeCard from "@/app/components/RecipeCard";

export default function ListRecipeComponent() {
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [selectedRecipe, setSelectedRecipe] = useState<Recipe>(DEFAULT_RECIPE);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAllRecipes().then((recipes) => {
            setRecipes(recipes)
            setLoading(false);
        })
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div>
            {open && (
                <RecipeDetails isOpen={open} recipe={selectedRecipe} setIsOpenAction={setOpen}/>
            )}
            <div className="mx-auto max-w-2xl px-4 py-24 sm:px-6 sm:py-32 lg:max-w-7xl lg:px-8">
                <div
                    className="mt-11 grid grid-cols-1 items-start gap-x-6 gap-y-16 sm:mt-16 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-8">
                    {recipes.map((recipe) => (
                        <div key={recipe.recipeId} className="flex flex-col-reverse" onClick={() => {
                            setOpen(!open)
                            setSelectedRecipe(recipe)
                        }}>
                            <RecipeCard recipe={recipe} isPreview={false}/>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
