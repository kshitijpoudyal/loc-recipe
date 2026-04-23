"use client";

import React, {useEffect, useState} from "react";
import Image from "next/image";
import {addRecipeToFirebase, uploadImage} from "@/app/utils/firebaseUtils/Recipe";
import {Recipe} from "@/app/data/DataInterface";
import {useAuth} from "@/app/components/baseComponents/AuthProvider";
import {useRecipes} from "@/app/components/baseComponents/RecipeProvider";
import {getUserDisplayName} from "@/app/utils/firebaseUtils/User";

const MEAL_TYPE_OPTIONS = ["Breakfast", "Lunch", "Dinner"];
const AGE_GROUP_OPTIONS = ["Adult", "Kids"];

type IngredientRow = { qty: string; name: string };

export default function AddRecipeComponent() {
    const { user } = useAuth();
    const { invalidate } = useRecipes();
    const [firestoreDisplayName, setFirestoreDisplayName] = useState<string | null>(null);

    useEffect(() => {
        if (user?.uid) {
            getUserDisplayName(user.uid).then(setFirestoreDisplayName);
        }
    }, [user?.uid]);

    const [name, setName] = useState('');
    const [prepTime, setPrepTime] = useState<number | ''>('');
    const [cookTime, setCookTime] = useState<number | ''>('');
    const [servings, setServings] = useState<number | ''>('');
    const [mealType, setMealType] = useState<string[]>([]);
    const [ageGroup, setAgeGroup] = useState<string[]>([]);
    const [ingredientRows, setIngredientRows] = useState<IngredientRow[]>([{qty: '', name: ''}, {qty: '', name: ''}]);
    const [steps, setSteps] = useState<string[]>(['', '']);
    const [calories, setCalories] = useState('');
    const [protein, setProtein] = useState('');
    const [carbohydrates, setCarbohydrates] = useState('');
    const [fats, setFats] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [importedImageUrl, setImportedImageUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [importUrl, setImportUrl] = useState('');
    const [importLoading, setImportLoading] = useState(false);
    const [importStatus, setImportStatus] = useState<{type: 'success' | 'error'; message: string} | null>(null);
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

    const addIngredientRow = () => {
        setIngredientRows(rows => [...rows, {qty: '', name: ''}]);
    };

    const updateStep = (index: number, value: string) => {
        setSteps(s => s.map((step, i) => i === index ? value : step));
    };

    const removeStep = (index: number) => {
        setSteps(s => s.filter((_, i) => i !== index));
    };

    const addStep = () => {
        setSteps(s => [...s, '']);
    };

    const clearForm = () => {
        setName('');
        setPrepTime('');
        setCookTime('');
        setServings('');
        setMealType([]);
        setAgeGroup([]);
        setIngredientRows([{qty: '', name: ''}, {qty: '', name: ''}]);
        setSteps(['', '']);
        setCalories('');
        setProtein('');
        setCarbohydrates('');
        setFats('');
        setImageFile(null);
        setSelectedImage(null);
        setImportedImageUrl(null);
        setImportUrl('');
        setImportStatus(null);
    };

    const prefillForm = (data: {
        name?: string; prepTime?: number; cookTime?: number; servings?: number;
        mealType?: string[]; ingredients?: {qty: string; name: string}[]; steps?: string[];
        nutrition?: {calories?: number; protein?: number; carbohydrates?: number; fats?: number};
        imageUrl?: string;
    }) => {
        if (data.name) setName(data.name);
        if (data.prepTime) setPrepTime(data.prepTime);
        if (data.cookTime) setCookTime(data.cookTime);
        if (data.servings) setServings(data.servings);
        if (data.mealType?.length) setMealType(data.mealType.map(m => m.charAt(0).toUpperCase() + m.slice(1)));
        if (data.ingredients?.length) setIngredientRows(data.ingredients);
        if (data.steps?.length) setSteps(data.steps);
        if (data.nutrition) {
            if (data.nutrition.calories) setCalories(String(data.nutrition.calories));
            if (data.nutrition.protein) setProtein(String(data.nutrition.protein));
            if (data.nutrition.carbohydrates) setCarbohydrates(String(data.nutrition.carbohydrates));
            if (data.nutrition.fats) setFats(String(data.nutrition.fats));
        }
        if (data.imageUrl) {
            setSelectedImage(data.imageUrl);
            setImportedImageUrl(data.imageUrl);
        }
    };

    const handleImport = async () => {
        if (!importUrl.trim()) return;
        setImportLoading(true);
        setImportStatus(null);
        try {
            const res = await fetch('/api/import-recipe', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({url: importUrl.trim()}),
            });
            const data = await res.json();
            if (!res.ok) {
                setImportStatus({type: 'error', message: data.error ?? 'Could not import recipe'});
                return;
            }
            prefillForm(data);
            const domain = new URL(importUrl.trim()).hostname.replace('www.', '');
            setImportStatus({type: 'success', message: `Imported from ${domain} — review and publish`});
        } catch {
            setImportStatus({type: 'error', message: 'Failed to reach the URL'});
        } finally {
            setImportLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        try {
            const ingredients = ingredientRows
                .filter(r => r.name.trim())
                .map(r => ({name: r.name.trim(), quantity: 0, unit: r.qty.trim()}));

            const recipe: Recipe = {
                name,
                prepTime: prepTime !== '' ? Number(prepTime) : undefined,
                cookTime: cookTime !== '' ? Number(cookTime) : undefined,
                servings: servings !== '' ? Number(servings) : undefined,
                mealType: mealType.map(m => m.toLowerCase()),
                ageGroup: ageGroup.map(a => a.toLowerCase()),
                createdByName: firestoreDisplayName || user?.displayName || user?.email || undefined,
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
                recipe.imageUrl = await uploadImage(imageFile);
            } else if (importedImageUrl) {
                recipe.imageUrl = importedImageUrl;
            }

            await addRecipeToFirebase(recipe, user!.uid);
            invalidate();
            alert('Recipe added successfully!');
            clearForm();
        } catch (error) {
            console.error("Error adding recipe:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>

            {/* ── Mobile layout ── */}
            <div className="md:hidden pt-24 pb-64 px-6 max-w-2xl mx-auto space-y-10">

                {/* 0. Import from URL */}
                <section className="bg-surface-container-low rounded-2xl p-5">
                    <h3 className="font-label text-xs uppercase tracking-[0.15em] font-semibold text-primary mb-3 flex items-center gap-2">
                        <span className="material-symbols-outlined text-base">link</span>
                        Import from URL
                    </h3>
                    <div className="flex gap-2">
                        <input
                            type="url"
                            value={importUrl}
                            onChange={e => setImportUrl(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleImport())}
                            placeholder="Paste recipe URL…"
                            className="flex-1 bg-background rounded-xl px-4 py-3 font-body text-sm outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-outline-variant"
                        />
                        <button
                            type="button"
                            onClick={handleImport}
                            disabled={importLoading || !importUrl.trim()}
                            className="px-4 py-3 rounded-xl bg-primary text-on-primary font-label text-xs font-bold disabled:opacity-40 active:scale-95 transition-all flex items-center gap-1"
                        >
                            {importLoading
                                ? <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>
                                : <span className="material-symbols-outlined text-sm">download</span>
                            }
                        </button>
                    </div>
                    {importStatus && (
                        <p className={`mt-3 text-xs font-label flex items-center gap-1 ${importStatus.type === 'success' ? 'text-primary' : 'text-error'}`}>
                            <span className="material-symbols-outlined text-sm">{importStatus.type === 'success' ? 'check_circle' : 'error'}</span>
                            {importStatus.message}
                        </p>
                    )}
                </section>

                {/* 1. Hero image upload */}
                <section>
                    <label htmlFor="imageUploadMobile" className="cursor-pointer block">
                        <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-surface-container-low border-2 border-dashed border-outline-variant/30 flex flex-col items-center justify-center text-center p-8 transition-all hover:bg-surface-container-high/50">
                            {selectedImage && (
                                <Image src={selectedImage} alt="Recipe preview" fill className="object-cover" unoptimized={!imageFile}/>
                            )}
                            <div className={`relative z-10 ${selectedImage ? 'opacity-0' : ''}`}>
                                <span className="material-symbols-outlined text-5xl text-primary-container mb-4 block" style={{fontVariationSettings: "'FILL' 1"}}>add_a_photo</span>
                                <p className="font-headline italic text-lg text-on-surface-variant">Capture the soul of your dish</p>
                                <p className="font-label text-sm text-outline tracking-wide mt-2">TAP TO UPLOAD HERO PHOTO</p>
                            </div>
                        </div>
                    </label>
                    <input id="imageUploadMobile" type="file" accept="image/*" onChange={handleImageChange} className="sr-only"/>
                </section>

                {/* 2. Recipe title */}
                <section>
                    <label className="block font-label text-xs uppercase tracking-[0.15em] font-semibold text-primary mb-3">
                        Recipe Title
                    </label>
                    <input
                        type="text"
                        required
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="e.g. Heirloom Tomato & Basil Tart"
                        className="w-full font-headline text-2xl bg-surface-container-low border-none rounded-xl p-5 focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-highest transition-all placeholder:text-outline-variant placeholder:italic outline-none"
                    />
                </section>

                {/* 3. Prep Time / Cook Time / Servings */}
                <div className="grid grid-cols-3 gap-4">
                    {[
                        {label: 'Prep Time', icon: 'schedule', value: prepTime, onChange: (v: string) => setPrepTime(v === '' ? '' : parseInt(v)), placeholder: '30'},
                        {label: 'Cook Time', icon: 'cooking', value: cookTime, onChange: (v: string) => setCookTime(v === '' ? '' : parseInt(v)), placeholder: '20'},
                        {label: 'Servings', icon: 'restaurant', value: servings, onChange: (v: string) => setServings(v === '' ? '' : parseInt(v)), placeholder: '4'},
                    ].map(field => (
                        <div key={field.label} className="bg-surface-container-low rounded-xl p-4">
                            <label className="block font-label text-[10px] uppercase tracking-widest font-bold text-outline mb-2">{field.label}</label>
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary text-sm">{field.icon}</span>
                                <input
                                    type="number"
                                    value={field.value}
                                    onChange={e => field.onChange(e.target.value)}
                                    placeholder={field.placeholder}
                                    className="w-full bg-transparent border-none p-0 focus:ring-0 font-headline text-lg font-bold outline-none"
                                />
                            </div>
                        </div>
                    ))}
                </div>

                {/* 4. Meal Type + Age Group */}
                <section>
                    <h3 className="font-label text-xs uppercase tracking-[0.15em] font-semibold text-primary mb-4">Meal Type &amp; Age Group</h3>
                    <div className="flex flex-wrap gap-2">
                        {MEAL_TYPE_OPTIONS.map(option => (
                            <button
                                key={option}
                                type="button"
                                onClick={() => toggleChip(option, mealType, setMealType)}
                                className={`px-4 py-2 rounded-full font-label text-xs font-bold flex items-center gap-1 active:scale-95 transition-all ${
                                    mealType.includes(option)
                                        ? 'bg-primary text-on-primary'
                                        : 'bg-surface-container-high text-on-surface'
                                }`}
                            >
                                {option}
                                {mealType.includes(option) && <span className="material-symbols-outlined text-xs">close</span>}
                            </button>
                        ))}
                        {AGE_GROUP_OPTIONS.map(option => (
                            <button
                                key={option}
                                type="button"
                                onClick={() => toggleChip(option, ageGroup, setAgeGroup)}
                                className={`px-4 py-2 rounded-full font-label text-xs font-bold flex items-center gap-1 active:scale-95 transition-all ${
                                    ageGroup.includes(option)
                                        ? 'bg-secondary-fixed text-on-secondary-fixed'
                                        : 'bg-surface-container-high text-on-surface'
                                }`}
                            >
                                {option}
                                {ageGroup.includes(option) && <span className="material-symbols-outlined text-xs">close</span>}
                            </button>
                        ))}
                    </div>
                </section>

                {/* 5. Nutrition */}
                <section>
                    <h3 className="font-label text-xs uppercase tracking-[0.15em] font-semibold text-primary mb-4">Nutrition <span className="normal-case text-outline font-normal">(optional)</span></h3>
                    <div className="grid grid-cols-2 gap-4">
                        {[
                            {label: 'Calories', unit: 'kcal', value: calories, onChange: setCalories},
                            {label: 'Protein', unit: 'g', value: protein, onChange: setProtein},
                            {label: 'Carbs', unit: 'g', value: carbohydrates, onChange: setCarbohydrates},
                            {label: 'Fats', unit: 'g', value: fats, onChange: setFats},
                        ].map(field => (
                            <div key={field.label} className="bg-surface-container-low rounded-xl p-4">
                                <label className="block font-label text-[10px] uppercase tracking-widest font-bold text-outline mb-2">{field.label}</label>
                                <div className="flex items-end gap-1">
                                    <input
                                        type="number"
                                        value={field.value}
                                        onChange={e => field.onChange(e.target.value)}
                                        className="w-full bg-transparent border-none p-0 focus:ring-0 font-headline text-xl font-bold outline-none"
                                    />
                                    <span className="text-xs text-outline font-label mb-0.5">{field.unit}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 6. Ingredients */}
                <section>
                    <div className="flex items-baseline gap-2 mb-6">
                        <h2 className="font-headline text-xl font-bold">Ingredients</h2>
                        <span className="font-label text-xs uppercase tracking-widest text-outline">The Palette</span>
                    </div>
                    <div className="space-y-3">
                        {ingredientRows.map((row, index) => (
                            <div key={index} className="flex items-center gap-3 bg-surface-container-low p-3 rounded-xl">
                                <div className="w-16 flex-shrink-0">
                                    <input
                                        type="text"
                                        value={row.qty}
                                        onChange={e => updateIngredientRow(index, 'qty', e.target.value)}
                                        placeholder="Qty"
                                        className="w-full border-none bg-surface-container-low rounded-lg p-2 text-center text-sm font-body focus:ring-1 focus:ring-primary/30 outline-none"
                                    />
                                </div>
                                <div className="flex-1">
                                    <input
                                        type="text"
                                        value={row.name}
                                        onChange={e => updateIngredientRow(index, 'name', e.target.value)}
                                        placeholder="Ingredient name"
                                        className="w-full border-none bg-surface-container-low rounded-lg p-2 text-sm font-body focus:ring-1 focus:ring-primary/30 outline-none"
                                    />
                                </div>
                                <button type="button" onClick={() => removeIngredientRow(index)} className="text-outline-variant hover:text-error transition-colors p-1">
                                    <span className="material-symbols-outlined">delete</span>
                                </button>
                            </div>
                        ))}
                    </div>
                    <button type="button" onClick={addIngredientRow} className="mt-4 flex items-center gap-1 text-primary hover:bg-primary-container/10 px-3 py-1 rounded-full transition-colors active:scale-95">
                        <span className="material-symbols-outlined text-lg">add</span>
                        <span className="font-label text-xs font-bold">ADD ITEM</span>
                    </button>
                </section>

                {/* 7. Steps */}
                <section>
                    <div className="flex items-baseline gap-2 mb-6">
                        <h2 className="font-headline text-xl font-bold">Preparation</h2>
                        <span className="font-label text-xs uppercase tracking-widest text-outline">The Process</span>
                    </div>
                    <div className="space-y-6">
                        {steps.map((step, index) => (
                            <div key={index} className="flex gap-4 items-start">
                                <div className={`flex-none w-10 h-10 rounded-full font-headline font-bold flex items-center justify-center mt-1 text-white ${index === 0 ? 'bg-primary' : 'bg-primary-container'}`}>
                                    {index + 1}
                                </div>
                                <div className="flex-1">
                                    <textarea
                                        rows={2}
                                        value={step}
                                        onChange={e => updateStep(index, e.target.value)}
                                        placeholder="Describe this step..."
                                        className="w-full border-none bg-surface-container-low rounded-xl p-4 text-sm font-body focus:ring-1 focus:ring-primary/30 resize-none outline-none"
                                    />
                                </div>
                                {steps.length > 1 && (
                                    <button type="button" onClick={() => removeStep(index)} className="text-outline-variant hover:text-error transition-colors p-1 mt-3">
                                        <span className="material-symbols-outlined">close</span>
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                    <button type="button" onClick={addStep} className="mt-6 flex items-center gap-1 text-primary hover:bg-primary-container/10 px-3 py-1 rounded-full transition-colors active:scale-95">
                        <span className="material-symbols-outlined text-lg">playlist_add</span>
                        <span className="font-label text-xs font-bold">ADD STEP</span>
                    </button>
                </section>
            </div>

            {/* Mobile fixed footer */}
            <footer className="fixed bottom-0 left-0 w-full z-30 pt-4 pb-24 px-6 bg-surface/95 backdrop-blur-md md:hidden">
                <div className="max-w-2xl mx-auto grid grid-cols-2 gap-4">
                    <button
                        type="button"
                        onClick={clearForm}
                        className="w-full h-14 rounded-full font-label font-semibold text-primary border-2 border-primary/20 hover:bg-primary/5 active:scale-95 transition-all"
                    >
                        Clear Draft
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full h-14 rounded-full font-label font-semibold text-white bg-gradient-to-br from-primary to-primary-container shadow-lg shadow-primary/20 active:scale-95 transition-all ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
                    >
                        {loading ? 'Publishing...' : 'Publish Recipe'}
                    </button>
                </div>
            </footer>

            {/* ── Desktop layout ── */}
            <div className="hidden md:block pb-24 px-4 sm:px-6 md:px-8 max-w-5xl mx-auto">
                {/* Page Header */}
                <header className="mb-12 text-center">
                    <span className="inline-block text-sm uppercase tracking-[0.2em] font-label font-semibold text-secondary mb-3">
                        New Creation
                    </span>
                    <h1 className="font-headline text-4xl md:text-5xl font-bold text-on-surface">
                        Draft Your Masterpiece
                    </h1>
                    <p className="text-on-surface-variant mt-4 max-w-xl mx-auto font-body">
                        Document your culinary secrets with elegance. Every detail counts in the art of storytelling through food.
                    </p>
                </header>

                <div className="space-y-12">
                    {/* Import from URL */}
                    <section className="bg-surface-container-low rounded-2xl p-6">
                        <h3 className="font-label text-xs uppercase tracking-[0.15em] font-semibold text-primary mb-4 flex items-center gap-2">
                            <span className="material-symbols-outlined text-base">link</span>
                            Import from URL
                        </h3>
                        <div className="flex gap-3">
                            <input
                                type="url"
                                value={importUrl}
                                onChange={e => setImportUrl(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleImport())}
                                placeholder="Paste a recipe URL from any website…"
                                className="flex-1 bg-background rounded-xl px-5 py-3 font-body text-sm outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-outline-variant"
                            />
                            <button
                                type="button"
                                onClick={handleImport}
                                disabled={importLoading || !importUrl.trim()}
                                className="px-6 py-3 rounded-xl bg-primary text-on-primary font-label text-sm font-bold disabled:opacity-40 hover:opacity-90 active:scale-95 transition-all flex items-center gap-2"
                            >
                                {importLoading
                                    ? <><span className="material-symbols-outlined text-sm animate-spin">progress_activity</span> Importing…</>
                                    : <><span className="material-symbols-outlined text-sm">download</span> Import</>
                                }
                            </button>
                        </div>
                        {importStatus && (
                            <p className={`mt-3 text-sm font-label flex items-center gap-1.5 ${importStatus.type === 'success' ? 'text-primary' : 'text-error'}`}>
                                <span className="material-symbols-outlined text-base">{importStatus.type === 'success' ? 'check_circle' : 'error'}</span>
                                {importStatus.message}
                            </p>
                        )}
                    </section>

                    {/* Hero Image Upload */}
                    <section className="relative group">
                        <label htmlFor="imageUpload" className="cursor-pointer block">
                            <div className="w-full h-80 rounded-xl bg-surface-container-low flex flex-col items-center justify-center border-2 border-dashed border-outline-variant/30 overflow-hidden group-hover:border-primary/50 transition-colors relative">
                                {selectedImage ? (
                                    <Image src={selectedImage} alt="Recipe preview" fill className="object-cover" unoptimized={!imageFile}/>
                                ) : null}
                                <div className={`z-10 text-center p-6 bg-surface-container-lowest/90 backdrop-blur rounded-xl shadow-sm ${selectedImage ? 'opacity-0 group-hover:opacity-100 transition-opacity' : ''}`}>
                                    <span className="material-symbols-outlined text-4xl text-primary mb-2 block">add_a_photo</span>
                                    <p className="font-headline text-lg font-semibold text-on-surface">
                                        {selectedImage ? 'Change Hero Image' : 'Upload Hero Image'}
                                    </p>
                                    <p className="font-label text-sm text-on-surface-variant">
                                        High resolution horizontal format recommended
                                    </p>
                                </div>
                            </div>
                        </label>
                        <input id="imageUpload" type="file" accept="image/*" onChange={handleImageChange} className="sr-only"/>
                    </section>

                    {/* Basic Info Bento */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-3 bg-surface-container-low p-5 sm:p-8 rounded-xl">
                            <label className="block text-xs uppercase tracking-widest font-label font-bold text-on-surface-variant mb-4">Recipe Title</label>
                            <input
                                type="text"
                                required
                                value={name}
                                onChange={e => setName(e.target.value)}
                                placeholder="e.g., Heirloom Tomato & Burrata Salad"
                                className="w-full bg-transparent border-0 border-b border-outline-variant/30 focus:border-primary focus:ring-0 text-xl sm:text-3xl font-headline font-bold text-on-surface placeholder:text-outline-variant transition-all pb-2 outline-none"
                            />
                        </div>
                        {[
                            {label: 'Prep Time', value: prepTime, onChange: (v: string) => setPrepTime(v === '' ? '' : parseInt(v)), unit: 'mins'},
                            {label: 'Cook Time', value: cookTime, onChange: (v: string) => setCookTime(v === '' ? '' : parseInt(v)), unit: 'mins'},
                            {label: 'Servings', value: servings, onChange: (v: string) => setServings(v === '' ? '' : parseInt(v)), unit: 'people'},
                        ].map(field => (
                            <div key={field.label} className="bg-surface-container-low p-5 sm:p-8 rounded-xl flex flex-col justify-between">
                                <label className="block text-xs uppercase tracking-widest font-label font-bold text-on-surface-variant mb-4">{field.label}</label>
                                <div className="flex items-end gap-2">
                                    <input
                                        type="number"
                                        value={field.value}
                                        onChange={e => field.onChange(e.target.value)}
                                        className="w-20 bg-transparent border-0 border-b border-outline-variant/30 focus:border-primary focus:ring-0 text-2xl font-headline font-bold text-on-surface transition-all outline-none"
                                    />
                                    <span className="text-on-surface-variant font-label font-medium mb-1">{field.unit}</span>
                                </div>
                            </div>
                        ))}
                        <div className="bg-surface-container-low p-5 sm:p-8 rounded-xl flex flex-col justify-between">
                            <label className="block text-xs uppercase tracking-widest font-label font-bold text-on-surface-variant mb-4">Meal Type</label>
                            <div className="flex flex-wrap gap-2">
                                {MEAL_TYPE_OPTIONS.map(option => (
                                    <button key={option} type="button" onClick={() => toggleChip(option, mealType, setMealType)}
                                        className={`px-4 py-1 rounded-full text-xs font-semibold font-label transition-colors ${mealType.includes(option) ? 'bg-primary text-on-primary' : 'bg-surface-container-highest text-on-surface-variant hover:bg-surface-container-high'}`}>
                                        {option}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="bg-surface-container-low p-5 sm:p-8 rounded-xl flex flex-col justify-between">
                            <label className="block text-xs uppercase tracking-widest font-label font-bold text-on-surface-variant mb-4">Age Group</label>
                            <div className="flex flex-wrap gap-2">
                                {AGE_GROUP_OPTIONS.map(option => (
                                    <button key={option} type="button" onClick={() => toggleChip(option, ageGroup, setAgeGroup)}
                                        className={`px-4 py-1 rounded-full text-xs font-semibold font-label transition-colors ${ageGroup.includes(option) ? 'bg-primary text-on-primary' : 'bg-surface-container-highest text-on-surface-variant hover:bg-surface-container-high'}`}>
                                        {option}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="md:col-span-3 bg-surface-container-low p-5 sm:p-8 rounded-xl">
                            <label className="block text-xs uppercase tracking-widest font-label font-bold text-on-surface-variant mb-6">Nutrition (optional)</label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                {[
                                    {label: 'Calories', unit: 'kcal', value: calories, onChange: setCalories},
                                    {label: 'Protein', unit: 'g', value: protein, onChange: setProtein},
                                    {label: 'Carbs', unit: 'g', value: carbohydrates, onChange: setCarbohydrates},
                                    {label: 'Fats', unit: 'g', value: fats, onChange: setFats},
                                ].map(field => (
                                    <div key={field.label}>
                                        <p className="text-[10px] uppercase tracking-widest font-label font-bold text-outline mb-2">{field.label}</p>
                                        <div className="flex items-end gap-1">
                                            <input type="number" value={field.value} onChange={e => field.onChange(e.target.value)}
                                                className="w-16 bg-transparent border-0 border-b border-outline-variant/30 focus:border-primary focus:ring-0 text-xl font-headline font-bold text-on-surface transition-all outline-none"/>
                                            <span className="text-xs text-on-surface-variant font-label mb-1">{field.unit}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Ingredients */}
                    <section className="bg-surface-container-low p-5 sm:p-8 md:p-12 rounded-xl">
                        <div className="mb-8">
                            <h2 className="font-headline text-2xl font-bold text-on-surface">Ingredients</h2>
                            <p className="text-sm text-on-surface-variant font-label">The building blocks of flavor</p>
                        </div>
                        <div className="space-y-4">
                            {ingredientRows.map((row, index) => (
                                <div key={index} className="grid grid-cols-12 gap-2 sm:gap-4 items-center">
                                    <div className="col-span-3">
                                        <input type="text" value={row.qty} onChange={e => updateIngredientRow(index, 'qty', e.target.value)} placeholder="Qty (e.g. 200g)"
                                            className="w-full bg-surface-container-low border-0 rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none"/>
                                    </div>
                                    <div className="col-span-8">
                                        <input type="text" value={row.name} onChange={e => updateIngredientRow(index, 'name', e.target.value)} placeholder="Ingredient name"
                                            className="w-full bg-surface-container-low border-0 rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none"/>
                                    </div>
                                    <div className="col-span-1 text-right">
                                        <button type="button" onClick={() => removeIngredientRow(index)} className="material-symbols-outlined text-outline-variant hover:text-error transition-colors">delete</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button type="button" onClick={addIngredientRow} className="mt-6 flex items-center gap-2 text-primary font-semibold text-sm hover:opacity-80 transition-opacity">
                            <span className="material-symbols-outlined text-lg">add_circle</span>
                            Add Ingredient
                        </button>
                    </section>

                    {/* Instructions */}
                    <section className="space-y-6">
                        <div>
                            <h2 className="font-headline text-2xl font-bold text-on-surface">Instructions</h2>
                            <p className="text-sm text-on-surface-variant font-label">Guide them through the process</p>
                        </div>
                        <div className="space-y-6">
                            {steps.map((step, index) => (
                                <div key={index} className="flex gap-6 group">
                                    <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-headline font-bold ${index === 0 ? 'bg-primary-fixed text-on-primary-fixed' : 'bg-surface-container-high text-on-surface-variant'}`}>
                                        {index + 1}
                                    </div>
                                    <div className="flex-grow bg-surface-container-low p-6 rounded-xl group-hover:bg-surface-container transition-colors relative">
                                        <textarea rows={3} value={step} onChange={e => updateStep(index, e.target.value)}
                                            placeholder={index === 0 ? "Describe the first step of your culinary journey..." : "What happens next?"}
                                            className="w-full bg-transparent border-0 p-0 focus:ring-0 text-on-surface placeholder:text-outline-variant resize-none outline-none"/>
                                        {steps.length > 1 && (
                                            <button type="button" onClick={() => removeStep(index)} className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity text-outline-variant hover:text-error">
                                                <span className="material-symbols-outlined text-sm">delete</span>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button type="button" onClick={addStep} className="mt-6 flex items-center gap-2 text-primary font-semibold text-sm hover:opacity-80 transition-opacity">
                            <span className="material-symbols-outlined text-lg">add_task</span>
                            Add Step
                        </button>
                    </section>

                    {/* Sticky Action Bar */}
                    <div className="sticky bottom-8 flex justify-center pt-8">
                        <div className="bg-surface-container-highest/90 backdrop-blur-xl px-4 py-3 rounded-full shadow-xl flex items-center gap-4">
                            <button type="button" onClick={clearForm} className="px-8 py-3 rounded-full text-on-surface font-label font-bold text-sm hover:bg-surface-container-high transition-colors">
                                Clear Draft
                            </button>
                            <button type="submit" disabled={loading}
                                className={`bg-gradient-to-br from-primary to-primary-container px-10 py-3 rounded-full text-white font-label font-bold text-sm shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}>
                                {loading ? 'Publishing...' : 'Publish Recipe'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}
