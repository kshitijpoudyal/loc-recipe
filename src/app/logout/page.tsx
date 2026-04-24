"use client";
import React, {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {logoutUser} from "@/app/utils/firebaseUtils/User";
import {redirectToHome} from "@/app/utils/routerUtils/RouterUtils";
import {getMainBodyCss} from "@/app/utils/CssUtils";
import {LoaderComponent} from "@/app/components/baseComponents/LoaderView";
import {Alert} from "@/app/components/Alerts";

export default function LogoutPage() {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const handleLogout = async () => {
            try {
                await logoutUser();
                redirectToHome(router);
            } catch (err) {
                setError(`An error occurred while logging out: ${err}`);
            }
        };
        handleLogout();
    }, [router]);

    return (
        <section className={getMainBodyCss()}>
            {error ? (
                <div className="p-6 max-w-md mx-auto">
                    <Alert message={error} type="error" onDismiss={() => redirectToHome(router)} />
                </div>
            ) : (
                <LoaderComponent loading={true} message={"Logging you out..."}/>
            )}
        </section>
    );
}
