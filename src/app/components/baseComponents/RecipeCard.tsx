import React from "react";
import Image from "next/image";
import {Recipe} from "@/app/data/DataInterface";

export interface RecipeCardProps {
    recipe: Recipe;
    isPreview: boolean;
}

export default function RecipeCard({recipe, isPreview}: RecipeCardProps) {
    return (
        <div className="flex flex-col-reverse">
            <div className="mt-3">
                <h3 className="text-sm font-medium text-gray-900">
                    {recipe.name}
                </h3>
            </div>
            {recipe.imageUrl && (
                <div className={`relative aspect-square w-full rounded-lg bg-gray-100 overflow-hidden ${isPreview ? 'max-w-[100px]' : ''}`}>
                    <Image
                        alt={recipe.name}
                        src={recipe.imageUrl}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                        className="object-cover hover:drop-shadow-xl"
                    />
                </div>
            )}
        </div>
    )
}
