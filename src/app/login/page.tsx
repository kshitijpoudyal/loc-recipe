"use client";
import React from 'react';
import NavigationMenu from "@/app/components/NavigationMenu";
import {LoginComponent} from "@/app/components/pageComponents/Login";
import {getMainBodyCss} from "@/app/utils/CssUtils";

export default function LoginPage() {
    return (
        <>
            <div>
                <NavigationMenu></NavigationMenu>
                <main className={getMainBodyCss()}>
                    <LoginComponent/>
                </main>
            </div>
        </>
    );
}
