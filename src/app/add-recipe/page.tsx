import AddRecipe from "@/app/components/AddRecipe";
import NavigationMenu from "@/app/components/NavigationMenu";
import React from "react";
import HeroTitle from "@/app/components/HeroTitle";

export default function AddRecipePage() {

    return (
        <>
            <div>
                <NavigationMenu></NavigationMenu>
                <main className="mx-auto p-6">
                    <HeroTitle title={"Add Recipe"}/>
                    <AddRecipe/>
                </main>
            </div>
        </>
    );
}
