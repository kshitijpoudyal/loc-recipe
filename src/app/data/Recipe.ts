import {addDoc, collection, getDocs} from "firebase/firestore";
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
    createdAt: Date
}

export const fetchRecipes = async () => {
    const recipesCollection = collection(db, 'recipe');
    const recipeSnapshot = await getDocs(recipesCollection);
    return recipeSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    })) as Recipe[];
};

export const addRecipe = async (recipe: Recipe) => {
    await addDoc(collection(db, 'recipe'), {
        id: recipe.id,
        name: recipe.name,
        prepTime: recipe.prepTime,
        cookTime: recipe.cookTime,
        servings: recipe.servings,
        mealType: recipe.mealType,
        ingredients: recipe.ingredients,
        steps: recipe.steps,
        ageGroup: recipe.ageGroup,
        nutrition: recipe.nutrition,
        createdAt: new Date()
    });
}