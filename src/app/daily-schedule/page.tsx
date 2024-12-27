"use client";
import React from 'react';
import NavigationMenu from "@/app/components/NavigationMenu";
import DailyScheduleComponent from "@/app/components/DailySchedule";
import HeroTitle from "@/app/components/HeroTitle";


export default function DailySchedulePage() {
    return (
        <>
            <div>
                <NavigationMenu></NavigationMenu>
                <main className="mx-auto p-6">
                    <HeroTitle title={"Daily Schedule"}/>
                    <DailyScheduleComponent/>
                </main>
            </div>
        </>
    );
}
