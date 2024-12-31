import React from "react";
import AddRecipe from "@/app/components/pageComponents/AddRecipe";
import NavigationMenu from "@/app/components/NavigationMenu";
import HeroTitle from "@/app/components/baseComponents/HeroTitle";
import {getMainBodyCss} from "@/app/utils/CssUtils";

export default function AddRecipePage() {
    return (
        <div>
            <NavigationMenu/>
            <main className={getMainBodyCss()}>
                <HeroTitle title="Add Recipe"/>
                <AddRecipe/>
            </main>
        </div>
    );
}
