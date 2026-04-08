"use client";

import {MealType, Recipe, WeekDay} from "@/app/data/DataInterface";
import React, {useMemo, useState} from "react";
import {Dialog, DialogBackdrop, DialogPanel} from "@headlessui/react";
import {XMarkIcon} from "@heroicons/react/24/outline";
import Image from "next/image";
import {updateSchedule} from "@/app/utils/firebaseUtils/DailySchedule";

export interface AssignRecipeToWeekDayProps {
    isOpen: boolean;
    recipes: Recipe[];
    setIsOpenAction: (open: boolean, reload?: boolean) => void;
    weekDay: WeekDay;
    mealType: MealType;
    selectedRecipeList: Recipe[];
}

const MEAL_ICONS: Record<MealType, string> = {
    breakfast: 'breakfast_dining',
    lunch: 'lunch_dining',
    dinner: 'dinner_dining',
};

export const AssignRecipeToWeekDay: React.FC<AssignRecipeToWeekDayProps> = ({
    isOpen,
    recipes,
    setIsOpenAction,
    weekDay,
    mealType,
    selectedRecipeList,
}) => {
    const [selected, setSelected] = useState<Recipe[]>(selectedRecipeList);
    const [search, setSearch] = useState('');
    const [saving, setSaving] = useState(false);

    const filteredRecipes = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return recipes;
        return recipes.filter(r => r.name.toLowerCase().includes(q));
    }, [recipes, search]);

    const isSelected = (recipe: Recipe) =>
        selected.some(r => r.recipeId === recipe.recipeId);

    const toggle = (recipe: Recipe) => {
        setSelected(prev =>
            isSelected(recipe)
                ? prev.filter(r => r.recipeId !== recipe.recipeId)
                : [...prev, recipe]
        );
    };

    const remove = (recipe: Recipe) => {
        setSelected(prev => prev.filter(r => r.recipeId !== recipe.recipeId));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const ids = selected.map(r => r.recipeId!).filter(Boolean);
            await updateSchedule(weekDay.value, mealType, ids);
            setIsOpenAction(false, true);
        } catch (e) {
            console.error('Error saving schedule:', e);
        } finally {
            setSaving(false);
        }
    };

    const mealLabel = mealType.charAt(0).toUpperCase() + mealType.slice(1);

    return (
        <Dialog open={isOpen} onClose={() => setIsOpenAction(false)} className="relative z-[60]">
            <DialogBackdrop
                transition
                className="fixed inset-0 bg-on-surface/40 backdrop-blur-sm transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
            />

            <div className="fixed inset-0 z-[60] w-screen overflow-y-auto">
                <div className="flex min-h-full items-stretch justify-center md:items-center md:px-4 lg:px-8">
                    <DialogPanel
                        transition
                        className="flex w-full transform text-left text-base transition data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in md:my-8 md:max-w-2xl data-[closed]:md:translate-y-0 data-[closed]:md:scale-95"
                    >
                        <div className="relative flex w-full flex-col overflow-hidden bg-background shadow-2xl rounded-xl">

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

                            {/* Hero */}
                            <header className="relative w-full h-36 md:h-44 overflow-hidden flex-shrink-0 bg-surface-container-high">
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/5 to-transparent"/>
                                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/10 to-transparent"/>
                                <div className="absolute bottom-6 left-6 md:left-10 right-6 md:right-10">
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        <span className="px-3 py-0.5 bg-secondary-fixed text-on-secondary-fixed rounded-full text-xs font-semibold tracking-wider uppercase font-label">
                                            {weekDay.name}
                                        </span>
                                        <span className="px-3 py-0.5 bg-surface-container-highest text-on-surface rounded-full text-xs font-semibold tracking-wider uppercase font-label flex items-center gap-1">
                                            <span className="material-symbols-outlined" style={{fontSize: '12px'}}>{MEAL_ICONS[mealType]}</span>
                                            {mealLabel}
                                        </span>
                                    </div>
                                    <h1 className="font-headline text-2xl md:text-3xl font-bold text-on-surface tracking-tight leading-tight">
                                        Assign a Recipe
                                    </h1>
                                </div>
                            </header>

                            {/* Body */}
                            <div className="px-6 md:px-10 py-8 flex flex-col gap-8 overflow-hidden">

                                {/* All recipes section */}
                                <div className="flex flex-col gap-4 min-h-0">
                                    <div className="flex items-center justify-between">
                                        <h2 className="font-headline text-xl font-bold">All Recipes</h2>
                                        <span className="font-label text-xs uppercase tracking-widest text-primary font-bold">
                                            {filteredRecipes.length} Items
                                        </span>
                                    </div>

                                    {/* Search */}
                                    <div className="flex items-center gap-3 bg-surface-container-low rounded-xl px-4 py-3">
                                        <span className="material-symbols-outlined text-outline text-xl">search</span>
                                        <input
                                            type="text"
                                            value={search}
                                            onChange={e => setSearch(e.target.value)}
                                            placeholder="Search recipes..."
                                            className="flex-1 bg-transparent font-body text-sm outline-none placeholder:text-outline-variant text-on-surface"
                                        />
                                        {search && (
                                            <button onClick={() => setSearch('')} className="text-outline-variant hover:text-on-surface transition-colors">
                                                <XMarkIcon className="size-4"/>
                                            </button>
                                        )}
                                    </div>

                                    {/* Recipe rows */}
                                    <div className="space-y-1 max-h-64 overflow-y-auto -mx-6 md:-mx-10 px-6 md:px-10">
                                        {filteredRecipes.length === 0 ? (
                                            <div className="flex flex-col items-center justify-center py-10 text-outline-variant">
                                                <span className="material-symbols-outlined text-4xl mb-2">search_off</span>
                                                <p className="font-label text-sm">No recipes found</p>
                                            </div>
                                        ) : (
                                            filteredRecipes.map(recipe => {
                                                const checked = isSelected(recipe);
                                                return (
                                                    <label
                                                        key={recipe.recipeId}
                                                        className="flex items-center gap-3 group cursor-pointer p-2.5 rounded-xl hover:bg-surface-container-low transition-all"
                                                    >
                                                        {/* Step-circle style checkbox */}
                                                        <span className={`w-8 h-8 flex items-center justify-center rounded-full font-headline font-bold text-sm flex-shrink-0 transition-colors ${
                                                            checked
                                                                ? 'bg-primary text-on-primary'
                                                                : 'bg-surface-container-high text-primary group-hover:bg-primary group-hover:text-on-primary'
                                                        }`}>
                                                            {checked
                                                                ? <span className="material-symbols-outlined" style={{fontSize: '16px'}}>check</span>
                                                                : <span className="material-symbols-outlined" style={{fontSize: '16px'}}>add</span>
                                                            }
                                                        </span>

                                                        <input
                                                            type="checkbox"
                                                            checked={checked}
                                                            onChange={() => toggle(recipe)}
                                                            className="sr-only"
                                                        />

                                                        {/* Thumbnail */}
                                                        <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-surface-container-high">
                                                            {recipe.imageUrl ? (
                                                                <Image src={recipe.imageUrl} alt={recipe.name} width={40} height={40} className="w-full h-full object-cover"/>
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center">
                                                                    <span className="material-symbols-outlined text-outline-variant text-sm">restaurant</span>
                                                                </div>
                                                            )}
                                                        </div>

                                                        {/* Name + meta */}
                                                        <div className="flex-1 min-w-0">
                                                            <p className={`font-body text-sm transition-colors truncate ${checked ? 'text-primary font-medium' : 'text-on-surface-variant group-hover:text-on-surface'}`}>
                                                                {recipe.name}
                                                            </p>
                                                            <div className="flex gap-1.5 mt-0.5 flex-wrap items-center">
                                                                {recipe.mealType?.slice(0, 2).map(t => (
                                                                    <span key={t} className="px-2 py-0.5 bg-secondary-fixed text-on-secondary-fixed rounded-full text-[9px] font-semibold tracking-wider uppercase font-label">
                                                                        {t}
                                                                    </span>
                                                                ))}
                                                                {((recipe.prepTime ?? 0) + (recipe.cookTime ?? 0)) > 0 && (
                                                                    <span className="text-[10px] text-outline font-label">
                                                                        {(recipe.prepTime ?? 0) + (recipe.cookTime ?? 0)}m
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </label>
                                                );
                                            })
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="px-6 md:px-10 py-6 border-t border-outline-variant/10 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsOpenAction(false)}
                                    className="flex-1 py-3 rounded-full border border-outline-variant/30 font-label text-sm font-semibold text-on-surface-variant hover:bg-surface-container-low transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="flex-[2] py-3 rounded-full bg-primary text-on-primary font-label text-sm font-bold tracking-wide shadow-lg shadow-primary/20 hover:opacity-90 active:scale-95 transition-all disabled:opacity-50"
                                >
                                    {saving ? 'Saving…' : `Save${selected.length > 0 ? ` (${selected.length})` : ''}`}
                                </button>
                            </div>

                        </div>
                    </DialogPanel>
                </div>
            </div>
        </Dialog>
    );
};
