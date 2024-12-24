'use client'

import React, {useState} from 'react'
import {ChevronUpDownIcon} from '@heroicons/react/16/solid'
import {CheckIcon} from '@heroicons/react/20/solid'
import {Label, Listbox, ListboxButton, ListboxOption, ListboxOptions, Switch} from '@headlessui/react'
import {addRecipe, Recipe} from "@/app/data/Recipe";
import {PlusIcon} from "@heroicons/react/20/solid";
import {weekDays} from "@/app/data/DailySchedule";

export default function Example() {
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
    const [daysOfWeek, setDaysOfWeek] = useState(weekDays[0]);


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
        setDaysOfWeek(weekDays[0]);
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
                daysOfTheWeek: [daysOfWeek.value],
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

    return (
        <div className="isolate bg-white px-6 py-24 sm:py-32 lg:px-8">
            <div
                aria-hidden="true"
                className="absolute inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[-20rem]"
            >
                <div
                    style={{
                        clipPath:
                            'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                    }}
                    className="relative left-1/2 -z-10 aspect-[1155/678] w-[36.125rem] max-w-none -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-40rem)] sm:w-[72.1875rem]"
                />
            </div>
            <div className="mx-auto max-w-2xl text-center">
                <h2 className="text-balance text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">Add New
                    Recipe</h2>
            </div>
            <form action="#" method="POST" className="mx-auto mt-16 max-w-xl sm:mt-20">
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
                                className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
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
                                className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
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
                        <Listbox value={daysOfWeek} onChange={setDaysOfWeek}>
                            <div className="relative mt-2.5">
                                {/*className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"*/}
                                <ListboxButton
                                    className="grid w-full cursor-default grid-cols-1 rounded-md bg-white px-3.5 py-2 pl-3 pr-2 text-left text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6">
                                    <span className="col-start-1 row-start-1 truncate pr-6">{daysOfWeek.name}</span>
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

                        <div className="flex space-x-4" id="ingredients">
                            <div className="mt-2.5 flex flex-col md:flex-row md:space-x-2 space-y-2 md:space-y-0">
                                <input
                                    type="number"
                                    placeholder="Name"
                                    value={ingredientName}
                                    onChange={(e) => setIngredientQuantity(e.target.value)}
                                    className="w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
                                />
                                <input
                                    type="number"
                                    placeholder="Quantity"
                                    value={ingredientQuantity}
                                    onChange={(e) => setIngredientQuantity(e.target.value)}
                                    className="w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
                                />
                                <input
                                    type="text"
                                    placeholder="Unit"
                                    value={ingredientUnit}
                                    onChange={(e) => setIngredientUnit(e.target.value)}
                                    className="w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
                                />
                                <button
                                    type="button"
                                    onClick={handleAddIngredient}
                                    className="rounded-full bg-indigo-600 p-1 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                >
                                    <PlusIcon aria-hidden="true" className="size-8"/>
                                </button>
                            </div>
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
