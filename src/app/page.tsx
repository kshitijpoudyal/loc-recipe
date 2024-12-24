"use client";
import AddRecipe from "@/app/pages/addRecipe/AddRecipe";
import React, {useEffect, useState} from "react";
import RecipeList from "@/app/pages/listRecipe/RecipeList";
import DailySchedulePage from "@/app/pages/dailySchedule/DailyScheduleView";

export default function Home() {

    const [domLoaded, setDomLoaded] = useState(false);

    useEffect(() => {
        setDomLoaded(true);
    }, []);

    return (
        <>
            {domLoaded && (
                <div>
                    <main>
                        {/*<AddMockDataForm></AddMockDataForm>*/}
                        <AddRecipe></AddRecipe>
                        <RecipeList></RecipeList>
                        <DailySchedulePage></DailySchedulePage>
                    </main>
                </div>
            )
            }
        </>
    );
}

