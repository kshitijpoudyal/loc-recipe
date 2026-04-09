"use client";

import React, {createContext, useContext, useEffect, useState} from "react";
import {onAuthStateChanged, User} from "firebase/auth";
import {auth} from "@/app/config/firebase";
import {redirectToLogin} from "@/app/utils/routerUtils/RouterUtils";
import {useRouter} from "next/navigation";

interface AuthProviderProps {
    children: React.ReactNode;
    shouldRedirectToLogin: boolean;
}

interface AuthContextType {
    user: User | null;
    authLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    authLoading: true,
});

export const AuthProvider: React.FC<AuthProviderProps> = ({children, shouldRedirectToLogin}) => {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [authLoading, setAuthLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (authUser) => {
            setUser(authUser);
            setAuthLoading(false);
            if (!authUser && shouldRedirectToLogin) {
                redirectToLogin(router);
            }
        });
        return () => unsubscribe();
    }, [router, shouldRedirectToLogin]);

    return (
        <AuthContext.Provider value={{user, authLoading}}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);