"use client";
import React, {useEffect, useState} from 'react';
import NavigationMenu from "@/app/components/NavigationMenu";
import DailyScheduleComponent from "@/app/components/DailySchedule";
import HeroTitle from "@/app/components/HeroTitle";


export default function DailySchedulePage() {
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
                        <HeroTitle title={"Daily Schedule"}/>
                        <DailyScheduleComponent/>
                    </main>
                </div>
            )}
        </>
    );
}
