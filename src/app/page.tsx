"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Recipe } from "@/app/data/DataInterface";
import { MEAL_TYPES } from "@/app/data/ConstData";
import { useRecipes } from "@/app/components/baseComponents/RecipeProvider";
import RecipeDetailsTemplate from "@/app/components/RecipeDetailsTemplate";

const HERO_IMAGE = "https://lh3.googleusercontent.com/aida-public/AB6AXuAHgwX2m5vJzXbS63imMz81bbkjghfpwp-wSx1jn3gHGeFKTzfMx_nWJGwSCvMfRXr4WIoNtFKNXqV9I82wP1xm4qouNJubz7SJ3sgEfx4trD0YJqiaNXE0TnzP-6fQo72nhu1SGDkmOcwSGA2J9MENranzQfzE9_9j84vJIGw9vWLWlqLFgfweqxc2HQeFp4-XzgH6ZcBxPYlpJ6iQfrIUbJ4lnk7tFvism_wgBalo_z7oX-9NdQIohGe5Pv974ak96tF2m9dlYYX9";

const CATEGORY_ICONS: Record<string, string> = {
    breakfast: "breakfast_dining",
    lunch: "lunch_dining",
    dinner: "dinner_dining",
};

export default function HomePage() {
    const { recipes, loading } = useRecipes();
    const [activeFilter, setActiveFilter] = useState<string | null>(null);
    const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
    const [detailOpen, setDetailOpen] = useState(false);

    const filteredRecipes = useMemo(
        () => activeFilter ? recipes.filter((r) => r.mealType?.includes(activeFilter)) : recipes,
        [recipes, activeFilter]
    );

    const featuredRecipe = recipes[0] ?? null;

    return (
        <div className="bg-surface text-on-surface">

            {/* ── Mobile layout ── */}
            <div className="md:hidden pt-16 pb-28">

                {/* Hero */}
                <section className="px-6 pt-8 pb-10">
                    {loading ? (
                        <div className="shimmer w-full aspect-[4/5] rounded-[2rem]"/>
                    ) : (
                        <div className="relative w-full aspect-[4/5] rounded-[2rem] overflow-hidden bg-surface-container shadow-sm">
                            {featuredRecipe?.imageUrl ? (
                                <Image src={featuredRecipe.imageUrl} alt={featuredRecipe.name} fill className="object-cover"/>
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-surface-container-high">
                                    <span className="material-symbols-outlined text-outline" style={{fontSize: '64px'}}>restaurant</span>
                                </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"/>
                            {featuredRecipe && (
                                <div className="absolute bottom-0 left-0 p-8 w-full">
                                    {featuredRecipe.mealType && featuredRecipe.mealType.length > 0 && (
                                        <span className="inline-block px-3 py-1 bg-secondary-fixed text-on-secondary-fixed text-[10px] font-bold uppercase tracking-[0.2em] rounded-full mb-3 font-label capitalize">
                                            {featuredRecipe.mealType[0]}
                                        </span>
                                    )}
                                    <h2 className="font-headline text-3xl text-white mb-6 leading-tight">{featuredRecipe.name}</h2>
                                    <button
                                        onClick={() => { setSelectedRecipe(featuredRecipe); setDetailOpen(true); }}
                                        className="bg-gradient-to-br from-primary to-primary-container text-white px-8 py-4 rounded-full font-label font-semibold text-sm tracking-widest flex items-center gap-2 shadow-lg active:scale-95 transition-transform"
                                    >
                                        EXPLORE FEATURED TODAY
                                        <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </section>

                {/* Category filter pills */}
                <section className="mb-10">
                    <div className="px-6 mb-4 flex justify-between items-end">
                        <h3 className="font-headline text-xl">Browse Categories</h3>
                    </div>
                    <div className="flex gap-3 overflow-x-auto px-6 pb-2 hide-scrollbar">
                        <button
                            onClick={() => setActiveFilter(null)}
                            className={`flex-shrink-0 px-6 py-3 rounded-full font-label font-medium text-xs tracking-wider transition-colors ${
                                activeFilter === null ? 'bg-primary text-on-primary' : 'bg-surface-container-low text-on-surface-variant'
                            }`}
                        >
                            All Recipes
                        </button>
                        {MEAL_TYPES.map(type => (
                            <button
                                key={type}
                                onClick={() => setActiveFilter(type)}
                                className={`flex-shrink-0 px-6 py-3 rounded-full font-label font-medium text-xs tracking-wider capitalize transition-colors ${
                                    activeFilter === type ? 'bg-primary text-on-primary' : 'bg-surface-container-low text-on-surface-variant'
                                }`}
                            >
                                {type}
                            </button>
                        ))}
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
                            <div className="pt-4">
                                <Link
                                    href="/list-recipe"
                                    className="inline-block hero-gradient px-6 sm:px-8 py-3 sm:py-4 rounded-full text-white font-label font-semibold tracking-wide shadow-xl hover:scale-105 transition-transform"
                                >
                                    Explore Featured Today
                                </Link>
                            </div>
                        </div>

                        {/* Right: hero image + floating card */}
                        <div className="w-full md:w-7/12 relative group">
                            <div className="absolute -top-4 -left-4 w-24 h-24 bg-secondary-fixed rounded-full -z-10 group-hover:scale-110 transition-transform duration-500" />
                            <div className="rounded-xl overflow-hidden shadow-2xl h-[260px] sm:h-[360px] md:h-[450px]">
                                <img
                                    src={HERO_IMAGE}
                                    alt="Mediterranean vegetable tart on a rustic wooden board"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            {featuredRecipe && (
                                <div className="hidden sm:block absolute -bottom-6 -right-2 md:-right-6 bg-surface-container-lowest p-4 md:p-6 rounded-xl shadow-lg max-w-[220px] md:max-w-xs">
                                    <span className="text-primary font-label text-xs font-bold uppercase tracking-widest mb-2 block">
                                        Chef&apos;s Choice
                                    </span>
                                    <h3 className="font-headline text-base md:text-xl mb-2 line-clamp-2">{featuredRecipe.name}</h3>
                                    <div className="flex items-center gap-3 text-sm text-outline flex-wrap">
                                        {featuredRecipe.cookTime > 0 && (
                                            <span className="flex items-center gap-1">
                                                <span className="material-symbols-outlined text-sm">schedule</span>
                                                {featuredRecipe.cookTime}m
                                            </span>
                                        )}
                                        {featuredRecipe.servings > 0 && (
                                            <span className="flex items-center gap-1">
                                                <span className="material-symbols-outlined text-sm">restaurant_menu</span>
                                                {featuredRecipe.servings}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* Category Filters */}
                <section className="px-4 sm:px-8 mb-12">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex flex-col">
                            <h2 className="text-2xl font-headline font-semibold text-on-surface">Browse Categories</h2>
                            <div className="h-1 w-12 bg-secondary-container mt-1" />
                        </div>
                    </div>
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
                    </div>
                </section>

                {/* Recipe Grid */}
                <section className="px-4 sm:px-8">
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
                                    <div className="h-72 overflow-hidden bg-surface-container-high">
                                        {recipe.imageUrl ? (
                                            <Image
                                                src={recipe.imageUrl}
                                                alt={recipe.name}
                                                width={600}
                                                height={288}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-outline">
                                                <span className="material-symbols-outlined" style={{ fontSize: "64px" }}>restaurant</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Meal type chips */}
                                    {recipe.mealType && recipe.mealType.length > 0 && (
                                        <div className="absolute top-4 left-4 flex flex-wrap gap-1">
                                            {recipe.mealType.map(type => (
                                                <span key={type} className="bg-secondary-fixed text-on-secondary-fixed px-3 py-1 rounded-full text-xs font-label font-bold uppercase tracking-tighter capitalize">
                                                    {type}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    {/* Card body */}
                                    <div className="p-6">
                                        <h3 className="text-2xl font-headline font-bold text-on-surface mb-3 group-hover:text-primary transition-colors">
                                            {recipe.name}
                                        </h3>
                                        {recipe.createdByName && (
                                            <div className="mb-3">
                                                <span className="inline-flex items-center gap-1 bg-surface-container-high text-on-surface-variant px-3 py-1 rounded-full text-xs font-label">
                                                    <span className="material-symbols-outlined text-sm">person</span>
                                                    {recipe.createdByName}
                                                </span>
                                            </div>
                                        )}
                                        <div className="flex items-center gap-4 text-sm text-outline font-label">
                                            {recipe.cookTime > 0 && (
                                                <span className="flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-lg">timer</span>
                                                    {recipe.cookTime}m
                                                </span>
                                            )}
                                            {recipe.servings > 0 && (
                                                <span className="flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-lg">restaurant</span>
                                                    {recipe.servings} servings
                                                </span>
                                            )}
                                            {recipe.nutrition?.calories > 0 && (
                                                <span className="flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-lg">local_fire_department</span>
                                                    {recipe.nutrition.calories} kcal
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
                        <Link href="/list-recipe" className="hover:text-primary transition-colors">Recipes</Link>
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

            {/* Recipe detail modal */}
            {detailOpen && selectedRecipe && (
                <RecipeDetailsTemplate
                    isOpen={detailOpen}
                    recipe={selectedRecipe}
                    setIsOpenAction={setDetailOpen}
                />
            )}
        </div>
    );
}
