"use client";

import React from "react";
import NavigationMenu from "@/app/components/NavigationMenu";
import { getMainBodyCss } from "@/app/utils/CssUtils";
import HeroTitle from "@/app/components/baseComponents/HeroTitle";
import ListRecipeComponent from "@/app/components/pageComponents/ListRecipe";

export default function Home() {
    return (
        <div>
            <NavigationMenu />
            <main className={getMainBodyCss()}>
                <HeroTitle title="All Recipe" />
                <ListRecipeComponent />
            </main>
        </div>
    );
}
