"use client";
import React, {useEffect} from 'react';
import {onAuthStateChanged} from "firebase/auth";
import NavigationMenu from "@/app/components/NavigationMenu";
import {LoginComponent} from "@/app/components/pageComponents/Login";
import {getMainBodyCss} from "@/app/utils/CssUtils";
import {auth} from "@/app/config/firebase";
import {redirectToHome} from "@/app/utils/routerUtils/RouterUtils";
import {useRouter} from "next/navigation";

export default function LoginPage() {
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                redirectToHome(router);
            }
        });
        return () => unsubscribe();
    }, [router]);

    return (
        <div>
            <NavigationMenu></NavigationMenu>
            <main className={getMainBodyCss()}>
                <LoginComponent/>
            </main>
        </div>
    );
}
