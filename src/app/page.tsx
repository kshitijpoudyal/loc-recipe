"use client";
import React, {useEffect, useState} from "react";
import NavigationMenu from "@/app/components/NavigationMenu";
import {LoginComponent} from "@/app/components/Login";
import {getMainBodyCss} from "@/app/data/Util";

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
                    <main className={getMainBodyCss()}>
                        <LoginComponent/>
                    </main>
                </div>
            )}
        </>
    );
}

