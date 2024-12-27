'use client'

import React, {useState} from 'react';
import {PhotoIcon} from '@heroicons/react/20/solid';
import {addRecipeToFirebase, uploadImage} from "@/app/data/firebaseController/Recipe";
import {Ingredients, Recipe} from "@/app/data/DataInterface";
import Image from "next/image";
import {
    classNames,
    getCheckBoxFieldCss,
    getInputFieldCss,
    getLinkTextCss,
    getPrimaryButtonCss
} from "@/app/data/Util";

export default function AddRecipeComponent() {
    const [name, setName] = useState('');
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
    // const [daysOfWeek, setDaysOfWeek] = useState<WeekDay[]>([WEEK_DAYS[0], WEEK_DAYS[1]]);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);


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
        // setDaysOfWeek([WEEK_DAYS[0]]);
        setImageFile(null);
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = () => {
                setSelectedImage(reader.result as string);
            };
            reader.readAsDataURL(e.target.files[0]);
            setImageFile(e.target.files[0]);
        }
    };

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
                ageGroup: ageGroup,
                cookTime: cookTime,
                // daysOfTheWeek: daysOfWeek,
                ingredients: ingredients,
                mealType: mealType,
                name: name,
                nutrition: nutritionData,
                prepTime: prepTime,
                servings: servings,
                steps: stepsList,
            }
            if (imageFile) {
                recipe.imageUrl = await uploadImage(imageFile)
            }
            addRecipeToFirebase(recipe).then(() => {
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
                    <div className="sm:col-span-2">
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
                                className={classNames("block w-full", getInputFieldCss())}
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
                                className={classNames("block w-full", getInputFieldCss())}
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
                                className={classNames("block w-full", getInputFieldCss())}
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
                                className={classNames("block w-full", getInputFieldCss())}
                            />
                        </div>
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
                                            className={classNames("w-full", getInputFieldCss())}
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
                                            className={classNames("w-full", getInputFieldCss())}
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
                                            className={classNames("w-full", getInputFieldCss())}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <div className="flex border-t border-gray-100 pt-6">
                                        <button
                                            type="button"
                                            onClick={handleAddIngredient}
                                            className={getLinkTextCss()}>
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
                                        className={`${classNames("w-full", getInputFieldCss())}`}
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
                                        className={`${classNames("w-full", getInputFieldCss())}`}
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
                                        className={`${classNames("w-full", getInputFieldCss())}`}
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
                                        className={`${classNames("w-full", getInputFieldCss())}`}
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
                              className={`${classNames("block w-full", getInputFieldCss())}`}
                              value={steps}
                              onChange={(e) => setSteps(e.target.value)}
                          />
                        </div>
                    </div>
                    <div className="sm:col-span-2">
                        <label className="block text-sm/6 font-semibold text-gray-900">
                            Select Day/s
                        </label>
                        {/*<Listbox value={daysOfWeek} onChange={setDaysOfWeek} multiple>*/}
                        {/*    <div className="relative mt-2.5">*/}
                        {/*        <ListboxButton*/}
                        {/*            className="grid w-full cursor-default grid-cols-1 rounded-md bg-white px-3.5 py-2 pl-3 pr-2 text-left text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6">*/}
                        {/*            <span className="col-start-1 row-start-1 truncate pr-6">*/}
                        {/*                /!*{daysOfWeek.map((day) => day.name).join(', ')}*!/*/}
                        {/*            </span>*/}
                        {/*            <ChevronUpDownIcon*/}
                        {/*                aria-hidden="true"*/}
                        {/*                className="col-start-1 row-start-1 size-5 self-center justify-self-end text-gray-500 sm:size-4"*/}
                        {/*            />*/}
                        {/*        </ListboxButton>*/}

                        {/*        <ListboxOptions*/}
                        {/*            transition*/}
                        {/*            className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none data-[closed]:data-[leave]:opacity-0 data-[leave]:transition data-[leave]:duration-100 data-[leave]:ease-in sm:text-sm"*/}
                        {/*        >*/}
                        {/*            {WEEK_DAYS.map((day) => (*/}
                        {/*                <ListboxOption*/}
                        {/*                    key={day.id}*/}
                        {/*                    value={day}*/}
                        {/*                    className="group relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900 data-[focus]:bg-indigo-600 data-[focus]:text-white data-[focus]:outline-none"*/}
                        {/*                >*/}
                        {/*                    <span*/}
                        {/*                        className="block truncate font-normal group-data-[selected]:font-semibold">*/}
                        {/*                        {day.name}*/}
                        {/*                    </span>*/}
                        {/*                    <span*/}
                        {/*                        className="absolute inset-y-0 right-0 flex items-center pr-4 text-indigo-600 group-[&:not([data-selected])]:hidden group-data-[focus]:text-white">*/}
                        {/*                        <CheckIcon aria-hidden="true" className="size-5"/>*/}
                        {/*                    </span>*/}
                        {/*                </ListboxOption>*/}
                        {/*            ))}*/}
                        {/*        </ListboxOptions>*/}
                        {/*    </div>*/}
                        {/*</Listbox>*/}
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
                                            className={classNames("col-start-1 row-start-1", getCheckBoxFieldCss())}
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
                                            className={classNames("col-start-1 row-start-1", getCheckBoxFieldCss())}
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
                                            className={classNames("col-start-1 row-start-1", getCheckBoxFieldCss())}
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
                                            className={classNames("col-start-1 row-start-1", getCheckBoxFieldCss())}
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
                                            className={classNames("col-start-1 row-start-1", getCheckBoxFieldCss())}
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
                        <div className="col-span-full">
                            <label htmlFor="cover-photo" className="block text-sm/6 font-semibold text-gray-900">
                                Recipe image
                            </label>
                            <div
                                className="mt-2.5 flex justify-center content-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                                <div className="text-center">
                                    {selectedImage ? (
                                        <Image
                                            src={selectedImage}
                                            alt="Selected"
                                            width={400}
                                            height={400}
                                            aria-hidden="true"
                                            className="mb-4 mx-auto size-fit object-cover rounded-lg"
                                        />
                                    ) : (
                                        <PhotoIcon aria-hidden="true" className="mx-auto size-12 text-gray-300"/>
                                    )}
                                    <div className="mt-4 flex text-center text-sm/6 text-gray-600">
                                        <label
                                            htmlFor="imageUpload"
                                            className={classNames("relative cursor-pointer", getLinkTextCss())}
                                        >
                                            <span>Upload an image</span>
                                            <input
                                                id="imageUpload"
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageChange}
                                                className="sr-only"
                                            />
                                        </label>
                                        <p className="pl-1">or drag and drop</p>
                                    </div>
                                    <p className="text-xs/5 text-gray-600">PNG, JPG, GIF up to 10MB</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-10">
                    <button
                        type="submit"
                        className={classNames("block w-full", getPrimaryButtonCss())}
                    >
                        Add Recipe
                    </button>
                </div>
            </form>
        </div>
    )
}
