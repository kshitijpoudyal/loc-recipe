"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Recipe } from "@/app/data/DataInterface";
import { MEAL_TYPES } from "@/app/data/ConstData";
import { useRecipes } from "@/app/components/baseComponents/RecipeProvider";
import { useAuth } from "@/app/components/baseComponents/AuthProvider";
import { deleteRecipeFromFirebase, toggleRecipePublic } from "@/app/utils/firebaseUtils/Recipe";
import RecipeDetailsTemplate from "@/app/components/RecipeDetailsTemplate";
import EditRecipeModal from "@/app/components/pageComponents/EditRecipe";
import ConfirmDialog from "@/app/components/baseComponents/ConfirmDialog";

const HERO_IMAGE = "https://lh3.googleusercontent.com/aida-public/AB6AXuAHgwX2m5vJzXbS63imMz81bbkjghfpwp-wSx1jn3gHGeFKTzfMx_nWJGwSCvMfRXr4WIoNtFKNXqV9I82wP1xm4qouNJubz7SJ3sgEfx4trD0YJqiaNXE0TnzP-6fQo72nhu1SGDkmOcwSGA2J9MENranzQfzE9_9j84vJIGw9vWLWlqLFgfweqxc2HQeFp4-XzgH6ZcBxPYlpJ6iQfrIUbJ4lnk7tFvism_wgBalo_z7oX-9NdQIohGe5Pv974ak96tF2m9dlYYX9";

const CATEGORY_ICONS: Record<string, string> = {
    breakfast: "breakfast_dining",
    lunch: "lunch_dining",
    dinner: "dinner_dining",
};

