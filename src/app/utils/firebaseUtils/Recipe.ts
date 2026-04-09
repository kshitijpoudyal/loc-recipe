import {addDoc, collection, deleteDoc, doc, getDocs} from "firebase/firestore";
import {db, recipeTable, storage} from "@/app/config/firebase";
import {getDownloadURL, ref, uploadBytes} from "@firebase/storage";
import {Recipe} from "@/app/data/DataInterface";

export const fetchAllRecipes = async () => {
    const recipesCollection = collection(db, recipeTable);
    const recipeSnapshot = await getDocs(recipesCollection);
    return recipeSnapshot.docs.map((doc) => ({
        recipeId: doc.id,
        ...doc.data(),
    })) as Recipe[];
};

export const findRecipeById = (_recipes: Recipe[], recipeId: string): Recipe | undefined => {
    return _recipes.find((recipe) => recipe.recipeId === recipeId);
};

export const uploadImage = async (imageFile: File) => {
    const storageRef = ref(storage, `${recipeTable}/${imageFile.name}`);
    const snapshot = await uploadBytes(storageRef, imageFile);
    return await getDownloadURL(snapshot.ref);
}

export const addRecipeToFirebase = async (recipe: Recipe) => {
    const data: Record<string, unknown> = {
        name: recipe.name,
        mealType: recipe.mealType,
        ingredients: recipe.ingredients,
        steps: recipe.steps,
        ageGroup: recipe.ageGroup,
        nutrition: recipe.nutrition,
        createdAt: new Date(),
    };
    if (recipe.prepTime !== undefined) data.prepTime = recipe.prepTime;
    if (recipe.cookTime !== undefined) data.cookTime = recipe.cookTime;
    if (recipe.servings !== undefined) data.servings = recipe.servings;
    if (recipe.imageUrl !== undefined) data.imageUrl = recipe.imageUrl;
    if (recipe.createdBy !== undefined) data.createdBy = recipe.createdBy;
    if (recipe.createdByName !== undefined) data.createdByName = recipe.createdByName;
    await addDoc(collection(db, recipeTable), data);
}

export const deleteRecipeFromFirebase = async (recipeId: string) => {
    await deleteDoc(doc(db, recipeTable, recipeId));
}