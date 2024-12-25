import {addDoc, collection, doc, getDoc, getDocs} from "firebase/firestore";
import {db, recipeTableName} from "@/app/lib/firebase";
import {WeekDay} from "@/app/data/DailySchedule";

export type Ingredients = {
    name: string;
    quantity: number;
    unit: string
}

export interface Recipe {
    id: string;
    name: string;
    prepTime?: number;
    cookTime?: number;
    servings: number;
    mealType: string[];
    ingredients: Ingredients[] | undefined;
    steps: string[];
    ageGroup: string[];
    nutrition?: {
        calories?: number;
        protein?: number; // in grams
        carbohydrates?: number; // in grams
        fats?: number; // in grams
        sugar?: number; // in grams
    };
    daysOfTheWeek?: WeekDay[]
    createdAt: Date,
}

export const fetchRecipes = async () => {
    const recipesCollection = collection(db, recipeTableName);
    const recipeSnapshot = await getDocs(recipesCollection);
    return recipeSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    })) as Recipe[];
};

export const fetchRecipeById = async (id: string): Promise<Recipe | null> => {
    try {
        const recipeDocRef = doc(db, recipeTableName, id);
        const recipeSnapshot = await getDoc(recipeDocRef);

        if (recipeSnapshot.exists()) {
            return {
                id: recipeSnapshot.id,
                ...recipeSnapshot.data(),
            } as Recipe;
        } else {
            console.warn(`Recipe with ID ${id} does not exist.`);
            return null;
        }
    } catch (error) {
        console.error("Error fetching recipe by ID:", error);
        throw error;
    }
};

export const addRecipe = async (recipe: Recipe) => {
    await addDoc(collection(db, recipeTableName), {
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
        daysOfTheWeek: recipe.daysOfTheWeek?.map((day) => day.value),
        createdAt: new Date()
    });
}