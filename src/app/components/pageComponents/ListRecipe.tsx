import React, {useEffect, useState} from "react";
import {fetchAllRecipes} from "@/app/utils/firebaseUtils/Recipe";
import {DEFAULT_RECIPE} from "@/app/data/ConstData";
import {Recipe} from "@/app/data/DataInterface";
import RecipeCard from "@/app/components/baseComponents/RecipeCard";
import RecipeDetailsTemplate from "@/app/components/RecipeDetailsTemplate";
import {LoaderComponent} from "@/app/components/baseComponents/LoaderView";

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
        // return (<LoaderComponent loading={loading}/>);
    }

    return (
        <div>
            {open && (
                <RecipeDetailsTemplate isOpen={open} recipe={selectedRecipe} setIsOpenAction={setOpen}/>
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
