import React from "react";
import AddRecipe from "@/app/components/pageComponents/AddRecipe";
import NavigationMenu from "@/app/components/NavigationMenu";
import HeroTitle from "@/app/components/baseComponents/HeroTitle";
import {getMainBodyCss} from "@/app/utils/CssUtils";
import {AuthenticatedPage} from "@/app/components/baseComponents/AuthenticatedPage";

export default function AddRecipePage() {
    return (
        <AuthenticatedPage>
            <NavigationMenu/>
            <main className={getMainBodyCss()}>
                <HeroTitle title="Add Recipe"/>
                <AddRecipe/>
            </main>
        </AuthenticatedPage>
    );
}
