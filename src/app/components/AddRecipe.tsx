"use client";
import React, {useState} from 'react';
import {addRecipe, Recipe} from "@/app/data/Recipe";

export default function AddRecipeComponent() {
    const [name, setName] = useState('');
    const [id, setId] = useState('1001');
    const [prepTime, setPrepTime] = useState(0);
    const [cookTime, setCookTime] = useState(0);
    const [servings, setServings] = useState(0);
    const [mealType, setMealType] = useState<string[]>([]);
    const [ingredients, setIngredients] = useState<{ name: string, quantity: string, unit: string }[]>([]);
    const [ingredientName, setIngredientName] = useState('');
    const [ingredientQuantity, setIngredientQuantity] = useState('');
    const [ingredientUnit, setIngredientUnit] = useState('');
    const [steps, setSteps] = useState('');
    const [ageGroup, setAgeGroup] = useState<string[]>([]);
    const [calories, setCalories] = useState('');
    const [protein, setProtein] = useState('');
    const [carbohydrates, setCarbohydrates] = useState('');
    const [fats, setFats] = useState('');
    const [sugar, setSugar] = useState('');
    const [daysOfWeek, setDaysOfWeek] = useState([]);

    const handleMealTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {value, checked} = e.target;
        setMealType((prev) =>
            checked ? [...prev, value] : prev.filter((type) => type !== value)
        );
    };

    const handleAgeGroupChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {value, checked} = e.target;
        setAgeGroup((prev) =>
            checked ? [...prev, value] : prev.filter((group) => group !== value)
        );
    };

    const handleAddIngredient = () => {
        if (ingredientName && ingredientQuantity && ingredientUnit) {
            setIngredients([
                ...ingredients,
                {name: ingredientName, quantity: ingredientQuantity, unit: ingredientUnit}
            ]);
            setIngredientName('');
            setIngredientQuantity('');
            setIngredientUnit('');
        } else {
            alert('Please fill all fields for the ingredient.');
        }
    };

    const clearForm = () => {
        setName('');
        setPrepTime(0);
        setCookTime(0);
        setServings(0);
        setMealType([]);
        setIngredients([]);
        setSteps('');
        setAgeGroup([]);
        setCalories('');
        setProtein('');
        setCarbohydrates('');
        setFats('');
        setSugar('');
        setDaysOfWeek([]);
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Convert ingredient quantity to number for proper storage
        const ingredientList = ingredients.map((ingredient) => ({
            ...ingredient,
            quantity: parseFloat(ingredient.quantity),
        }));

        const stepsList = steps.split('\n').map((step) => step.trim());

        const nutritionData = {
            calories: calories ? parseInt(calories) : 0,
            protein: protein ? parseFloat(protein) : 0,
            carbohydrates: carbohydrates ? parseFloat(carbohydrates) : 0,
            fats: fats ? parseFloat(fats) : 0,
            sugar: sugar ? parseFloat(sugar) : 0,
        };

        try {
            const recipe: Recipe = {
                id: id,
                name: name,
                prepTime: prepTime,
                cookTime: cookTime,
                servings: servings,
                mealType: mealType,
                ingredients: ingredientList,
                steps: stepsList,
                ageGroup: ageGroup,
                nutrition: nutritionData,
                daysOfTheWeek: daysOfWeek,
                createdAt: new Date()
            }

            addRecipe(recipe).then(() => {
                alert('Recipe added successfully!');
                clearForm();
            })
        } catch (error) {
            console.error('Error adding recipe: ', error);
        }
    };

    return <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-center mb-6">Add New Recipe</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label htmlFor="recipeId" className="block text-lg font-medium text-gray-700">Recipe Id</label>
                <input
                    id="recipeId"
                    type="text"
                    value={id}
                    onChange={(e) => setId(e.target.value)}
                    required
                    className="w-full p-3 mt-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
            </div>

            <div>
                <label htmlFor="name" className="block text-lg font-medium text-gray-700">Recipe Name</label>
                <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full p-3 mt-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
            </div>

            <div>
                <label htmlFor="prepTime" className="block text-lg font-medium text-gray-700">Preparation Time
                    (minutes)</label>
                <input
                    id="prepTime"
                    type="number"
                    value={prepTime}
                    onChange={(e) => setPrepTime(parseInt(e.target.value))}
                    className="w-full p-3 mt-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
            </div>

            <div>
                <label htmlFor="cookTime" className="block text-lg font-medium text-gray-700">Cooking Time
                    (minutes)</label>
                <input
                    id="cookTime"
                    type="number"
                    value={cookTime}
                    onChange={(e) => setCookTime(parseInt(e.target.value))}
                    className="w-full p-3 mt-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
            </div>

            <div>
                <label htmlFor="servings" className="block text-lg font-medium text-gray-700">Servings</label>
                <input
                    id="servings"
                    type="number"
                    value={servings}
                    onChange={(e) => setServings(parseInt(e.target.value))}
                    required
                    className="w-full p-3 mt-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
            </div>

            <div>
                <label className="block text-lg font-medium text-gray-700">Meal Type</label>
                <div className="space-x-4">
                    <label className="inline-flex items-center text-gray-700">
                        <input
                            type="checkbox"
                            value="breakfast"
                            onChange={handleMealTypeChange}
                            className="form-checkbox h-5 w-5 text-indigo-600"
                        />
                        <span className="ml-2">Breakfast</span>
                    </label>
                    <label className="inline-flex items-center text-gray-700">
                        <input
                            type="checkbox"
                            value="lunch"
                            onChange={handleMealTypeChange}
                            className="form-checkbox h-5 w-5 text-indigo-600"
                        />
                        <span className="ml-2">Lunch</span>
                    </label>
                    <label className="inline-flex items-center text-gray-700">
                        <input
                            type="checkbox"
                            value="dinner"
                            onChange={handleMealTypeChange}
                            className="form-checkbox h-5 w-5 text-indigo-600"
                        />
                        <span className="ml-2">Dinner</span>
                    </label>
                </div>
            </div>

            <div>
                <label className="block text-lg font-medium text-gray-700">Age Group</label>
                <div className="space-x-4">
                    <label className="inline-flex items-center text-gray-700">
                        <input
                            type="checkbox"
                            value="adult"
                            onChange={handleAgeGroupChange}
                            className="form-checkbox h-5 w-5 text-indigo-600"
                        />
                        <span className="ml-2">Adult</span>
                    </label>
                    <label className="inline-flex items-center text-gray-700">
                        <input
                            type="checkbox"
                            value="kids"
                            onChange={handleAgeGroupChange}
                            className="form-checkbox h-5 w-5 text-indigo-600"
                        />
                        <span className="ml-2">Kids</span>
                    </label>
                </div>
            </div>

            {/* Ingredients Inputs */}
            <div>
                <label className="block text-lg font-medium text-gray-700">Ingredients</label>
                <div className="space-y-4">
                    <div className="flex space-x-4">
                        <input
                            type="text"
                            placeholder="Name"
                            value={ingredientName}
                            onChange={(e) => setIngredientName(e.target.value)}
                            className="w-1/3 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <input
                            type="number"
                            placeholder="Quantity"
                            value={ingredientQuantity}
                            onChange={(e) => setIngredientQuantity(e.target.value)}
                            className="w-1/3 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <input
                            type="text"
                            placeholder="Unit"
                            value={ingredientUnit}
                            onChange={(e) => setIngredientUnit(e.target.value)}
                            className="w-1/3 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <button
                        type="button"
                        onClick={handleAddIngredient}
                        className="mt-2 bg-indigo-600 text-white font-semibold rounded-md py-2 px-4 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        Add Ingredient
                    </button>
                </div>
            </div>

            <div>
                <label htmlFor="steps" className="block text-lg font-medium text-gray-700">Steps (one step per
                    line)</label>
                <textarea
                    id="steps"
                    value={steps}
                    onChange={(e) => setSteps(e.target.value)}
                    required
                    rows={4}
                    className="w-full p-3 mt-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
            </div>

            <div>
                <label htmlFor="nutrition" className="block text-lg font-medium text-gray-700">Nutrition</label>
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-700">Calories (kcal)</label>
                            <input
                                type="number"
                                value={calories}
                                onChange={(e) => setCalories(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700">Protein (g)</label>
                            <input
                                type="number"
                                value={protein}
                                onChange={(e) => setProtein(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700">Carbohydrates (g)</label>
                            <input
                                type="number"
                                value={carbohydrates}
                                onChange={(e) => setCarbohydrates(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700">Fats (g)</label>
                            <input
                                type="number"
                                value={fats}
                                onChange={(e) => setFats(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700">Sugar (g)</label>
                            <input
                                type="number"
                                value={sugar}
                                onChange={(e) => setSugar(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div>
                <label htmlFor="daysOfWeek" className="block text-lg font-medium text-gray-700">
                    Select Days of the Week
                </label>
                <select
                    id="daysOfWeek"
                    multiple
                    required
                    value={daysOfWeek}
                    onChange={(e) =>
                        setDaysOfWeek(Array.from(e.target.selectedOptions, (option) => option.value))
                    }
                    className="w-full p-3 mt-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                    <option value="monday">Monday</option>
                    <option value="tuesday">Tuesday</option>
                    <option value="wednesday">Wednesday</option>
                    <option value="thursday">Thursday</option>
                    <option value="friday">Friday</option>
                    <option value="saturday">Saturday</option>
                    <option value="sunday">Sunday</option>
                </select>
            </div>

            <button
                type="submit"
                className="w-full py-3 mt-6 bg-indigo-600 text-white font-semibold rounded-md shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
                Add Recipe
            </button>
        </form>
    </div>;
}
