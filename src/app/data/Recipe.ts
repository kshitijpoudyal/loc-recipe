import {addDoc, collection, doc, getDoc, getDocs} from "firebase/firestore";
import {db, RECIPE_TABLE_NAME} from "@/app/lib/firebase";
import {WeekDay} from "@/app/data/DailySchedule";

export type Ingredients = {
    name: string;
    quantity: number;
    unit: string
}

export interface Recipe {
    _id?: string; //server side id
    recipeId: number;
    name: string;
    prepTime?: number;
    cookTime?: number;
    servings?: number;
    mealType?: string[];
    ingredients?: Ingredients[];
    steps?: string[];
    ageGroup?: string[];
    nutrition?: {
        calories?: number;
        protein?: number; // in grams
        carbohydrates?: number; // in grams
        fats?: number; // in grams
        sugar?: number; // in grams
    };
    daysOfTheWeek?: WeekDay[],
    imageUrl?: string,
    createdAt?: Date,
}

export const defaultRecipe: Recipe = {
    recipeId: 1001,
    name: "test"
}

export const fetchAllRecipes = async () => {
    const recipesCollection = collection(db, RECIPE_TABLE_NAME);
    const recipeSnapshot = await getDocs(recipesCollection);
    return recipeSnapshot.docs.map((doc) => ({
        _id: doc.id,
        ...doc.data(),
    })) as Recipe[];
};

export const findRecipeById = (_recipes: Recipe[], recipeId: number): Recipe | undefined => {
    return _recipes.find((recipe) => recipe.recipeId === recipeId);
};

export const fetchRecipeById = async (id: string): Promise<Recipe | null> => {
    try {
        const recipeDocRef = doc(db, RECIPE_TABLE_NAME, id);
        const recipeSnapshot = await getDoc(recipeDocRef);

        if (recipeSnapshot.exists()) {
            return {
                _id: recipeSnapshot.id,
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
    await addDoc(collection(db, RECIPE_TABLE_NAME), {
        recipeId: recipe.recipeId,
        name: recipe.name,
        prepTime: recipe.prepTime,
        cookTime: recipe.cookTime,
        servings: recipe.servings,
        mealType: recipe.mealType,
        ingredients: recipe.ingredients,
        steps: recipe.steps,
        ageGroup: recipe.ageGroup,
        nutrition: recipe.nutrition,
        daysOfTheWeek: recipe.daysOfTheWeek,
        createdAt: new Date(),
        imageUrl: recipe.imageUrl
    });
}