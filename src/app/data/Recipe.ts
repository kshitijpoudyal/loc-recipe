import {collection, getDocs} from "firebase/firestore";
import {db} from "@/app/lib/firebase";

export interface Recipe {
    id: string;
    name: string;
    prepTime?: number;
    cookTime?: number;
    servings: number;
    mealType: string[];
    ingredients: { name: string; quantity: number; unit: string }[] | undefined;
    steps: string[];
    ageGroup: string[];
    nutrition?: {
        calories?: number;
        protein?: number; // in grams
        carbohydrates?: number; // in grams
        fats?: number; // in grams
        sugar?: number; // in grams
    };
}

export const fetchRecipes = async () => {
    const recipesCollection = collection(db, 'recipe');
    const recipeSnapshot = await getDocs(recipesCollection);
    return recipeSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    })) as Recipe[];
};