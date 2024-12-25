"use client";
import React, {useEffect, useState} from 'react';
import NavigationMenu from "@/app/components/NavigationMenu";
import ListRecipeComponent from "@/app/components/ListRecipe";
import HeroTitle from "@/app/components/HeroTitle";

export default function ListRecipePage() {

    const [domLoaded, setDomLoaded] = useState(false);
    useEffect(() => {
        setDomLoaded(true);
    }, []);

    return (
        <>
            {domLoaded && (
                <div>
                    <NavigationMenu></NavigationMenu>
                    <main className="mx-auto p-6">
                        <HeroTitle title={"All Recipe"}/>
                        <ListRecipeComponent/>
                    </main>
                </div>
            )
            }
        </>
    );
}
