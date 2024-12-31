"use client";

import React, {useEffect} from "react";
import {useRouter} from "next/navigation";
import {getSignedInUser} from "@/app/utils/firebaseUtils/User";
import {User} from "firebase/auth";
import RedirectPage from "@/app/components/baseComponents/RedirectPage";
import {redirectToLogin} from "@/app/utils/routerUtils/RouterUtils";

interface AuthenticatedPageProps {
    children: React.ReactNode;
}

export const AuthenticatedPage: React.FC<AuthenticatedPageProps> = ({children}) => {
    const user: User | null = getSignedInUser() // Get user state from AuthContext
    const router = useRouter();

    useEffect(() => {
        if (!user) {
            redirectToLogin(router);
        }
    }, [user, router]);

    if (!user) {
        return <RedirectPage/>;
    }

    return <>{children}</>;
};
