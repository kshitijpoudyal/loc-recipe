"use client";
import React, {useEffect, useState} from 'react';
import NavigationMenu from "@/app/components/NavigationMenu";
import DailyScheduleComponent from "@/app/components/DailySchedule";


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
                    <main>
                        <DailyScheduleComponent/>
                    </main>
                </div>
            )
            }
        </>
    );
}
