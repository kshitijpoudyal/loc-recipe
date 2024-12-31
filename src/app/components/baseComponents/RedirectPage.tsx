"use client";
import React from 'react';
import NavigationMenu from "@/app/components/NavigationMenu";
import {getMainBodyCss} from "@/app/utils/CssUtils";
import {LoaderComponent} from "@/app/components/baseComponents/LoaderView";

export default function RedirectPage() {
    return (
        <div>
            <NavigationMenu></NavigationMenu>
            <main className={getMainBodyCss()}>
                <LoaderComponent loading={true}/>
            </main>
        </div>
    );
}
