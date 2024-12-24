import {useEffect, useState} from 'react';
import {fetchRecipes, Recipe} from "@/app/data/Recipe";


export default function RecipeList() {
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    useEffect(() => {
        fetchRecipes().then((recipes) => {
            setRecipes(recipes)
        })
    }, []);

    const toggleAccordion = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-bold text-center mb-6">All Recipes</h1>

            <div className="space-y-4">
                {recipes.map((recipe, index) => (
                    <div key={recipe.id} className="border rounded-md shadow-sm">
                        <div
                            onClick={() => toggleAccordion(index)}
                            className="flex justify-between items-center p-4 bg-indigo-600 text-white cursor-pointer"
                        >
                            <h2 className="text-xl font-semibold">{recipe.name}</h2>
                            <span className="text-sm">{openIndex === index ? '-' : '+'}</span>
                        </div>
                        {openIndex === index && (
                            <div className="p-4 bg-gray-100">
                                <div className="space-y-2">
                                    {recipe.daysOfTheWeek != null && (
                                        <div className="flex justify-between">
                                            <span className="font-medium">Days Assigned:</span>
                                            <span>{recipe.daysOfTheWeek}</span>
                                        </div>
                                    )}

                                    {recipe.prepTime != null && (
                                        <div className="flex justify-between">
                                            <span className="font-medium">Preparation Time:</span>
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

                                    {recipe.mealType.length > 0 && (
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

                                    {recipe.ageGroup.length > 0 && (
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

                                    {recipe.steps.length > 0 && (
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
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
