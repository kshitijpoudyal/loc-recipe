import {addDoc, collection, doc, getDoc, getDocs} from "firebase/firestore";
import {db, RECIPE_TABLE_NAME, storage} from "@/app/data/firebaseController/firebase";
import {getDownloadURL, ref, uploadBytes} from "@firebase/storage";
import {Recipe} from "@/app/data/DataInterface";

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

// @typescript-eslint/no-unused-vars
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

export const uploadImage = async (imageFile: File) => {
    const storageRef = ref(storage, `${RECIPE_TABLE_NAME}/${imageFile.name}`);
    const snapshot = await uploadBytes(storageRef, imageFile);
    return await getDownloadURL(snapshot.ref);
}

export const addRecipeToFirebase = async (recipe: Recipe) => {
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