"use client";
import React, {useEffect} from 'react';
import {LoginComponent} from "@/app/components/pageComponents/Login";
import {redirectToHome} from "@/app/utils/routerUtils/RouterUtils";
import {useRouter} from "next/navigation";
import {useAuth} from "@/app/components/baseComponents/AuthProvider";

export default function LoginPage() {
    const router = useRouter();
    const {user, authLoading} = useAuth();

    useEffect(() => {
        if (!authLoading && user) {
            redirectToHome(router);
        }
    }, [router, user, authLoading]);

    return (
        <div className="min-h-screen bg-surface flex items-center justify-center p-0 md:p-8">
            <LoginComponent/>
        </div>
    );
}
