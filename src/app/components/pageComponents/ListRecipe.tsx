import React, {useState} from "react";
import {deleteRecipeFromFirebase} from "@/app/utils/firebaseUtils/Recipe";
import {DEFAULT_RECIPE} from "@/app/data/ConstData";
import {Recipe} from "@/app/data/DataInterface";
import RecipeCard from "@/app/components/baseComponents/RecipeCard";
import RecipeDetailsTemplate from "@/app/components/RecipeDetailsTemplate";
import EditRecipeModal from "@/app/components/pageComponents/EditRecipe";
import {LoaderComponent} from "@/app/components/baseComponents/LoaderView";
import {useAuth} from "@/app/components/baseComponents/AuthProvider";
import {useRecipes} from "@/app/components/baseComponents/RecipeProvider";
import ConfirmDialog from "@/app/components/baseComponents/ConfirmDialog";

export default function ListRecipeComponent() {
    const {recipes, loading, invalidate} = useRecipes();
    const [selectedRecipe, setSelectedRecipe] = useState<Recipe>(DEFAULT_RECIPE);
    const [open, setOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
    const {user} = useAuth();

    const handleDelete = () => {
        setConfirmDeleteOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!selectedRecipe.recipeId) return;
        setConfirmDeleteOpen(false);
        await deleteRecipeFromFirebase(selectedRecipe.recipeId, selectedRecipe.createdBy!, selectedRecipe.isPublic);
        invalidate();
        setOpen(false);
    };

    if (loading) {
        return (<LoaderComponent loading={loading}/>);
    }

    const isOwner = !!(user && selectedRecipe.createdBy === user.uid);

    return (
        <div>
            <ConfirmDialog
                isOpen={confirmDeleteOpen}
                title="Delete Recipe"
                message={`Are you sure you want to delete "${selectedRecipe.name}"? This cannot be undone.`}
                confirmLabel="Delete"
                onConfirm={handleConfirmDelete}
                onCancel={() => setConfirmDeleteOpen(false)}
                variant="danger"
            />
            {editOpen && (
                <EditRecipeModal
                    isOpen={editOpen}
                    recipe={selectedRecipe}
                    setIsOpenAction={setEditOpen}
                />
            )}
            {open && (
                <RecipeDetailsTemplate
                    isOpen={open}
                    recipe={selectedRecipe}
                    setIsOpenAction={setOpen}
                    onDelete={isOwner ? handleDelete : undefined}
                    onEdit={isOwner ? () => { setOpen(false); setEditOpen(true); } : undefined}
                />
            )}

            <div className="mx-auto max-w-2xl px-4 py-24 sm:px-6 sm:py-32 lg:max-w-7xl lg:px-8">
                <div
                    className="mt-11 grid grid-cols-1 items-start gap-x-6 gap-y-16 sm:mt-16 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-8">
                    {recipes.map((recipe) => (
                        <div key={recipe.recipeId} className="flex flex-col-reverse" onClick={() => {
                            setOpen(!open)
                            setSelectedRecipe(recipe)
                        }}>
                            <RecipeCard recipe={recipe} isPreview={false}/>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
