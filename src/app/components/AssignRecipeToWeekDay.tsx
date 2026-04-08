"use client";

import {MealType, Recipe, WeekDay} from "@/app/data/DataInterface";
import React, {useMemo, useState} from "react";
import {Dialog, DialogBackdrop, DialogPanel} from "@headlessui/react";
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

    const dayLabel = weekDay.name;
    const mealLabel = mealType.charAt(0).toUpperCase() + mealType.slice(1);

    return (
        <Dialog open={isOpen} onClose={() => setIsOpenAction(false)} className="relative z-[60]">
            <DialogBackdrop
                transition
                className="fixed inset-0 bg-on-surface/40 backdrop-blur-sm transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
            />

            {/* Bottom sheet on mobile, centered dialog on desktop */}
            <div className="fixed inset-0 z-[60] flex items-end md:items-center justify-center md:px-4">
                <DialogPanel
                    transition
                    className="w-full md:max-w-lg bg-background rounded-t-3xl md:rounded-2xl shadow-2xl flex flex-col max-h-[90vh] data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
                >
                    {/* Drag handle (mobile) */}
                    <div className="flex justify-center pt-3 pb-1 md:hidden">
                        <div className="w-10 h-1 bg-outline-variant/40 rounded-full"/>
                    </div>

                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant/10">
                        <div>
                            <p className="font-label text-[10px] uppercase tracking-widest text-outline font-semibold">{dayLabel}</p>
                            <h2 className="font-headline text-xl font-bold text-on-surface">{mealLabel}</h2>
                        </div>
                        <button
                            onClick={() => setIsOpenAction(false)}
                            className="p-2 rounded-full hover:bg-surface-container-high transition-colors text-on-surface-variant"
                        >
                            <span className="material-symbols-outlined text-xl">close</span>
                        </button>
                    </div>

                    {/* Selected pills */}
                    {selected.length > 0 && (
                        <div className="px-6 pt-4 pb-2">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="font-label text-[10px] uppercase tracking-widest text-primary font-bold">
                                    Selected ({selected.length})
                                </span>
                                <button
                                    onClick={() => setSelected([])}
                                    className="font-label text-[10px] uppercase tracking-widest text-error font-semibold ml-auto"
                                >
                                    Clear all
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {selected.map(recipe => (
                                    <div
                                        key={recipe.recipeId}
                                        className="flex items-center gap-1.5 bg-primary/10 text-primary rounded-full pl-3 pr-2 py-1"
                                    >
                                        <span className="font-label text-xs font-semibold truncate max-w-[120px]">{recipe.name}</span>
                                        <button
                                            onClick={() => remove(recipe)}
                                            className="w-4 h-4 rounded-full bg-primary/20 hover:bg-primary/40 flex items-center justify-center transition-colors flex-shrink-0"
                                        >
                                            <span className="material-symbols-outlined text-primary" style={{fontSize: '12px'}}>close</span>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Search */}
                    <div className="px-6 pt-4 pb-2">
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
                                <button onClick={() => setSearch('')} className="text-outline-variant hover:text-on-surface">
                                    <span className="material-symbols-outlined text-lg">close</span>
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Recipe list */}
                    <div className="flex-1 overflow-y-auto px-6 py-2 space-y-2">
                        {filteredRecipes.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-outline-variant">
                                <span className="material-symbols-outlined text-4xl mb-2">search_off</span>
                                <p className="font-label text-sm">No recipes found</p>
                            </div>
                        ) : (
                            filteredRecipes.map(recipe => {
                                const selected_ = isSelected(recipe);
                                return (
                                    <button
                                        key={recipe.recipeId}
                                        type="button"
                                        onClick={() => toggle(recipe)}
                                        className={`w-full flex items-center gap-4 p-3 rounded-2xl transition-all text-left ${
                                            selected_
                                                ? 'bg-primary/10 ring-1 ring-primary/30'
                                                : 'bg-surface-container-low hover:bg-surface-container-high'
                                        }`}
                                    >
                                        {/* Image */}
                                        <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-surface-container-high">
                                            {recipe.imageUrl ? (
                                                <Image
                                                    src={recipe.imageUrl}
                                                    alt={recipe.name}
                                                    width={64}
                                                    height={64}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <span className="material-symbols-outlined text-outline-variant">restaurant</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1 min-w-0">
                                            <p className={`font-headline text-sm font-semibold leading-tight truncate ${selected_ ? 'text-primary' : 'text-on-surface'}`}>
                                                {recipe.name}
                                            </p>
                                            <div className="flex flex-wrap gap-1.5 mt-1.5 items-center">
                                                {recipe.mealType?.slice(0, 2).map(t => (
                                                    <span key={t} className="bg-secondary-fixed text-on-secondary-fixed px-2 py-0.5 rounded-full text-[9px] font-label font-bold uppercase tracking-tight">
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

                                        {/* Checkmark */}
                                        <div className={`w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center transition-all ${
                                            selected_
                                                ? 'bg-primary'
                                                : 'border-2 border-outline-variant/30'
                                        }`}>
                                            {selected_ && (
                                                <span className="material-symbols-outlined text-on-primary" style={{fontSize: '14px'}}>check</span>
                                            )}
                                        </div>
                                    </button>
                                );
                            })
                        )}
                    </div>

                    {/* Footer */}
                    <div className="px-6 py-4 border-t border-outline-variant/10 flex gap-3">
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
                            className="flex-2 flex-grow-[2] py-3 rounded-full bg-primary text-on-primary font-label text-sm font-bold tracking-wide shadow-lg shadow-primary/20 hover:opacity-90 active:scale-95 transition-all disabled:opacity-50"
                        >
                            {saving ? 'Saving…' : `Save ${selected.length > 0 ? `(${selected.length})` : ''}`}
                        </button>
                    </div>
                </DialogPanel>
            </div>
        </Dialog>
    );
};
