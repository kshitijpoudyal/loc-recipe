"use client";
import AddRecipe from "@/app/addRecipe";
import Recipes from "@/app/accordionRecipe";
// import saveWeeklyScheduleMock from "@/app/mockData/saveWeeklyScheduleMock";
// import ViewWeeklySchedule from "@/app/viewWeeklySchedule";
// import saveRecipesToFirebase from "@/app/mockData/saveMock";

export default function Home() {
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            // await saveRecipesToFirebase().then(() => {
            //     alert('Mock Recipe added successfully!');
            // })
            // await saveWeeklyScheduleMock().then(() => {
            //     alert('Mock schedule added successfully!');
            // })
        } catch (error) {
            console.error('Error adding recipe: ', error);
        }
    };
    return (
        <div className="bg-white">
            <main>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <button
                        type="submit"
                        className="w-full py-3 mt-6 bg-indigo-600 text-white font-semibold rounded-md shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        Add Mock Recipe
                    </button>
                </form>
                {/*<ViewWeeklySchedule></ViewWeeklySchedule>*/}
                <AddRecipe></AddRecipe>
                <Recipes></Recipes>
            </main>
        </div>
    )
        ;
}

