"use client";
import React, {useEffect, useState} from "react";
import NavigationMenu from "@/app/components/NavigationMenu";
import Example from "@/app/components/AddRecipeTemplate";

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
                        <Example></Example>
                    </main>
                </div>
            )
            }
        </>
    );
}

