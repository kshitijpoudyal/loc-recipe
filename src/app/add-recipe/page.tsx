import AddRecipe from "@/app/components/AddRecipe";
import NavigationMenu from "@/app/components/NavigationMenu";
import React from "react";
import HeroTitle from "@/app/components/HeroTitle";
import {getMainBodyCss} from "@/app/data/Util";

export default function AddRecipePage() {
    return (
        <div>
            <NavigationMenu></NavigationMenu>
            <main className={getMainBodyCss()}>
                <HeroTitle title={"Add Recipe"}/>
                <AddRecipe/>
            </main>
        </div>
    );
}
