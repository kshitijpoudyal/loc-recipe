"use client";

import React, {useState} from "react";
import Image from "next/image";
import {Dialog, DialogBackdrop, DialogPanel} from "@headlessui/react";
import {XMarkIcon} from "@heroicons/react/24/outline";
import {updateRecipeInFirebase, uploadImage} from "@/app/utils/firebaseUtils/Recipe";
import {Recipe} from "@/app/data/DataInterface";
import {useRecipes} from "@/app/components/baseComponents/RecipeProvider";

const MEAL_TYPE_OPTIONS = ["Breakfast", "Lunch", "Dinner"];
const AGE_GROUP_OPTIONS = ["Adult", "Kids"];

type IngredientRow = { qty: string; name: string };

export interface EditRecipeProps {
    isOpen: boolean;
    recipe: Recipe;
    setIsOpenAction: (open: boolean) => void;
}

export default function EditRecipeModal({isOpen, recipe, setIsOpenAction}: EditRecipeProps) {
    const {invalidate} = useRecipes();

    const toIngredientRows = (r: Recipe): IngredientRow[] =>
        r.ingredients?.map(i => ({qty: i.unit ? `${i.quantity > 0 ? i.quantity + ' ' : ''}${i.unit}`.trim() : String(i.quantity > 0 ? i.quantity : ''), name: i.name})) ?? [{qty: '', name: ''}];

    const [name, setName] = useState(recipe.name);
    const [prepTime, setPrepTime] = useState<number | ''>(recipe.prepTime ?? '');
    const [cookTime, setCookTime] = useState<number | ''>(recipe.cookTime ?? '');
    const [servings, setServings] = useState<number | ''>(recipe.servings ?? '');
    const [mealType, setMealType] = useState<string[]>(recipe.mealType?.map(m => m.charAt(0).toUpperCase() + m.slice(1)) ?? []);
    const [ageGroup, setAgeGroup] = useState<string[]>(recipe.ageGroup?.map(a => a.charAt(0).toUpperCase() + a.slice(1)) ?? []);
    const [ingredientRows, setIngredientRows] = useState<IngredientRow[]>(toIngredientRows(recipe));
    const [steps, setSteps] = useState<string[]>(recipe.steps?.length ? recipe.steps : ['']);
    const [calories, setCalories] = useState(String(recipe.nutrition?.calories ?? ''));
    const [protein, setProtein] = useState(String(recipe.nutrition?.protein ?? ''));
    const [carbohydrates, setCarbohydrates] = useState(String(recipe.nutrition?.carbohydrates ?? ''));
    const [fats, setFats] = useState(String(recipe.nutrition?.fats ?? ''));
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [selectedImage, setSelectedImage] = useState<string | null>(recipe.imageUrl ?? null);
    const [loading, setLoading] = useState(false);

    const toggleChip = (value: string, list: string[], setList: (v: string[]) => void) => {
        setList(list.includes(value) ? list.filter(v => v !== value) : [...list, value]);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = () => setSelectedImage(reader.result as string);
            reader.readAsDataURL(file);
            setImageFile(file);
        }
    };

    const updateIngredientRow = (index: number, field: keyof IngredientRow, value: string) => {
        setIngredientRows(rows => rows.map((r, i) => i === index ? {...r, [field]: value} : r));
    };

    const removeIngredientRow = (index: number) => {
        setIngredientRows(rows => rows.filter((_, i) => i !== index));
    };

    const updateStep = (index: number, value: string) => {
        setSteps(s => s.map((step, i) => i === index ? value : step));
    };

    const removeStep = (index: number) => {
        setSteps(s => s.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!recipe.recipeId) return;
        setLoading(true);
        try {
            const ingredients = ingredientRows
                .filter(r => r.name.trim())
                .map(r => ({name: r.name.trim(), quantity: 0, unit: r.qty.trim()}));

            const updated: Recipe = {
                recipeId: recipe.recipeId,
                createdBy: recipe.createdBy,
                createdByName: recipe.createdByName,
                isPublic: recipe.isPublic,
                name,
                prepTime: prepTime !== '' ? Number(prepTime) : undefined,
                cookTime: cookTime !== '' ? Number(cookTime) : undefined,
                servings: servings !== '' ? Number(servings) : undefined,
                mealType: mealType.map(m => m.toLowerCase()),
                ageGroup: ageGroup.map(a => a.toLowerCase()),
                ingredients,
                steps: steps.filter(s => s.trim()),
                nutrition: {
                    calories: calories ? parseInt(calories) : 0,
                    protein: protein ? parseFloat(protein) : 0,
                    carbohydrates: carbohydrates ? parseFloat(carbohydrates) : 0,
                    fats: fats ? parseFloat(fats) : 0,
                },
            };

            if (imageFile) {
                updated.imageUrl = await uploadImage(imageFile);
            } else if (selectedImage) {
                updated.imageUrl = selectedImage;
            }

            await updateRecipeInFirebase(recipe.recipeId, updated);
            invalidate();
            setIsOpenAction(false);
        } catch (error) {
            console.error("Error updating recipe:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onClose={() => setIsOpenAction(false)} className="relative z-[70]">
            <DialogBackdrop
                transition
                className="fixed inset-0 bg-on-surface/40 backdrop-blur-sm transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
            />

            <div className="fixed inset-0 z-[70] w-screen overflow-y-auto">
                <div className="flex min-h-full items-stretch justify-center md:items-center md:px-4 lg:px-8">
                    <DialogPanel
                        transition
                        className="flex w-full transform text-left text-base transition data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in md:my-8 md:max-w-3xl data-[closed]:md:translate-y-0 data-[closed]:md:scale-95"
                    >
                        <form onSubmit={handleSubmit} className="relative flex w-full flex-col overflow-hidden bg-background shadow-2xl rounded-xl">

                            {/* Close button */}
                            <div className="absolute right-4 top-4 z-20">
                                <button
                                    type="button"
                                    onClick={() => setIsOpenAction(false)}
                                    className="p-1.5 rounded-full bg-surface-container-lowest/80 backdrop-blur text-on-surface-variant hover:text-on-surface transition-colors"
                                >
                                    <span className="sr-only">Close</span>
                                    <XMarkIcon aria-hidden="true" className="size-5"/>
                                </button>
                            </div>

                            {/* Hero image */}
                            <header className="relative w-full h-52 overflow-hidden flex-shrink-0 bg-surface-container-high">
                                {selectedImage && (
                                    <Image src={selectedImage} alt={name} fill className="object-cover" unoptimized={!imageFile}/>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent"/>
                                <label htmlFor="editImageUpload" className="absolute inset-0 cursor-pointer flex items-center justify-center z-10">
                                    <div className="bg-surface-container-lowest/70 backdrop-blur rounded-xl px-4 py-2 flex items-center gap-2 text-on-surface opacity-0 hover:opacity-100 transition-opacity">
                                        <span className="material-symbols-outlined text-sm">edit</span>
                                        <span className="font-label text-xs font-semibold">Change Photo</span>
                                    </div>
                                </label>
                                <input id="editImageUpload" type="file" accept="image/*" onChange={handleImageChange} className="sr-only"/>
                                <div className="absolute bottom-6 left-6 right-6">
                                    <h1 className="font-headline text-2xl md:text-3xl font-bold text-on-surface tracking-tight">Edit Recipe</h1>
                                </div>
                            </header>

                            {/* Body */}
                            <div className="px-6 md:px-10 py-8 space-y-8 overflow-y-auto max-h-[70vh]">

                                {/* Recipe title */}
                                <div>
                                    <label className="block font-label text-xs uppercase tracking-[0.15em] font-semibold text-primary mb-2">Recipe Title</label>
                                    <input
                                        type="text"
                                        required
                                        value={name}
                                        onChange={e => setName(e.target.value)}
                                        className="w-full font-headline text-xl bg-surface-container-low border-none rounded-xl p-4 focus:ring-2 focus:ring-primary/20 outline-none"
                                    />
                                </div>

                                {/* Time + servings */}
                                <div className="grid grid-cols-3 gap-4">
                                    {[
                                        {label: 'Prep Time', icon: 'schedule', value: prepTime, onChange: (v: string) => setPrepTime(v === '' ? '' : parseInt(v)), unit: 'min'},
                                        {label: 'Cook Time', icon: 'cooking', value: cookTime, onChange: (v: string) => setCookTime(v === '' ? '' : parseInt(v)), unit: 'min'},
                                        {label: 'Servings', icon: 'restaurant', value: servings, onChange: (v: string) => setServings(v === '' ? '' : parseInt(v)), unit: 'ppl'},
                                    ].map(field => (
                                        <div key={field.label} className="bg-surface-container-low rounded-xl p-4">
                                            <label className="block font-label text-[10px] uppercase tracking-widest font-bold text-outline mb-2">{field.label}</label>
                                            <div className="flex items-center gap-1">
                                                <span className="material-symbols-outlined text-primary text-sm">{field.icon}</span>
                                                <input
                                                    type="number"
                                                    value={field.value}
                                                    onChange={e => field.onChange(e.target.value)}
                                                    className="w-full bg-transparent border-none p-0 focus:ring-0 font-headline text-lg font-bold outline-none"
                                                />
                                                <span className="text-[10px] text-outline font-label">{field.unit}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Meal type + age group */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block font-label text-xs uppercase tracking-[0.15em] font-semibold text-primary mb-3">Meal Type</label>
                                        <div className="flex flex-wrap gap-2">
                                            {MEAL_TYPE_OPTIONS.map(option => (
                                                <button key={option} type="button" onClick={() => toggleChip(option, mealType, setMealType)}
                                                    className={`px-4 py-1.5 rounded-full font-label text-xs font-bold transition-colors ${mealType.includes(option) ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-on-surface-variant'}`}>
                                                    {option}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block font-label text-xs uppercase tracking-[0.15em] font-semibold text-primary mb-3">Age Group</label>
                                        <div className="flex flex-wrap gap-2">
                                            {AGE_GROUP_OPTIONS.map(option => (
                                                <button key={option} type="button" onClick={() => toggleChip(option, ageGroup, setAgeGroup)}
                                                    className={`px-4 py-1.5 rounded-full font-label text-xs font-bold transition-colors ${ageGroup.includes(option) ? 'bg-secondary-fixed text-on-secondary-fixed' : 'bg-surface-container-high text-on-surface-variant'}`}>
                                                    {option}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Nutrition */}
                                <div>
                                    <label className="block font-label text-xs uppercase tracking-[0.15em] font-semibold text-primary mb-3">Nutrition <span className="normal-case text-outline font-normal">(optional)</span></label>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {[
                                            {label: 'Calories', unit: 'kcal', value: calories, onChange: setCalories},
                                            {label: 'Protein', unit: 'g', value: protein, onChange: setProtein},
                                            {label: 'Carbs', unit: 'g', value: carbohydrates, onChange: setCarbohydrates},
                                            {label: 'Fats', unit: 'g', value: fats, onChange: setFats},
                                        ].map(field => (
                                            <div key={field.label} className="bg-surface-container-low rounded-xl p-4">
                                                <label className="block font-label text-[10px] uppercase tracking-widest font-bold text-outline mb-2">{field.label}</label>
                                                <div className="flex items-end gap-1">
                                                    <input type="number" value={field.value} onChange={e => field.onChange(e.target.value)}
                                                        className="w-full bg-transparent border-none p-0 focus:ring-0 font-headline text-lg font-bold outline-none"/>
                                                    <span className="text-[10px] text-outline font-label mb-0.5">{field.unit}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Ingredients */}
                                <div>
                                    <div className="flex items-baseline gap-2 mb-4">
                                        <h2 className="font-headline text-lg font-bold">Ingredients</h2>
                                    </div>
                                    <div className="space-y-3">
                                        {ingredientRows.map((row, index) => (
                                            <div key={index} className="flex items-center gap-3 bg-surface-container-low p-3 rounded-xl">
                                                <div className="w-20 flex-shrink-0">
                                                    <input type="text" value={row.qty} onChange={e => updateIngredientRow(index, 'qty', e.target.value)} placeholder="Qty"
                                                        className="w-full border-none bg-transparent rounded-lg p-2 text-center text-sm font-body focus:ring-1 focus:ring-primary/30 outline-none"/>
                                                </div>
                                                <div className="flex-1">
                                                    <input type="text" value={row.name} onChange={e => updateIngredientRow(index, 'name', e.target.value)} placeholder="Ingredient name"
                                                        className="w-full border-none bg-transparent rounded-lg p-2 text-sm font-body focus:ring-1 focus:ring-primary/30 outline-none"/>
                                                </div>
                                                <button type="button" onClick={() => removeIngredientRow(index)} className="text-outline-variant hover:text-error transition-colors p-1">
                                                    <span className="material-symbols-outlined text-sm">delete</span>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                    <button type="button" onClick={() => setIngredientRows(r => [...r, {qty: '', name: ''}])}
                                        className="mt-3 flex items-center gap-1 text-primary hover:bg-primary-container/10 px-3 py-1 rounded-full transition-colors">
                                        <span className="material-symbols-outlined text-lg">add</span>
                                        <span className="font-label text-xs font-bold">ADD ITEM</span>
                                    </button>
                                </div>

                                {/* Steps */}
                                <div>
                                    <h2 className="font-headline text-lg font-bold mb-4">Instructions</h2>
                                    <div className="space-y-4">
                                        {steps.map((step, index) => (
                                            <div key={index} className="flex gap-4 items-start">
                                                <div className={`flex-none w-8 h-8 rounded-full font-headline font-bold flex items-center justify-center mt-1 text-sm ${index === 0 ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-on-surface-variant'}`}>
                                                    {index + 1}
                                                </div>
                                                <div className="flex-1">
                                                    <textarea rows={2} value={step} onChange={e => updateStep(index, e.target.value)} placeholder="Describe this step..."
                                                        className="w-full border-none bg-surface-container-low rounded-xl p-4 text-sm font-body focus:ring-1 focus:ring-primary/30 resize-none outline-none"/>
                                                </div>
                                                {steps.length > 1 && (
                                                    <button type="button" onClick={() => removeStep(index)} className="text-outline-variant hover:text-error transition-colors p-1 mt-2">
                                                        <span className="material-symbols-outlined text-sm">close</span>
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                    <button type="button" onClick={() => setSteps(s => [...s, ''])}
                                        className="mt-4 flex items-center gap-1 text-primary hover:bg-primary-container/10 px-3 py-1 rounded-full transition-colors">
                                        <span className="material-symbols-outlined text-lg">playlist_add</span>
                                        <span className="font-label text-xs font-bold">ADD STEP</span>
                                    </button>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="px-6 md:px-10 py-6 border-t border-outline-variant/10 flex gap-3">
                                <button type="button" onClick={() => setIsOpenAction(false)}
                                    className="flex-1 py-3 rounded-full border border-outline-variant/30 font-label text-sm font-semibold text-on-surface-variant hover:bg-surface-container-low transition-colors">
                                    Cancel
                                </button>
                                <button type="submit" disabled={loading}
                                    className="flex-[2] py-3 rounded-full bg-primary text-on-primary font-label text-sm font-bold tracking-wide shadow-lg shadow-primary/20 hover:opacity-90 active:scale-95 transition-all disabled:opacity-50">
                                    {loading ? 'Saving…' : 'Save Changes'}
                                </button>
                            </div>

                        </form>
                    </DialogPanel>
                </div>
            </div>
        </Dialog>
    );
}
