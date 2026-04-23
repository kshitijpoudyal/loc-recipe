"use client";

import {MealType, Recipe, WeekDay} from "@/app/data/DataInterface";
import React, {useMemo, useState} from "react";
import {Dialog, DialogBackdrop, DialogPanel} from "@headlessui/react";
import {XMarkIcon} from "@heroicons/react/24/outline";
import Image from "next/image";
import {updateSchedule} from "@/app/utils/firebaseUtils/DailySchedule";
import {useAuth} from "@/app/components/baseComponents/AuthProvider";

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

const MEAL_TYPES: MealType[] = ['breakfast', 'lunch', 'dinner'];

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
    const [ownerFilter, setOwnerFilter] = useState<'all' | 'mine'>('all');
    const [mealFilter, setMealFilter] = useState<MealType>(mealType);
    const {user} = useAuth();

    const filteredRecipes = useMemo(() => {
        let result = recipes;
        if (ownerFilter === 'mine' && user?.uid) {
            result = result.filter(r => r.createdBy === user.uid);
        }
        result = result.filter(r => r.mealType?.includes(mealFilter));
        const q = search.trim().toLowerCase();
        if (q) result = result.filter(r => r.name.toLowerCase().includes(q));
        return result;
    }, [recipes, search, ownerFilter, mealFilter, user?.uid]);

    const isSelected = (recipe: Recipe) =>
        selected.some(r => r.recipeId === recipe.recipeId);

    const toggle = (recipe: Recipe) => {
        setSelected(prev =>
            isSelected(recipe)
                ? prev.filter(r => r.recipeId !== recipe.recipeId)
                : [...prev, recipe]
        );
    };

    const handleSave = async () => {
        if (!user?.uid) return;
        setSaving(true);
        try {
            const ids = selected.map(r => r.recipeId!).filter(Boolean);
            await updateSchedule(weekDay.value, mealType, ids, user.uid);
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

            <div className="fixed inset-0 z-[60] w-screen">
                <div className="flex h-full items-stretch justify-center md:items-center md:px-4 lg:px-8">
                    <DialogPanel
                        transition
                        className="flex w-full h-full md:h-auto md:max-h-[90vh] md:my-8 md:max-w-2xl transform text-left text-base transition data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in data-[closed]:md:translate-y-0 data-[closed]:md:scale-95"
                    >
                        <div className="relative flex w-full flex-col overflow-hidden bg-background shadow-2xl rounded-t-3xl md:rounded-xl">

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
                            <header className="relative w-full h-28 md:h-32 overflow-hidden flex-shrink-0 bg-surface-container-high">
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/5 to-transparent"/>
                                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/10 to-background/60"/>
                                <div className="absolute top-5 left-6 md:left-10 right-12">
                                    <div className="flex flex-wrap gap-2 mb-2">
                                        <span className="px-3 py-0.5 bg-secondary-fixed text-on-secondary-fixed rounded-full text-xs font-semibold tracking-wider uppercase font-label">
                                            {weekDay.name}
                                        </span>
                                        <span className="px-3 py-0.5 bg-surface-container-highest text-on-surface rounded-full text-xs font-semibold tracking-wider uppercase font-label flex items-center gap-1">
                                            <span className="material-symbols-outlined" style={{fontSize: '12px'}}>{MEAL_ICONS[mealType]}</span>
                                            {mealLabel}
                                        </span>
                                    </div>
                                    <h1 className="font-headline text-2xl md:text-3xl font-bold text-on-surface tracking-tight leading-tight">
                                        Assign Recipes
                                    </h1>
                                </div>
                            </header>

                            {/* Filters + Search */}
                            <div className="px-6 md:px-10 pt-4 pb-2 flex flex-col gap-2 flex-shrink-0">
                                {/* Both filters on one row */}
                                <div className="flex items-center gap-1.5 flex-wrap">
                                    {(['all', 'mine'] as const).map(f => (
                                        <button
                                            key={f}
                                            onClick={() => setOwnerFilter(f)}
                                            className={`px-3 py-1 rounded-full text-[11px] font-semibold font-label tracking-wide transition-colors ${
                                                ownerFilter === f
                                                    ? 'bg-primary text-on-primary'
                                                    : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest'
                                            }`}
                                        >
                                            {f === 'all' ? 'All' : 'Mine'}
                                        </button>
                                    ))}
                                    <span className="w-px h-4 bg-outline-variant/30 mx-0.5"/>
                                    {MEAL_TYPES.map(m => (
                                        <button
                                            key={m}
                                            onClick={() => setMealFilter(m)}
                                            className={`flex items-center gap-0.5 px-3 py-1 rounded-full text-[11px] font-semibold font-label tracking-wide transition-colors ${
                                                mealFilter === m
                                                    ? 'bg-secondary-fixed text-on-secondary-fixed'
                                                    : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest'
                                            }`}
                                        >
                                            <span className="material-symbols-outlined" style={{fontSize: '13px'}}>{MEAL_ICONS[m]}</span>
                                            {m.charAt(0).toUpperCase() + m.slice(1)}
                                        </button>
                                    ))}
                                </div>

                                {/* Search */}
                                <div className="flex items-center gap-2 bg-surface-container-low rounded-xl px-3 py-2.5">
                                    <span className="material-symbols-outlined text-outline" style={{fontSize: '18px'}}>search</span>
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
                            </div>

                            {/* Recipe list — scrollable middle section */}
                            <div className="flex-1 overflow-y-auto px-6 md:px-10 pb-2">
                                <div className="space-y-1">
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
                                                    className="flex items-center gap-3 group cursor-pointer p-3 rounded-xl hover:bg-surface-container-low transition-all"
                                                >
                                                    {/* Checkbox circle */}
                                                    <span className={`w-9 h-9 flex items-center justify-center rounded-full flex-shrink-0 transition-colors ${
                                                        checked
                                                            ? 'bg-primary text-on-primary'
                                                            : 'bg-surface-container-high text-primary group-hover:bg-primary group-hover:text-on-primary'
                                                    }`}>
                                                        <span className="material-symbols-outlined" style={{fontSize: '18px'}}>
                                                            {checked ? 'check' : 'add'}
                                                        </span>
                                                    </span>

                                                    <input
                                                        type="checkbox"
                                                        checked={checked}
                                                        onChange={() => toggle(recipe)}
                                                        className="sr-only"
                                                    />

                                                    {/* Thumbnail */}
                                                    <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-surface-container-high">
                                                        {recipe.imageUrl ? (
                                                            <Image src={recipe.imageUrl} alt={recipe.name} width={56} height={56} className="w-full h-full object-cover"/>
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center">
                                                                <span className="material-symbols-outlined text-outline-variant">restaurant</span>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Name + meta */}
                                                    <div className="flex-1 min-w-0">
                                                        <p className={`font-body text-base transition-colors truncate ${checked ? 'text-primary font-medium' : 'text-on-surface-variant group-hover:text-on-surface'}`}>
                                                            {recipe.name}
                                                        </p>
                                                        <div className="flex gap-1.5 mt-1 flex-wrap items-center">
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

                            {/* Footer — always visible */}
                            <div className="flex-shrink-0 px-6 md:px-10 py-5 border-t border-outline-variant/10 flex gap-3">
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
