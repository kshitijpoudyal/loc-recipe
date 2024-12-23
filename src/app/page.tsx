"use client";
import AddRecipe from "@/app/pages/addRecipe/AddRecipe";
import React, {useEffect, useState} from "react";
import RecipeList from "@/app/pages/listRecipe/RecipeList";
// import saveWeeklyScheduleMock from "@/app/mockData/saveWeeklyScheduleMock";

export default function Home() {

    const [domLoaded, setDomLoaded] = useState(false);

    useEffect(() => {
        setDomLoaded(true);
    }, []);

    return (
        <>
            {domLoaded && (
                <div className="bg-white">
                    <main>
                        {/*<ViewWeeklySchedule></ViewWeeklySchedule>*/}
                        <AddRecipe></AddRecipe>
                        <RecipeList></RecipeList>
                    </main>
                </div>
            )
            }
        </>
    );
}

