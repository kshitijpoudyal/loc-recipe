import React from "react";
import {addMockRecipesToFirebase} from "@/app/data/mockData/RecipeMockData";
import {addMockScheduleToFirestore} from "@/app/data/mockData/DailyScheduleMockData";

export default function AddMockDataForm() {
    const handleAddMockRecipe = async () => {
        try {
            await addMockRecipesToFirebase();
            alert("Mock Recipe added successfully!");
        } catch (error) {
            console.error("Error adding mock recipe: ", error);
        }
    };

    const handleAddMockWeeklySchedule = async () => {
        try {
            await addMockScheduleToFirestore();
            alert("Mock Weekly Schedule added successfully!");
        } catch (error) {
            console.error("Error adding mock weekly schedule: ", error);
        }
    };

    return (
        <div className="space-y-6">
            <button
                type="button"
                onClick={handleAddMockRecipe}
                className="w-full py-3 mt-6 bg-indigo-600 text-white font-semibold rounded-md shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
                Add Mock Recipe
            </button>

            <button
                type="button"
                onClick={handleAddMockWeeklySchedule}
                className="w-full py-3 mt-6 bg-indigo-600 text-white font-semibold rounded-md shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
                Add Mock WeeklySchedule
            </button>
        </div>
    );
}
