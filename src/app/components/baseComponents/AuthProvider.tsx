"use client";

import React, {createContext, useContext, useEffect, useState} from "react";
import {onAuthStateChanged, User} from "firebase/auth";
import {auth} from "@/app/config/firebase";

interface AuthProviderProps {
    children: React.ReactNode;
}

interface AuthContextType {
    user: User | null;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
});

export const AuthProvider: React.FC<AuthProviderProps> = ({children}) => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (authUser) => {
            setUser(authUser);
        });
        return () => unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{user}}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);