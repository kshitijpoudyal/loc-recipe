"use client";
import React, {useEffect} from "react";
import {useRouter} from "next/navigation";
import {logoutUser} from "@/app/utils/firebaseUtils/User";
import {redirectToHome} from "@/app/utils/routerUtils/RouterUtils";
import {getMainBodyCss} from "@/app/utils/CssUtils";
import {LoaderComponent} from "@/app/components/baseComponents/LoaderView";

export default function LogoutPage() {
    const router = useRouter();

    useEffect(() => {
        const handleLogout = async () => {
            try {
                await logoutUser()
            } catch (err) {
                alert(`An error occurred while logging out: ${err}`);
            }
        };
        handleLogout().then(() => {
            redirectToHome(router);
        })
    }, [router]);

    return (
        <section className={getMainBodyCss()}>
            <LoaderComponent loading={true} message={"Logging you out..."}/>
        </section>
    );
}
