"use client";
import React, {useEffect} from 'react';
import {LoginComponent} from "@/app/components/pageComponents/Login";
import {getMainBodyCss} from "@/app/utils/CssUtils";
import {redirectToHome} from "@/app/utils/routerUtils/RouterUtils";
import {useRouter} from "next/navigation";
import {useAuth} from "@/app/components/baseComponents/AuthProvider";

export default function LoginPage() {
    const router = useRouter();
    const {user} = useAuth();

    useEffect(() => {
        if (user) {
            redirectToHome(router);
        }
    }, [router, user]);

    return (
        <section className={getMainBodyCss()}>
            <LoginComponent/>
        </section>
    );
}
