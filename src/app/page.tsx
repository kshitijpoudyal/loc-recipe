"use client";
import React, {useEffect, useState} from "react";
import NavigationMenu from "@/app/components/NavigationMenu";
import HeroTitle from "@/app/components/HeroTitle";
// import AddMockDataForm from "@/app/pages/MockDataPage";

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
                        {/*<AddMockDataForm></AddMockDataForm>*/}
                    </main>
                </div>
            )}
        </>
    );
}

