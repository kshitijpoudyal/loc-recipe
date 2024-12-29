"use client";
import React, {useEffect, useState} from "react";
import NavigationMenu from "@/app/components/NavigationMenu";
import {getMainBodyCss} from "@/app/utils/CssUtils";
import HeroTitle from "@/app/components/baseComponents/HeroTitle";
import ListRecipeComponent from "@/app/components/pageComponents/ListRecipe";

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

