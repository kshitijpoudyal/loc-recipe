"use client";
import React from 'react';
import NavigationMenu from "@/app/components/NavigationMenu";
import {LoginComponent} from "@/app/components/Login";

export default function LoginPage() {
    return (
        <>
            <div>
                <NavigationMenu></NavigationMenu>
                <main className="mx-auto p-6">
                    <LoginComponent/>
                </main>
            </div>
        </>
    );
}
