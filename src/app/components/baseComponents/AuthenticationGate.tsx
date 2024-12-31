"use client"

import React, {useEffect} from "react";
import {getMainBodyCss} from "@/app/utils/CssUtils";
import {useAuth} from "@/app/components/baseComponents/AuthProvider";
import {useRouter} from "next/navigation";
import {redirectToLogin} from "@/app/utils/routerUtils/RouterUtils";
import {LoaderComponent} from "@/app/components/baseComponents/LoaderView";

interface AuthenticationGateProps {
    children: React.ReactNode;
}

export const AuthenticationGate: React.FC<AuthenticationGateProps> = ({children}) => {
    const router = useRouter();
    const {user} = useAuth();

    useEffect(() => {
        if (!user) {
            redirectToLogin(router);
        }

    }, [router, user]);

    return (
        <section className={getMainBodyCss()}>
            {(user) ? (
                <div>
                    {children}
                </div>
            ) : (
                <div>
                    <LoaderComponent loading={true} message={"Please Login! \nRedirecting you to Login Page..."}/>
                </div>
            )}
        </section>
    );
}
