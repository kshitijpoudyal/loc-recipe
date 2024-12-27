import React, {useEffect, useState} from "react";
import Image from "next/image";
import {Recipe} from "@/app/data/DataInterface";

export interface RecipeCardProps {
    recipe: Recipe;
    isPreview: boolean;
}

export default function RecipeCard({recipe, isPreview}: RecipeCardProps) {
    const [imageSize, setImageSize] = useState(400);

    useEffect(() => {
        if (isPreview) {
            setImageSize(100)
        } else {
            setImageSize(600)
        }
    }, [isPreview]);

    return (
        <div className="flex flex-col-reverse">
            <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-900">
                    {recipe.name}
                </h3>
            </div>
            {recipe.imageUrl && (
                <Image
                    alt={recipe.name}
                    src={recipe.imageUrl}
                    height={imageSize}
                    width={imageSize}
                    className="aspect-square w-full rounded-lg bg-gray-100 object-cover"
                />
            )}
        </div>
    )
}
