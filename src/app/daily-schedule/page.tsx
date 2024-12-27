"use client";
import React from 'react';
import NavigationMenu from "@/app/components/NavigationMenu";
import DailyScheduleComponent from "@/app/components/DailySchedule";
import HeroTitle from "@/app/components/HeroTitle";
import {getMainBodyCss} from "@/app/data/Util";


export default function DailySchedulePage() {
    return (
        <>
            <div>
                <NavigationMenu></NavigationMenu>
                <main className={getMainBodyCss()}>
                    <HeroTitle title={"Daily Schedule"}/>
                    <DailyScheduleComponent/>
                </main>
            </div>
        </>
    );
}
