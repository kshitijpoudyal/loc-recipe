"use client";
import React from 'react';
import NavigationMenu from "@/app/components/NavigationMenu";
import DailyScheduleComponent from "@/app/components/pageComponents/DailySchedule";
import HeroTitle from "@/app/components/baseComponents/HeroTitle";
import {getMainBodyCss} from "@/app/utils/CssUtils";


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
