import {Dialog, DialogBackdrop, DialogPanel} from '@headlessui/react'
import {XMarkIcon} from '@heroicons/react/24/outline'
import Image from "next/image";
import {Recipe} from "@/app/data/DataInterface";
import {useState} from "react";

export interface RecipeDetailsTemplate {
    isOpen: boolean;
    recipe: Recipe;
    setIsOpenAction: (open: boolean) => void;
    onDelete?: () => void;
    onEdit?: () => void;
    onTogglePublic?: () => void;
}

export default function RecipeDetailsTemplate({isOpen, recipe, setIsOpenAction, onDelete, onEdit, onTogglePublic}: RecipeDetailsTemplate) {
    const [checkedIngredients, setCheckedIngredients] = useState<Set<number>>(new Set());

    function toggleIngredient(idx: number) {
        setCheckedIngredients(prev => {
            const next = new Set(prev);
            if (next.has(idx)) { next.delete(idx); } else { next.add(idx); }
            return next;
        });
    }

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
                        className="flex w-full transform text-left text-base transition data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in md:my-8 md:max-w-4xl data-[closed]:md:translate-y-0 data-[closed]:md:scale-95"
                    >
                        <div className="relative flex w-full flex-col overflow-hidden bg-background shadow-2xl rounded-xl">

                            {/* Close / Edit / Public / Delete buttons */}
                            <div className="absolute right-4 top-4 z-20 flex items-center gap-2">
                                {onTogglePublic && (
                                    <button
                                        type="button"
                                        onClick={onTogglePublic}
                                        className={`text-xs font-semibold font-label border rounded-full px-3 py-1 backdrop-blur flex items-center gap-1 transition-colors ${
                                            recipe.isPublic
                                                ? 'text-tertiary border-tertiary/30 bg-tertiary/10 hover:bg-tertiary/20'
                                                : 'text-on-surface-variant border-outline-variant/30 bg-surface-container-lowest/80 hover:bg-surface-container-low'
                                        }`}
                                    >
                                        <span className="material-symbols-outlined" style={{fontSize: '13px'}}>
                                            {recipe.isPublic ? 'public' : 'public_off'}
                                        </span>
                                        {recipe.isPublic ? 'Public' : 'Private'}
                                    </button>
                                )}
                                {onEdit && (
                                    <button
                                        type="button"
                                        onClick={onEdit}
                                        className="text-xs font-semibold font-label text-primary border border-primary/30 rounded-full px-3 py-1 bg-surface-container-lowest/80 backdrop-blur hover:bg-primary/10 transition-colors"
                                    >
                                        Edit
                                    </button>
                                )}
                                {onDelete && (
                                    <button
                                        type="button"
                                        onClick={onDelete}
                                        className="text-xs font-semibold font-label text-error border border-error/30 rounded-full px-3 py-1 bg-surface-container-lowest/80 backdrop-blur hover:bg-error/10 transition-colors"
                                    >
                                        Delete
                                    </button>
                                )}
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
                            <header className="relative w-full h-72 md:h-96 overflow-hidden flex-shrink-0">
                                {recipe.imageUrl ? (
                                    <Image
                                        alt={recipe.name}
                                        src={recipe.imageUrl}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 896px) 100vw, 896px"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-surface-container-high"/>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent"/>

                                <div className="absolute bottom-8 left-6 md:left-10 right-6 md:right-10">
                                    {/* Tags */}
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {recipe.mealType?.map(tag => (
                                            <span key={tag} className="px-3 py-0.5 bg-secondary-fixed text-on-secondary-fixed rounded-full text-xs font-semibold tracking-wider uppercase font-label">
                                                {tag}
                                            </span>
                                        ))}
                                        {recipe.ageGroup?.map(tag => (
                                            <span key={tag} className="px-3 py-0.5 bg-surface-container-highest text-on-surface rounded-full text-xs font-semibold tracking-wider uppercase font-label">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>

                                    <h1 className="font-headline text-3xl md:text-5xl font-bold text-on-surface tracking-tight leading-tight mb-5">
                                        {recipe.name}
                                    </h1>

                                    {/* Time / Servings */}
                                    <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
                                        {recipe.prepTime != null && recipe.prepTime > 0 && (
                                            <div className="flex items-center gap-2">
                                                <span className="material-symbols-outlined text-primary text-lg">schedule</span>
                                                <div>
                                                    <p className="text-[9px] uppercase tracking-widest text-outline font-semibold font-label">Prep</p>
                                                    <p className="font-headline font-bold text-base leading-tight">{recipe.prepTime} <span className="text-xs font-normal">min</span></p>
                                                </div>
                                            </div>
                                        )}
                                        {recipe.cookTime != null && recipe.cookTime > 0 && (
                                            <div className="flex items-center gap-2">
                                                <span className="material-symbols-outlined text-primary text-lg">cooking</span>
                                                <div>
                                                    <p className="text-[9px] uppercase tracking-widest text-outline font-semibold font-label">Cook</p>
                                                    <p className="font-headline font-bold text-base leading-tight">{recipe.cookTime} <span className="text-xs font-normal">min</span></p>
                                                </div>
                                            </div>
                                        )}
                                        {recipe.servings != null && recipe.servings > 0 && (
                                            <div className="flex items-center gap-2">
                                                <span className="material-symbols-outlined text-primary text-lg">restaurant</span>
                                                <div>
                                                    <p className="text-[9px] uppercase tracking-widest text-outline font-semibold font-label">Servings</p>
                                                    <p className="font-headline font-bold text-base leading-tight">{recipe.servings} <span className="text-xs font-normal">people</span></p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </header>

                            {/* Body */}
                            <div className="px-6 md:px-10 py-10 grid grid-cols-1 md:grid-cols-12 gap-10">

                                {/* Ingredients */}
                                {recipe.ingredients && recipe.ingredients.length > 0 && (
                                    <div className="md:col-span-4">
                                        <div className="flex items-center justify-between mb-6">
                                            <h2 className="font-headline text-2xl font-bold">Ingredients</h2>
                                            <span className="font-label text-xs uppercase tracking-widest text-primary font-bold">
                                                {recipe.ingredients.length} Items
                                            </span>
                                        </div>
                                        <div className="space-y-1">
                                            {recipe.ingredients.map((ingredient, idx) => (
                                                <label key={idx} className="flex items-start gap-3 group cursor-pointer p-2.5 rounded-xl hover:bg-surface-container-low transition-all">
                                                    <input
                                                        type="checkbox"
                                                        checked={checkedIngredients.has(idx)}
                                                        onChange={() => toggleIngredient(idx)}
                                                        className="mt-0.5 rounded text-primary focus:ring-primary-container border-outline-variant/40 bg-surface-container-lowest"
                                                    />
                                                    <span className={`font-body text-sm transition-colors ${checkedIngredients.has(idx) ? 'line-through text-outline' : 'text-on-surface-variant group-hover:text-on-surface'}`}>
                                                        {ingredient.quantity > 0 ? `${ingredient.quantity} ` : ''}{ingredient.unit}{ingredient.unit ? ' ' : ''}{ingredient.name}
                                                    </span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Steps */}
                                {recipe.steps && recipe.steps.length > 0 && (
                                    <div className={recipe.ingredients && recipe.ingredients.length > 0 ? 'md:col-span-8' : 'md:col-span-12'}>
                                        <h2 className="font-headline text-2xl font-bold mb-8">Instructions</h2>
                                        <div className="space-y-10">
                                            {recipe.steps.map((step, idx) => (
                                                <div key={idx} className="relative pl-12 group">
                                                    <span className="absolute left-0 top-0 w-8 h-8 flex items-center justify-center bg-surface-container-high rounded-full font-headline font-bold text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors text-sm">
                                                        {idx + 1}
                                                    </span>
                                                    <p className="font-body text-base leading-relaxed text-on-surface-variant pt-1">{step}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </DialogPanel>
                </div>
            </div>
        </Dialog>
    )
}
