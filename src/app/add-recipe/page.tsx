"use client";

import React, {useEffect} from "react";
import AddRecipeComponent from "@/app/components/pageComponents/AddRecipe";
import {useAuth} from "@/app/components/baseComponents/AuthProvider";
import {useRouter} from "next/navigation";
import {redirectToLogin} from "@/app/utils/routerUtils/RouterUtils";
import {LoaderComponent} from "@/app/components/baseComponents/LoaderView";

export default function AddRecipePage() {
    const router = useRouter();
    const {user, authLoading} = useAuth();

    useEffect(() => {
        if (!authLoading && !user) {
            redirectToLogin(router);
        }
    }, [router, user, authLoading]);

    if (authLoading || !user) {
        return <LoaderComponent loading={true} message="Please Login! Redirecting..."/>;
    }

    return (
        <section className="md:pt-24 min-h-screen bg-background">
            <AddRecipeComponent/>
        </section>
    );
}
