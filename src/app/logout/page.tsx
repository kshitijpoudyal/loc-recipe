"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { logoutUser } from "@/app/utils/firebaseUtils/User";
import {redirectToHome} from "@/app/utils/routerUtils/RouterUtils";

export default function LogoutPage() {
    const router = useRouter();

    useEffect(() => {
        const handleLogout = async () => {
            try {
                await logoutUser();
                redirectToHome(router);
            } catch (err) {
                alert(`An error occurred while logging out: ${err}`);
            }
        };

        handleLogout();
    }, [router]);

    return (
        <div className="flex items-center justify-center h-screen">
            <p>Logging you out...</p>
        </div>
    );
}
