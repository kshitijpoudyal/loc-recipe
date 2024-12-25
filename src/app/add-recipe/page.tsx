import AddRecipe from "@/app/components/AddRecipe";
import NavigationMenu from "@/app/components/NavigationMenu";
import React from "react";

export default function AddRecipePage() {

    return (
        <>
            <div>
                <NavigationMenu></NavigationMenu>
                <main>
                    <AddRecipe/>
                </main>
            </div>
            )
        </>
    );
}
