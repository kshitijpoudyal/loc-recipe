"use client";
import React, {useEffect} from "react";
import {RegisterComponent} from "@/app/components/pageComponents/Register";
import {useAuth} from "@/app/components/baseComponents/AuthProvider";
import {useRouter} from "next/navigation";
import {redirectToHome} from "@/app/utils/routerUtils/RouterUtils";

export default function RegisterPage() {
    const router = useRouter();
    const {user} = useAuth();

    useEffect(() => {
        if (user) {
            redirectToHome(router);
        }
    }, [router, user]);

    return (
        <div className="min-h-screen bg-surface flex items-center justify-center p-0 md:p-8">
            <RegisterComponent/>
        </div>
    );
}
