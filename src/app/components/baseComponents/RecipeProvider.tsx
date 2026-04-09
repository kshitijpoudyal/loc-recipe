"use client";

import React, {createContext, useCallback, useContext, useEffect, useState} from "react";
import {Recipe} from "@/app/data/DataInterface";
import {fetchAllRecipes} from "@/app/utils/firebaseUtils/Recipe";
import {useAuth} from "@/app/components/baseComponents/AuthProvider";

interface RecipeContextType {
    recipes: Recipe[];
    loading: boolean;
    invalidate: () => void;
}

const RecipeContext = createContext<RecipeContextType>({
    recipes: [],
    loading: true,
    invalidate: () => {},
});

export const RecipeProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
    const {user, authLoading} = useAuth();
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [loading, setLoading] = useState(true);

    const load = useCallback(async () => {
        setLoading(true);
        setRecipes(await fetchAllRecipes(user?.uid ?? undefined));
        setLoading(false);
    }, [user?.uid]);

    useEffect(() => {
        if (!authLoading) {
            load();
        }
    }, [load, authLoading]);

    return (
        <RecipeContext.Provider value={{recipes, loading, invalidate: load}}>
            {children}
        </RecipeContext.Provider>
    );
};

export const useRecipes = () => useContext(RecipeContext);
