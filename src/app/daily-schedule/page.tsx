"use client";
import React from 'react';
import DailyScheduleComponent from "@/app/components/pageComponents/DailySchedule";
import HeroTitle from "@/app/components/baseComponents/HeroTitle";
import {getMainBodyCss} from "@/app/utils/CssUtils";


export default function DailySchedulePage() {
    return (
        <section className={getMainBodyCss()}>
            <HeroTitle title={"Daily Schedule"}/>
            <DailyScheduleComponent/>
        </section>
    );
}
