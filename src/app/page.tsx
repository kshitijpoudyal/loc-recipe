"use client";
import AddRecipe from "@/app/pages/addRecipe/AddRecipe";
import React from "react";
import RecipeList from "@/app/pages/listRecipe/RecipeList";
// import saveWeeklyScheduleMock from "@/app/mockData/saveWeeklyScheduleMock";

export default function Home() {
    return (
        <div className="bg-white">
            <main>
                {/*<ViewWeeklySchedule></ViewWeeklySchedule>*/}
                <AddRecipe></AddRecipe>
                <RecipeList></RecipeList>
            </main>
        </div>
    );
}

