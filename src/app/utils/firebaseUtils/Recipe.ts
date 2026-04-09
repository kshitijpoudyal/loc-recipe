import {addDoc, collection, deleteDoc, doc, getDocs, setDoc, updateDoc} from "firebase/firestore";
import {db, globalUserId, storage, userRecipeCol} from "@/app/config/firebase";
import {getDownloadURL, ref, uploadBytes} from "@firebase/storage";
import {Recipe} from "@/app/data/DataInterface";

const fetchFromUser = async (userId: string): Promise<Recipe[]> => {
    const snapshot = await getDocs(collection(db, userRecipeCol(userId)));
    return snapshot.docs.map(d => ({recipeId: d.id, ...d.data()})) as Recipe[];
};

export const fetchAllRecipes = async (userId?: string): Promise<Recipe[]> => {
    const globalRecipes = await fetchFromUser(globalUserId);
    if (!userId || userId === globalUserId) return globalRecipes;
    const userRecipes = await fetchFromUser(userId);
    // Merge: user's own copy takes precedence over global (same recipeId)
    const map = new Map(globalRecipes.map(r => [r.recipeId!, r]));
    for (const r of userRecipes) map.set(r.recipeId!, r);
    return Array.from(map.values());
};

export const findRecipeById = (_recipes: Recipe[], recipeId: string): Recipe | undefined => {
    return _recipes.find((recipe) => recipe.recipeId === recipeId);
};

export const uploadImage = async (imageFile: File) => {
    const storageRef = ref(storage, `recipe/${imageFile.name}`);
    const snapshot = await uploadBytes(storageRef, imageFile);
    return await getDownloadURL(snapshot.ref);
};

export const addRecipeToFirebase = async (recipe: Recipe, userId: string) => {
    const data: Record<string, unknown> = {
        name: recipe.name,
        mealType: recipe.mealType,
        ingredients: recipe.ingredients,
        steps: recipe.steps,
        ageGroup: recipe.ageGroup,
        nutrition: recipe.nutrition,
        createdAt: new Date(),
        createdBy: userId,
        isPublic: false,
    };
    if (recipe.prepTime !== undefined) data.prepTime = recipe.prepTime;
    if (recipe.cookTime !== undefined) data.cookTime = recipe.cookTime;
    if (recipe.servings !== undefined) data.servings = recipe.servings;
    if (recipe.imageUrl !== undefined) data.imageUrl = recipe.imageUrl;
    if (recipe.createdByName !== undefined) data.createdByName = recipe.createdByName;
    await addDoc(collection(db, userRecipeCol(userId)), data);
};

const buildRecipeData = (recipe: Recipe): Record<string, unknown> => {
    const data: Record<string, unknown> = {
        name: recipe.name,
        mealType: recipe.mealType,
        ingredients: recipe.ingredients,
        steps: recipe.steps,
        ageGroup: recipe.ageGroup,
        nutrition: recipe.nutrition,
        isPublic: recipe.isPublic ?? false,
        createdBy: recipe.createdBy,
        createdByName: recipe.createdByName,
    };
    if (recipe.prepTime !== undefined) data.prepTime = recipe.prepTime;
    if (recipe.cookTime !== undefined) data.cookTime = recipe.cookTime;
    if (recipe.servings !== undefined) data.servings = recipe.servings;
    if (recipe.imageUrl !== undefined) data.imageUrl = recipe.imageUrl;
    return data;
};

export const updateRecipeInFirebase = async (recipeId: string, recipe: Recipe) => {
    const ownerId = recipe.createdBy;
    if (!ownerId) throw new Error("Recipe has no createdBy — cannot update");
    const data = buildRecipeData(recipe);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await updateDoc(doc(db, userRecipeCol(ownerId), recipeId), data as any);
    if (recipe.isPublic) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await setDoc(doc(db, userRecipeCol(globalUserId), recipeId), data as any);
    }
};

export const toggleRecipePublic = async (recipe: Recipe): Promise<void> => {
    const {recipeId, createdBy} = recipe;
    if (!recipeId || !createdBy) return;
    const newIsPublic = !recipe.isPublic;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await updateDoc(doc(db, userRecipeCol(createdBy), recipeId), {isPublic: newIsPublic} as any);
    if (newIsPublic) {
        const data = buildRecipeData({...recipe, isPublic: true});
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await setDoc(doc(db, userRecipeCol(globalUserId), recipeId), data as any);
    } else {
        await deleteDoc(doc(db, userRecipeCol(globalUserId), recipeId));
    }
};

export const deleteRecipeFromFirebase = async (recipeId: string, createdBy: string, isPublic?: boolean) => {
    await deleteDoc(doc(db, userRecipeCol(createdBy), recipeId));
    if (isPublic) {
        await deleteDoc(doc(db, userRecipeCol(globalUserId), recipeId));
    }
};