export default function HomePage() {
    const { recipes, loading, invalidate } = useRecipes();
    const { user } = useAuth();
    const [activeFilter, setActiveFilter] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterSheetOpen, setFilterSheetOpen] = useState(false);
    const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
    const [detailOpen, setDetailOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

    const handleDelete = (recipe: Recipe) => {
        if (!recipe.recipeId) return;
        setConfirmDeleteOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!selectedRecipe?.recipeId) return;
        setConfirmDeleteOpen(false);
        await deleteRecipeFromFirebase(selectedRecipe.recipeId, selectedRecipe.createdBy!, selectedRecipe.isPublic);
        invalidate();
        setDetailOpen(false);
    };

    const handleTogglePublic = async (recipe: Recipe) => {
        await toggleRecipePublic(recipe);
        invalidate();
        setDetailOpen(false);
    };

    const isOwner = (recipe: Recipe) => !!(user && recipe.createdBy === user.uid);

    const filteredRecipes = useMemo(() => {
        const q = searchQuery.trim().toLowerCase();
        return recipes.filter(r => {
            const matchesFilter =
                !activeFilter ? true :
                activeFilter === 'my-recipes' ? r.createdBy === user?.uid :
                r.mealType?.includes(activeFilter);
            const matchesSearch = !q || r.name.toLowerCase().includes(q);
            return matchesFilter && matchesSearch;
        });
    }, [recipes, activeFilter, searchQuery, user?.uid]);

    // Daily pick — deterministic seed so it's consistent all day
    const todayRecipe = useMemo(() => {
        if (!recipes.length) return null;
        const dayIndex = Math.floor(Date.now() / (1000 * 60 * 60 * 24));
        return recipes[dayIndex % recipes.length];
    }, [recipes]);

    // Hero recipe — starts as today's pick, can be shuffled
    const [heroRecipe, setHeroRecipe] = useState<Recipe | null>(null);
    const [shuffling, setShuffling] = useState(false);

    useEffect(() => {
        if (todayRecipe && !heroRecipe) setHeroRecipe(todayRecipe);
    }, [todayRecipe, heroRecipe]);

    const handleShuffle = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (recipes.length < 2) return;
        setShuffling(true);
        setTimeout(() => {
            let next: Recipe;
            do { next = recipes[Math.floor(Math.random() * recipes.length)]; }
            while (next.recipeId === heroRecipe?.recipeId && recipes.length > 1);
            setHeroRecipe(next);
            setShuffling(false);
        }, 300);
    };

    return (
        <div className="bg-surface text-on-surface">

            {/* ── Mobile layout ── */}
            <div className="md:hidden pt-16 pb-28">

                {/* Hero */}
                <section className="px-6 pt-8 pb-10">
                    {loading ? (
                        <div className="shimmer w-full aspect-[4/5] rounded-[2rem]"/>
                    ) : (
                        <div
                            className="relative w-full aspect-[4/5] rounded-[2rem] overflow-hidden bg-surface-container shadow-sm cursor-pointer active:scale-[0.99] transition-transform"
                            onClick={() => heroRecipe && (setSelectedRecipe(heroRecipe), setDetailOpen(true))}
                        >
                            {heroRecipe?.imageUrl ? (
                                <Image src={heroRecipe.imageUrl} alt={heroRecipe.name} fill loading="eager" sizes="100vw" className={`object-cover transition-opacity duration-300 ${shuffling ? 'opacity-0' : 'opacity-100'}`}/>
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-surface-container-high">
                                    <span className="material-symbols-outlined text-outline" style={{fontSize: '64px'}}>restaurant</span>
                                </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"/>

                            {/* Shuffle button */}
                            <button
                                onClick={handleShuffle}
                                className={`absolute top-4 right-4 w-10 h-10 rounded-full bg-surface-container-lowest/70 backdrop-blur flex items-center justify-center text-on-surface hover:bg-surface-container-lowest transition-colors active:scale-90 ${shuffling ? 'animate-spin' : ''}`}
                            >
                                <span className="material-symbols-outlined text-base">shuffle</span>
                            </button>

                            {heroRecipe && (
                                <div className="absolute bottom-0 left-0 p-8 w-full">
                                    <span className="inline-block px-3 py-1 bg-surface-container-lowest/70 backdrop-blur text-primary text-[10px] font-bold uppercase tracking-[0.2em] rounded-full mb-3 font-label">
                                        Today&apos;s Pick
                                    </span>
                                    {heroRecipe.mealType && heroRecipe.mealType.length > 0 && (
                                        <span className="inline-block ml-2 px-3 py-1 bg-secondary-fixed text-on-secondary-fixed text-[10px] font-bold uppercase tracking-[0.2em] rounded-full mb-3 font-label capitalize">
                                            {heroRecipe.mealType[0]}
                                        </span>
                                    )}
                                    <h2 className="font-headline text-3xl text-white leading-tight">{heroRecipe.name}</h2>
                                </div>
                            )}
                        </div>
                    )}
                </section>

                {/* Search + Filter icon */}
                <section className="px-6 mb-6">
                    <div className="flex gap-3 items-center">
                        <div className="relative flex-1">
                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline pointer-events-none">search</span>
                            <input
                                type="text"
                                placeholder="Search recipes..."
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                className="w-full bg-surface-container-low rounded-2xl pl-12 pr-10 py-4 font-body text-base text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary/40"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface transition-colors"
                                >
                                    <span className="material-symbols-outlined text-base">close</span>
                                </button>
                            )}
                        </div>
                        <button
                            onClick={() => setFilterSheetOpen(true)}
                            className={`flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center transition-colors relative ${
                                activeFilter ? 'bg-primary text-on-primary' : 'bg-surface-container-low text-on-surface-variant'
                            }`}
                        >
                            <span className="material-symbols-outlined">tune</span>
                            {activeFilter && (
                                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-secondary-container"/>
                            )}
                        </button>
                    </div>
                </section>

                {/* Recipe feed */}
                <section className="px-6 space-y-8">
                    <h3 className="font-headline text-xl">Chef&apos;s Selection</h3>
                    {loading ? (
                        Array.from({length: 3}).map((_, i) => (
                            <div key={i}>
                                <div className="shimmer w-full aspect-video rounded-3xl mb-4"/>
                                <div className="space-y-2">
                                    <div className="shimmer h-6 w-3/4 rounded-lg"/>
                                    <div className="shimmer h-4 w-1/3 rounded-lg"/>
                                </div>
                            </div>
                        ))
                    ) : filteredRecipes.length === 0 ? (
                        <p className="text-on-surface-variant text-center py-16 font-label">No recipes found.</p>
                    ) : (
                        filteredRecipes.map(recipe => (
                            <div
                                key={recipe.recipeId}
                                className="group cursor-pointer"
                                onClick={() => { setSelectedRecipe(recipe); setDetailOpen(true); }}
                            >
                                <div className="relative aspect-video rounded-3xl overflow-hidden mb-4 shadow-sm bg-surface-container">
                                    {recipe.imageUrl ? (
                                        <Image src={recipe.imageUrl} alt={recipe.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500"/>
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <span className="material-symbols-outlined text-outline" style={{fontSize: '48px'}}>restaurant</span>
                                        </div>
                                    )}
                                    {recipe.mealType && recipe.mealType.length > 0 && (
                                        <div className="absolute top-4 left-4">
                                            <span className="bg-secondary-fixed text-on-secondary-fixed px-3 py-1 rounded-full text-[10px] font-label font-bold uppercase tracking-tighter capitalize">
                                                {recipe.mealType[0]}
                                            </span>
                                        </div>
                                    )}
                                    {recipe.createdByName && (
                                        <div className="absolute bottom-4 left-4">
                                            <span className="inline-flex items-center gap-1 bg-surface-container-lowest/80 backdrop-blur text-on-surface px-3 py-1 rounded-full text-[10px] font-label font-semibold">
                                                <span className="material-symbols-outlined" style={{fontSize: '12px'}}>person</span>
                                                {recipe.createdByName}
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="font-headline text-lg text-on-surface leading-snug">{recipe.name}</h4>
                                        <div className="flex items-center gap-4 mt-2 text-on-surface-variant">
                                            {((recipe.prepTime ?? 0) + (recipe.cookTime ?? 0)) > 0 && (
                                                <div className="flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-sm">schedule</span>
                                                    <span className="text-[11px] font-label font-medium uppercase tracking-wider">
                                                        {(recipe.prepTime ?? 0) + (recipe.cookTime ?? 0)} MINS
                                                    </span>
                                                </div>
                                            )}
                                            {recipe.servings != null && recipe.servings > 0 && (
                                                <div className="flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-sm">restaurant_menu</span>
                                                    <span className="text-[11px] font-label font-medium uppercase tracking-wider">
                                                        {recipe.servings} servings
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </section>
            </div>

            {/* ── Mobile filter bottom sheet ── */}
            {filterSheetOpen && (
                <>
                    <div
                        className="md:hidden fixed inset-0 bg-on-surface/40 backdrop-blur-sm z-[60]"
                        onClick={() => setFilterSheetOpen(false)}
                    />
                    <div className="md:hidden fixed bottom-0 left-0 right-0 z-[70] bg-surface rounded-t-[2rem] shadow-[0_-8px_40px_rgba(24,29,20,0.12)] flex flex-col max-h-[80vh]">
                        {/* Handle */}
                        <div className="flex justify-center py-4">
                            <div className="w-12 h-1.5 bg-outline-variant/30 rounded-full"/>
                        </div>
                        {/* Header */}
                        <div className="px-8 pb-4">
                            <h2 className="text-2xl font-headline font-bold text-on-surface">Filter Recipes</h2>
                            <p className="font-body text-sm text-on-surface-variant mt-1">Select a category to refine your view.</p>
                        </div>
                        {/* Options */}
                        <div className="px-6 py-2 flex-1 overflow-y-auto">
                            <div className="space-y-2">
                                {[
                                    { value: null, label: 'All Recipes', icon: 'restaurant_menu' },
                                    { value: 'breakfast', label: 'Breakfast', icon: 'bakery_dining' },
                                    { value: 'lunch', label: 'Lunch', icon: 'lunch_dining' },
                                    { value: 'dinner', label: 'Dinner', icon: 'dinner_dining' },
                                    ...(user ? [{ value: 'my-recipes', label: 'My Recipes', icon: 'menu_book' }] : []),
                                ].map(item => {
                                    const isActive = activeFilter === item.value;
                                    return (
                                        <button
                                            key={item.label}
                                            onClick={() => setActiveFilter(item.value)}
                                            className={`w-full flex items-center justify-between p-4 rounded-xl transition-colors ${isActive ? 'bg-surface-container-low' : 'hover:bg-surface-container-low'}`}
                                        >
                                            <div className="flex items-center gap-4">
                                                <span
                                                    className={`material-symbols-outlined ${isActive ? 'text-primary' : 'text-on-surface-variant'}`}
                                                    style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
                                                >
                                                    {item.icon}
                                                </span>
                                                <span className={`font-body font-medium ${isActive ? 'text-on-surface' : 'text-on-surface-variant'}`}>
                                                    {item.label}
                                                </span>
                                            </div>
                                            {isActive && (
                                                <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                                                    check_circle
                                                </span>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                        {/* Apply button */}
                        <div className="p-6 pt-4 pb-10">
                            <button
                                onClick={() => setFilterSheetOpen(false)}
                                className="w-full py-4 rounded-full bg-primary text-on-primary font-body font-bold text-base shadow-lg hover:opacity-90 active:scale-[0.98] transition-all"
                            >
                                Apply Filter
                            </button>
                        </div>
                    </div>
                </>
            )}

            {/* ── Desktop layout ── */}
            <main className="hidden md:block pt-24 pb-12 max-w-screen-2xl mx-auto">
                {/* Hero Section */}
                <section className="px-4 sm:px-8 mb-16">
                    <div className="flex flex-col md:flex-row gap-8 items-center">
                        {/* Left: text */}
                        <div className="w-full md:w-5/12 space-y-6">
                            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-headline font-bold leading-tight text-on-surface">
                                The Art of <br />
                                <span className="text-primary italic">Mindful Cooking</span>
                            </h1>
                            <p className="text-base sm:text-lg text-on-surface-variant max-w-md leading-relaxed">
                                Discover a curated collection of seasonal recipes designed for the modern kitchen. Earthy, vibrant, and intentionally crafted.
                            </p>
                        </div>

                        {/* Right: hero image + floating card */}
                        <div
                            className="w-full md:w-7/12 relative group cursor-pointer"
                            onClick={() => heroRecipe && (setSelectedRecipe(heroRecipe), setDetailOpen(true))}
                        >
                            <div className="absolute -top-4 -left-4 w-24 h-24 bg-secondary-fixed rounded-full -z-10 group-hover:scale-110 transition-transform duration-500" />
                            <div className="relative rounded-xl overflow-hidden shadow-2xl h-[260px] sm:h-[360px] md:h-[450px]">
                                {heroRecipe?.imageUrl ? (
                                    <Image
                                        src={heroRecipe.imageUrl}
                                        alt={heroRecipe.name}
                                        fill
                                        loading="eager"
                                        sizes="(max-width: 767px) 100vw, 58vw"
                                        className={`object-cover group-hover:scale-105 transition-all duration-700 ${shuffling ? 'opacity-0 scale-105' : 'opacity-100'}`}
                                    />
                                ) : (
                                    <Image
                                        src={HERO_IMAGE}
                                        alt="Hero"
                                        fill
                                        sizes="(max-width: 767px) 100vw, 58vw"
                                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                                    />
                                )}

                                {/* Shuffle button */}
                                <button
                                    onClick={handleShuffle}
                                    className={`absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-surface-container-lowest/70 backdrop-blur flex items-center justify-center text-on-surface hover:bg-surface-container-lowest transition-colors hover:scale-110 active:scale-90 ${shuffling ? 'animate-spin' : ''}`}
                                >
                                    <span className="material-symbols-outlined text-base">shuffle</span>
                                </button>
                            </div>
                            {heroRecipe && (
                                <div className="hidden sm:block absolute -bottom-6 -right-2 md:-right-6 bg-surface-container-lowest p-4 md:p-6 rounded-xl shadow-lg max-w-[220px] md:max-w-xs hover:shadow-xl transition-shadow">
                                    <span className="text-primary font-label text-xs font-bold uppercase tracking-widest mb-2 block">
                                        Today&apos;s Pick
                                    </span>
                                    <h3 className="font-headline text-base md:text-xl mb-2 line-clamp-2">{heroRecipe.name}</h3>
                                    <div className="flex items-center gap-3 text-sm text-outline flex-wrap">
                                        {(heroRecipe.cookTime ?? 0) > 0 && (
                                            <span className="flex items-center gap-1">
                                                <span className="material-symbols-outlined text-sm">schedule</span>
                                                {heroRecipe.cookTime}m
                                            </span>
                                        )}
                                        {(heroRecipe.servings ?? 0) > 0 && (
                                            <span className="flex items-center gap-1">
                                                <span className="material-symbols-outlined text-sm">restaurant_menu</span>
                                                {heroRecipe.servings}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* Search bar */}
                <section className="px-4 sm:px-8 mb-10">
                    <div className="relative">
                        <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-outline pointer-events-none text-xl">search</span>
                        <input
                            type="text"
                            placeholder="Search recipes by name..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="w-full bg-surface-container-low rounded-2xl pl-14 pr-12 py-5 font-body text-lg text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary/40 transition-shadow"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute right-5 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface transition-colors"
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        )}
                    </div>
                </section>

                {/* Category Filters */}
                <section className="px-4 sm:px-8 mb-12">
                    <div className="flex gap-4 overflow-x-auto pb-4">
                        <button
                            onClick={() => setActiveFilter(null)}
                            className={`px-6 py-3 rounded-full flex items-center gap-2 whitespace-nowrap font-label font-medium transition-colors ${
                                activeFilter === null
                                    ? "bg-primary text-white"
                                    : "bg-surface-container-low text-on-surface hover:bg-surface-container-high"
                            }`}
                        >
                            <span className="material-symbols-outlined">grid_view</span>
                            All Recipes
                        </button>
                        {MEAL_TYPES.map((type) => (
                            <button
                                key={type}
                                onClick={() => setActiveFilter(type)}
                                className={`px-6 py-3 rounded-full flex items-center gap-2 whitespace-nowrap font-label font-medium capitalize transition-colors ${
                                    activeFilter === type
                                        ? "bg-primary text-white"
                                        : "bg-surface-container-low text-on-surface hover:bg-surface-container-high"
                                }`}
                            >
                                <span className="material-symbols-outlined">{CATEGORY_ICONS[type] ?? "restaurant"}</span>
                                {type}
                            </button>
                        ))}
                        {user && (
                            <button
                                onClick={() => setActiveFilter('my-recipes')}
                                className={`px-6 py-3 rounded-full flex items-center gap-2 whitespace-nowrap font-label font-medium transition-colors ${
                                    activeFilter === 'my-recipes'
                                        ? "bg-primary text-white"
                                        : "bg-surface-container-low text-on-surface hover:bg-surface-container-high"
                                }`}
                            >
                                <span className="material-symbols-outlined">person</span>
                                My Recipes
                            </button>
                        )}
                    </div>
                </section>

                {/* Recipe Grid */}
                <section id="recipes" className="px-4 sm:px-8">
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                            {Array.from({length: 6}).map((_, i) => (
                                <div key={i} className="bg-surface-container-low rounded-xl overflow-hidden">
                                    {/* Image */}
                                    <div className="h-72 shimmer"/>
                                    {/* Body */}
                                    <div className="p-6 space-y-3">
                                        {/* Title */}
                                        <div className="h-7 w-3/4 rounded-lg shimmer"/>
                                        {/* Pill */}
                                        <div className="h-5 w-20 rounded-full shimmer"/>
                                        {/* Stats row */}
                                        <div className="flex gap-3 pt-1">
                                            <div className="h-4 w-12 rounded shimmer"/>
                                            <div className="h-4 w-16 rounded shimmer"/>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : filteredRecipes.length === 0 ? (
                        <p className="text-on-surface-variant text-center py-24 font-label">No recipes found.</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                            {filteredRecipes.map((recipe) => (
                                <div
                                    key={recipe.recipeId}
                                    className="group relative bg-surface-container-low rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-2 cursor-pointer"
                                    onClick={() => {
                                        setSelectedRecipe(recipe);
                                        setDetailOpen(true);
                                    }}
                                >
                                    {/* Image */}
                                    <div className="relative h-72 overflow-hidden bg-surface-container-high">
                                        {recipe.imageUrl ? (
                                            <Image
                                                src={recipe.imageUrl}
                                                alt={recipe.name}
                                                fill
                                                sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw"
                                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-outline">
                                                <span className="material-symbols-outlined" style={{ fontSize: "64px" }}>restaurant</span>
                                            </div>
                                        )}

                                        {/* Meal type chips — top left */}
                                        {recipe.mealType && recipe.mealType.length > 0 && (
                                            <div className="absolute top-4 left-4 flex flex-wrap gap-1">
                                                {recipe.mealType.map(type => (
                                                    <span key={type} className="bg-secondary-fixed text-on-secondary-fixed px-3 py-1 rounded-full text-xs font-label font-bold uppercase tracking-tighter capitalize">
                                                        {type}
                                                    </span>
                                                ))}
                                            </div>
                                        )}

                                        {/* Username pill — bottom left */}
                                        {recipe.createdByName && (
                                            <div className="absolute bottom-4 left-4">
                                                <span className="inline-flex items-center gap-1 bg-surface-container-lowest/80 backdrop-blur text-on-surface px-3 py-1 rounded-full text-xs font-label font-semibold">
                                                    <span className="material-symbols-outlined text-sm">person</span>
                                                    {recipe.createdByName}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Card body */}
                                    <div className="p-6">
                                        <h3 className="text-2xl font-headline font-bold text-on-surface mb-3 group-hover:text-primary transition-colors">
                                            {recipe.name}
                                        </h3>
                                        <div className="flex items-center gap-4 text-sm text-outline font-label">
                                            {(recipe.cookTime ?? 0) > 0 && (
                                                <span className="flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-lg">timer</span>
                                                    {recipe.cookTime}m
                                                </span>
                                            )}
                                            {(recipe.servings ?? 0) > 0 && (
                                                <span className="flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-lg">restaurant</span>
                                                    {recipe.servings} servings
                                                </span>
                                            )}
                                            {(recipe.nutrition?.calories ?? 0) > 0 && (
                                                <span className="flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-lg">local_fire_department</span>
                                                    {recipe.nutrition!.calories} kcal
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

            </main>

            {/* Footer — desktop only */}
            <footer className="hidden md:block bg-surface py-12 px-4 sm:px-8 border-t border-outline-variant/20 max-w-screen-2xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                    <div>
                        <span className="text-2xl font-headline font-bold text-primary">Lochu&apos;s Recipe</span>
                        <p className="text-sm text-outline mt-2 font-label">The Editorial Cookbook for the Modern Kitchen.</p>
                    </div>
                    <div className="flex gap-8 text-sm font-label text-on-surface-variant">
                        <Link href="/" className="hover:text-primary transition-colors">Recipes</Link>
                        <Link href="/add-recipe" className="hover:text-primary transition-colors">Add Recipe</Link>
                        <Link href="/daily-schedule" className="hover:text-primary transition-colors">Planner</Link>
                    </div>
                    <div className="flex gap-4">
                        <span className="material-symbols-outlined text-outline cursor-pointer hover:text-primary">language</span>
                        <span className="material-symbols-outlined text-outline cursor-pointer hover:text-primary">share</span>
                    </div>
                </div>
                <div className="mt-12 text-center text-xs text-outline font-label">
                    © 2024 Lochu&apos;s Recipe. All rights reserved. Designed with intention.
                </div>
            </footer>

            {/* Confirm delete modal */}
            {selectedRecipe && (
                <ConfirmDialog
                    isOpen={confirmDeleteOpen}
                    title="Delete Recipe"
                    message={`Are you sure you want to delete "${selectedRecipe.name}"? This cannot be undone.`}
                    confirmLabel="Delete"
                    onConfirm={handleConfirmDelete}
                    onCancel={() => setConfirmDeleteOpen(false)}
                    variant="danger"
                />
            )}

            {/* Recipe detail modal */}
            {detailOpen && selectedRecipe && (
                <RecipeDetailsTemplate
                    isOpen={detailOpen}
                    recipe={selectedRecipe}
                    setIsOpenAction={setDetailOpen}
                    onDelete={isOwner(selectedRecipe) ? () => handleDelete(selectedRecipe) : undefined}
                    onEdit={isOwner(selectedRecipe) ? () => { setDetailOpen(false); setEditOpen(true); } : undefined}
                    onTogglePublic={isOwner(selectedRecipe) ? () => handleTogglePublic(selectedRecipe) : undefined}
                />
            )}
            {editOpen && selectedRecipe && (
                <EditRecipeModal
                    isOpen={editOpen}
                    recipe={selectedRecipe}
                    setIsOpenAction={setEditOpen}
                />
            )}
        </div>
    );
}
