"use client";
import React from 'react';
import {getMainBodyCss} from "@/app/utils/CssUtils";
import {LoaderComponent} from "@/app/components/baseComponents/LoaderView";

export default function RedirectPage() {
    return (
        <div>
            <main className={getMainBodyCss()}>
                <LoaderComponent loading={true}/>
            </main>
        </div>
    );
}
