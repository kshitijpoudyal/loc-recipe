"use client";
import React, {useEffect, useState} from "react";
import NavigationMenu from "@/app/components/NavigationMenu";
import Example from "@/app/components/ListRecipeTemplate";
import HeroTitle from "@/app/components/HeroTitle";

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
                    <main className="mx-auto p-6">
                        <HeroTitle title={"Home"}/>
                        <Example></Example>
                    </main>
                </div>
            )
            }
        </>
    );
}

