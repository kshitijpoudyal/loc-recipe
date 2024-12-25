import {useEffect, useState} from "react";
import {fetchRecipes, Recipe} from "@/app/data/Recipe";

export default function Example() {
    const [recipes, setRecipes] = useState<Recipe[]>([]);

    useEffect(() => {
        fetchRecipes().then((recipes) => {
            setRecipes(recipes)
        })
    }, []);

    return (
        <div>
            <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
                <h2 className="sr-only">Products</h2>

                <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-3 lg:gap-x-8">
                    {recipes.map((recipe) => (
                        <div
                            key={recipe.id}
                            className="group relative flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white"
                        >
                            <img
                                alt={recipe.name}
                                src={recipe.imageUrl}
                                className="aspect-[3/4] w-full bg-gray-200 object-cover group-hover:opacity-75 sm:aspect-auto sm:h-96"
                            />
                            <div className="flex flex-1 flex-col space-y-2 p-4">
                                <h3 className="text-sm font-medium text-gray-900">
                                    <a href="#">
                                        <span aria-hidden="true" className="absolute inset-0" />
                                        {recipe.name}
                                    </a>
                                </h3>
                                <p className="text-sm text-gray-500">{recipe.cookTime}</p>
                                <div className="flex flex-1 flex-col justify-end">
                                    <p className="text-sm italic text-gray-500">{recipe.mealType}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
