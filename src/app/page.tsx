"use client";
import React, {useEffect, useState} from "react";
import NavigationMenu from "@/app/components/NavigationMenu";
import {getMainBodyCss} from "@/app/data/Util";
import HeroTitle from "@/app/components/HeroTitle";
import ListRecipeComponent from "@/app/components/ListRecipe";

export default function Home() {

    const [domLoaded, setDomLoaded] = useState(false);
    useEffect(() => {
        setDomLoaded(true);
    }, []);

    return (
        <>
            {domLoaded && (
                <div>
                    <NavigationMenu></NavigationMenu>
                    <main className={getMainBodyCss()}>
                        <HeroTitle title={"All Recipe"}/>
                        <ListRecipeComponent></ListRecipeComponent>
                    </main>
                </div>
            )}
        </>
    );
}

