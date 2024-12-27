"use client";
import React from 'react';
import NavigationMenu from "@/app/components/NavigationMenu";
import {LoginComponent} from "@/app/components/Login";
import {getMainBodyCss} from "@/app/data/Util";

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
