"use client"

import React, {useEffect} from "react";
import AddRecipe from "@/app/components/pageComponents/AddRecipe";
import HeroTitle from "@/app/components/baseComponents/HeroTitle";
import {useAuth} from "@/app/components/baseComponents/AuthProvider";
import {useRouter} from "next/navigation";
import {redirectToLogin} from "@/app/utils/routerUtils/RouterUtils";
import {AuthenticationGate} from "@/app/components/AuthenticationGate";

export default function AddRecipePage() {
    const router = useRouter();
    const {user} = useAuth();

    useEffect(() => {
        if (!user) {
            redirectToLogin(router);
        }

    }, [router, user]);

    return (
        <AuthenticationGate>
            <div>
                <HeroTitle title="Add Recipe"/>
                <AddRecipe/>
            </div>
        </AuthenticationGate>
    );
}
