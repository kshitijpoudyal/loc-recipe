'use client'

import React, {useState} from 'react'
import {ChevronUpDownIcon} from '@heroicons/react/16/solid'
import {CheckIcon} from '@heroicons/react/20/solid'
import {Listbox, ListboxButton, ListboxOption, ListboxOptions} from '@headlessui/react'
import {addRecipe, Ingredients, Recipe} from "@/app/data/Recipe";
import {WeekDay, weekDays} from "@/app/data/DailySchedule";

export default function AddRecipeComponent() {
    const [name, setName] = useState('');
    const [id, setId] = useState('1001');
    const [prepTime, setPrepTime] = useState(0);
    const [cookTime, setCookTime] = useState(0);
    const [servings, setServings] = useState(0);
    const [mealType, setMealType] = useState<string[]>([]);
    const [ingredients, setIngredients] = useState<Ingredients[]>([]);
    const [ingredientName, setIngredientName] = useState('');
    const [ingredientQuantity, setIngredientQuantity] = useState(0);
    const [ingredientUnit, setIngredientUnit] = useState('');
    const [steps, setSteps] = useState('');
    const [ageGroup, setAgeGroup] = useState<string[]>([]);
    const [calories, setCalories] = useState('');
    const [protein, setProtein] = useState('');
    const [carbohydrates, setCarbohydrates] = useState('');
    const [fats, setFats] = useState('');
    const [sugar, setSugar] = useState('');
    const [daysOfWeek, setDaysOfWeek] = useState<WeekDay[]>([weekDays[0], weekDays[1]]);


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
            setIngredientQuantity(0);
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
        setDaysOfWeek([weekDays[0]]);
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

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
                ingredients: ingredients,
                steps: stepsList,
                ageGroup: ageGroup,
                nutrition: nutritionData,
                daysOfTheWeek: daysOfWeek,
                createdAt: new Date()
            }
            console.log("new recipe", recipe)

            addRecipe(recipe).then(() => {
                alert('Recipe added successfully!');
                clearForm();
            })
        } catch (error) {
            console.error('Error adding recipe: ', error);
        }
    };

    return (
        <div className="px-6 pb-24 sm:pb-32 lg:px-8">
            <form onSubmit={handleSubmit} className="mx-auto mt-16 max-w-xl sm:mt-20">
                <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
                    <div>
                        <label htmlFor="first-name" className="block text-sm/6 font-semibold text-gray-900">
                            Recipe Name
                        </label>
                        <div className="mt-2.5">
                            <input
                                id="recipe-name"
                                name="frecipe-name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                className="block w-full rounded-md px-3.5 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="recipe-id" className="block text-sm/6 font-semibold text-gray-900">
                            Recipe Id
                        </label>
                        <div className="mt-2.5">
                            <input
                                id="recipe-id"
                                name="recipe-id"
                                type="text"
                                value={id}
                                onChange={(e) => setId(e.target.value)}
                                required
                                className="block w-full rounded-md px-3.5 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="prepTime" className="block text-sm/6 font-semibold text-gray-900">
                            Preparation Time
                        </label>
                        <div className="mt-2.5">
                            <input
                                id="prepTime"
                                name="prepTime"
                                type="number"
                                value={prepTime}
                                onChange={(e) => setPrepTime(parseInt(e.target.value))}
                                className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="cookTime" className="block text-sm/6 font-semibold text-gray-900">
                            Cooking Time
                        </label>
                        <div className="mt-2.5">
                            <input
                                id="cookTime"
                                name="cookTime"
                                type="number"
                                value={cookTime}
                                onChange={(e) => setCookTime(parseInt(e.target.value))}
                                required
                                className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
                            />
                        </div>
                    </div>
                    <div className="sm:col-span-2">
                        <label htmlFor="servings" className="block text-sm/6 font-semibold text-gray-900">
                            Servings
                        </label>
                        <div className="mt-2.5">
                            <input
                                id="servings"
                                name="servings"
                                type="number"
                                value={servings}
                                onChange={(e) => setServings(parseInt(e.target.value))}
                                required
                                className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
                            />
                        </div>
                    </div>
                    <div className="sm:col-span-2">
                        <label className="block text-sm/6 font-semibold text-gray-900">
                            Select Day/s
                        </label>
                        <Listbox value={daysOfWeek} onChange={setDaysOfWeek} multiple>
                            <div className="relative mt-2.5">
                                <ListboxButton
                                    className="grid w-full cursor-default grid-cols-1 rounded-md bg-white px-3.5 py-2 pl-3 pr-2 text-left text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6">
                                    <span className="col-start-1 row-start-1 truncate pr-6">
                                        {daysOfWeek.map((day) => day.name).join(', ')}
                                    </span>
                                    <ChevronUpDownIcon
                                        aria-hidden="true"
                                        className="col-start-1 row-start-1 size-5 self-center justify-self-end text-gray-500 sm:size-4"
                                    />
                                </ListboxButton>

                                <ListboxOptions
                                    transition
                                    className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none data-[closed]:data-[leave]:opacity-0 data-[leave]:transition data-[leave]:duration-100 data-[leave]:ease-in sm:text-sm"
                                >
                                    {weekDays.map((day) => (
                                        <ListboxOption
                                            key={day.id}
                                            value={day}
                                            className="group relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900 data-[focus]:bg-indigo-600 data-[focus]:text-white data-[focus]:outline-none"
                                        >
                                            <span
                                                className="block truncate font-normal group-data-[selected]:font-semibold">
                                                {day.name}
                                            </span>
                                            <span
                                                className="absolute inset-y-0 right-0 flex items-center pr-4 text-indigo-600 group-[&:not([data-selected])]:hidden group-data-[focus]:text-white">
                                                <CheckIcon aria-hidden="true" className="size-5"/>
                                            </span>
                                        </ListboxOption>
                                    ))}
                                </ListboxOptions>
                            </div>
                        </Listbox>
                    </div>
                    <div className="sm:col-span-2">
                        <label htmlFor="ingredients" className="block text-sm font-semibold text-gray-900">
                            Ingredients
                        </label>
                        <div id="ingredients">
                            <div className="mt-2.5 grid grid-cols-2 gap-x-2.5">
                                <div className="mt-4 flex flex-col md:flex-row md:space-x-2 space-y-2 md:space-y-0">
                                    <div className="relative">
                                        <label
                                            htmlFor="ingredientName"
                                            className="absolute -top-2 left-2 inline-block rounded-lg bg-white px-1 text-xs font-medium text-gray-500"
                                        >
                                            Name
                                        </label>
                                        <input
                                            id="ingredientName"
                                            type="text"
                                            value={ingredientName}
                                            onChange={(e) => setIngredientName(e.target.value)}
                                            className="w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
                                        />
                                    </div>
                                    <div className="relative">
                                        <label
                                            htmlFor="ingredientQuantity"
                                            className="absolute -top-2 left-2 inline-block rounded-lg bg-white px-1 text-xs font-medium text-gray-500"
                                        >
                                            Quantity
                                        </label>
                                        <input
                                            id="ingredientQuantity"
                                            type="number"
                                            value={ingredientQuantity}
                                            onChange={(e) => setIngredientQuantity(parseFloat(e.target.value))}
                                            className="w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
                                        />
                                    </div>
                                </div>

                                <div className="mt-4 flex flex-col md:flex-row md:space-x-2 space-y-2 md:space-y-0">
                                    <div className="relative w-full md:w-1/2">
                                        <label
                                            htmlFor="ingredientUnit"
                                            className="absolute -top-2 left-2 inline-block rounded-lg bg-white px-1 text-xs font-medium text-gray-500"
                                        >
                                            Unit
                                        </label>
                                        <input
                                            id="ingredientUnit"
                                            type="text"
                                            value={ingredientUnit}
                                            onChange={(e) => setIngredientUnit(e.target.value)}
                                            className="w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <div className="flex border-t border-gray-100 pt-6">
                                        <button
                                            type="button"
                                            onClick={handleAddIngredient}
                                            className="text-sm/6 font-semibold text-indigo-600 hover:text-indigo-500">
                                            <span aria-hidden="true">+</span> Ingredients
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <ul className="space-y-2">
                                    {ingredients.map((ingredient, index) => (
                                        <li
                                            key={index}
                                            className="flex items-center justify-between p-2 pl-4 pr-2 bg-gray-100 rounded-md shadow-sm"
                                        >
                                            <div>
                                                <span className="block font-medium text-gray-800">
                                                    {ingredient.name} {ingredient.quantity} {ingredient.unit}
                                                </span>
                                            </div>
                                            <button
                                                onClick={() =>
                                                    setIngredients(ingredients.filter((_, i) => i !== index))
                                                }
                                                className="rounded-full bg-red-400 p-2 text-white shadow-sm hover:bg-red-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                                     strokeWidth={1.5} stroke="currentColor" className="size-4">
                                                    <path strokeLinecap="round" strokeLinejoin="round"
                                                          d="M15 12H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                                                </svg>
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="sm:col-span-2">
                        <label htmlFor="nutrition" className="block text-sm font-semibold text-gray-900">
                            Nutrition
                        </label>
                        <div id="nutrition" className="mt-2.5 grid grid-cols-2 gap-x-2.5">
                            <div className="mt-4 flex flex-col md:flex-row md:space-x-2 space-y-2 md:space-y-0">
                                <div className="relative">
                                    <label
                                        htmlFor="calories"
                                        className="absolute -top-2 left-2 inline-block rounded-lg bg-white px-1 text-xs font-medium text-gray-500"
                                    >
                                        Calories (kcal)
                                    </label>
                                    <input
                                        id="calories"
                                        type="number"
                                        value={calories}
                                        onChange={(e) => setCalories(e.target.value)}
                                        className="w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-700 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
                                    />
                                </div>
                                <div className="relative">
                                    <label
                                        htmlFor="protein"
                                        className="absolute -top-2 left-2 inline-block rounded-lg bg-white px-1 text-xs font-medium text-gray-500"
                                    >
                                        Protein (g)
                                    </label>
                                    <input
                                        type="number"
                                        value={protein}
                                        onChange={(e) => setProtein(e.target.value)}
                                        className="w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
                                    />
                                </div>
                            </div>
                            <div className="mt-4 flex flex-col md:flex-row md:space-x-2 space-y-2 md:space-y-0">
                                <div className="relative">
                                    <label
                                        htmlFor="carbohydrates"
                                        className="absolute -top-2 left-2 inline-block rounded-lg bg-white px-1 text-xs font-medium text-gray-500"
                                    >
                                        Carbohydrates (g)
                                    </label>
                                    <input
                                        type="number"
                                        value={carbohydrates}
                                        onChange={(e) => setCarbohydrates(e.target.value)}
                                        className="w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
                                    />
                                </div>
                                <div className="relative">
                                    <label
                                        htmlFor="fats"
                                        className="absolute -top-2 left-2 inline-block rounded-lg bg-white px-1 text-xs font-medium text-gray-500"
                                    >
                                        Fats (g)
                                    </label>
                                    <input
                                        type="number"
                                        value={fats}
                                        onChange={(e) => setFats(e.target.value)}
                                        className="w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="sm:col-span-2">
                        <label htmlFor="steps" className="block text-sm/6 font-semibold text-gray-900">
                            Steps (one step per line)
                        </label>
                        <div className="mt-2.5">
                          <textarea
                              id="steps"
                              name="steps"
                              rows={4}
                              className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
                              value={steps}
                              onChange={(e) => setSteps(e.target.value)}
                          />
                        </div>
                    </div>
                    <div className="sm:col-span-2">
                        <fieldset>
                            <legend className="text-sm/6 font-semibold text-gray-900">Meal Type</legend>
                            <div className="mt-6 flex gap-6">
                                <div className="flex items-center gap-2">
                                    <div className="group grid size-4 grid-cols-1">
                                        <input
                                            id="breakfast"
                                            name="breakfast"
                                            type="checkbox"
                                            value="breakfast"
                                            onChange={handleMealTypeChange}
                                            aria-describedby="mealtype-breakfast"
                                            className="col-start-1 row-start-1 appearance-none rounded border border-gray-300 bg-white checked:border-indigo-600 checked:bg-indigo-600 indeterminate:border-indigo-600 indeterminate:bg-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto"
                                        />
                                        <svg
                                            fill="none"
                                            viewBox="0 0 14 14"
                                            className="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-[:disabled]:stroke-gray-950/25"
                                        >
                                            <path
                                                d="M3 8L6 11L11 3.5"
                                                strokeWidth={2}
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                className="opacity-0 group-has-[:checked]:opacity-100"
                                            />
                                            <path
                                                d="M3 7H11"
                                                strokeWidth={2}
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                className="opacity-0 group-has-[:indeterminate]:opacity-100"
                                            />
                                        </svg>
                                    </div>
                                    <label htmlFor="breakfast" className="font-medium text-gray-900">
                                        Breakfast
                                    </label>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="group grid size-4 grid-cols-1">
                                        <input
                                            id="lunch"
                                            name="lunch"
                                            type="checkbox"
                                            value="lunch"
                                            onChange={handleMealTypeChange}
                                            aria-describedby="mealtype-lunch"
                                            className="col-start-1 row-start-1 appearance-none rounded border border-gray-300 bg-white checked:border-indigo-600 checked:bg-indigo-600 indeterminate:border-indigo-600 indeterminate:bg-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto"
                                        />
                                        <svg
                                            fill="none"
                                            viewBox="0 0 14 14"
                                            className="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-[:disabled]:stroke-gray-950/25"
                                        >
                                            <path
                                                d="M3 8L6 11L11 3.5"
                                                strokeWidth={2}
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                className="opacity-0 group-has-[:checked]:opacity-100"
                                            />
                                            <path
                                                d="M3 7H11"
                                                strokeWidth={2}
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                className="opacity-0 group-has-[:indeterminate]:opacity-100"
                                            />
                                        </svg>
                                    </div>
                                    <label htmlFor="lunch" className="font-medium text-gray-900">
                                        Lunch
                                    </label>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="group grid size-4 grid-cols-1">
                                        <input
                                            id="dinner"
                                            name="dinner"
                                            type="checkbox"
                                            value="dinner"
                                            onChange={handleMealTypeChange}
                                            aria-describedby="mealtype-dinner"
                                            className="col-start-1 row-start-1 appearance-none rounded border border-gray-300 bg-white checked:border-indigo-600 checked:bg-indigo-600 indeterminate:border-indigo-600 indeterminate:bg-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto"
                                        />
                                        <svg
                                            fill="none"
                                            viewBox="0 0 14 14"
                                            className="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-[:disabled]:stroke-gray-950/25"
                                        >
                                            <path
                                                d="M3 8L6 11L11 3.5"
                                                strokeWidth={2}
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                className="opacity-0 group-has-[:checked]:opacity-100"
                                            />
                                            <path
                                                d="M3 7H11"
                                                strokeWidth={2}
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                className="opacity-0 group-has-[:indeterminate]:opacity-100"
                                            />
                                        </svg>
                                    </div>
                                    <label htmlFor="dinner" className="font-medium text-gray-900">
                                        Dinner
                                    </label>
                                </div>
                            </div>
                        </fieldset>
                    </div>
                    <div className="sm:col-span-2">
                        <fieldset>
                            <legend className="text-sm/6 font-semibold text-gray-900">Age Group</legend>
                            <div className="mt-6 flex gap-6">
                                <div className="flex items-center gap-2">
                                    <div className="group grid size-4 grid-cols-1">
                                        <input
                                            id="adult"
                                            name="adult"
                                            type="checkbox"
                                            value="adult"
                                            onChange={handleAgeGroupChange}
                                            aria-describedby="agegroup-adult"
                                            className="col-start-1 row-start-1 appearance-none rounded border border-gray-300 bg-white checked:border-indigo-600 checked:bg-indigo-600 indeterminate:border-indigo-600 indeterminate:bg-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto"
                                        />
                                        <svg
                                            fill="none"
                                            viewBox="0 0 14 14"
                                            className="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-[:disabled]:stroke-gray-950/25"
                                        >
                                            <path
                                                d="M3 8L6 11L11 3.5"
                                                strokeWidth={2}
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                className="opacity-0 group-has-[:checked]:opacity-100"
                                            />
                                            <path
                                                d="M3 7H11"
                                                strokeWidth={2}
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                className="opacity-0 group-has-[:indeterminate]:opacity-100"
                                            />
                                        </svg>
                                    </div>
                                    <label htmlFor="adult" className="font-medium text-gray-900">
                                        Adult
                                    </label>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="group grid size-4 grid-cols-1">
                                        <input
                                            id="kids"
                                            name="kids"
                                            type="checkbox"
                                            value="kids"
                                            onChange={handleAgeGroupChange}
                                            aria-describedby="agegroup-kids"
                                            className="col-start-1 row-start-1 appearance-none rounded border border-gray-300 bg-white checked:border-indigo-600 checked:bg-indigo-600 indeterminate:border-indigo-600 indeterminate:bg-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto"
                                        />
                                        <svg
                                            fill="none"
                                            viewBox="0 0 14 14"
                                            className="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-[:disabled]:stroke-gray-950/25"
                                        >
                                            <path
                                                d="M3 8L6 11L11 3.5"
                                                strokeWidth={2}
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                className="opacity-0 group-has-[:checked]:opacity-100"
                                            />
                                            <path
                                                d="M3 7H11"
                                                strokeWidth={2}
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                className="opacity-0 group-has-[:indeterminate]:opacity-100"
                                            />
                                        </svg>
                                    </div>
                                    <label htmlFor="kids" className="font-medium text-gray-900">
                                        Kids
                                    </label>
                                </div>
                            </div>
                        </fieldset>
                    </div>
                </div>
                <div className="mt-10">
                    <button
                        type="submit"
                        className="block w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        Add Recipe
                    </button>
                </div>
            </form>
        </div>
    )
}
