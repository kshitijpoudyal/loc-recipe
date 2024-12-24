"use client";
import AddRecipe from "@/app/pages/AddRecipe";
import React, {useEffect, useState} from "react";
import RecipeList from "@/app/pages/RecipeList";
import DailySchedulePage from "@/app/pages/DailyScheduleView";
import NavigationMenu from "@/app/components/NavigationMenu";

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

