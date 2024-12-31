"use client";

import React, {useState} from "react";
import {addMockRecipesToFirebase} from "@/app/data/mockData/RecipeMockData";
import {addMockScheduleToFirestore} from "@/app/data/mockData/DailyScheduleMockData";
import NavigationMenu from "@/app/components/NavigationMenu";
import {getMainBodyCss} from "@/app/utils/CssUtils";
import HeroTitle from "@/app/components/baseComponents/HeroTitle";
import {AuthenticatedPage} from "@/app/components/baseComponents/AuthenticatedPage";

export default function AddMockDataForm() {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    const handleAction = async (action: () => Promise<void>, successMessage: string) => {
        setLoading(true);
        setMessage(null);
        try {
            await action();
            setMessage(successMessage);
        } catch (error) {
            console.error("Error:", error);
            setMessage("An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthenticatedPage>
            <NavigationMenu></NavigationMenu>
            <main className={getMainBodyCss()}>
                <HeroTitle title={"Mock Data"}/>
                <div className="space-y-6">
                    <button
                        type="button"
                        onClick={() => handleAction(addMockRecipesToFirebase, "Mock Recipes added successfully!")}
                        className="w-full py-3 mt-6 bg-indigo-600 text-white font-semibold rounded-md shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        disabled={loading}
                    >
                        {loading ? "Adding Mock Recipes..." : "Add Mock Recipe"}
                    </button>

                    <button
                        type="button"
                        onClick={() => handleAction(addMockScheduleToFirestore, "Mock Weekly Schedule added successfully!")}
                        className="w-full py-3 mt-6 bg-indigo-600 text-white font-semibold rounded-md shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        disabled={loading}
                    >
                        {loading ? "Adding Mock Schedule..." : "Add Mock Weekly Schedule"}
                    </button>

                    {message && <p className="text-center text-green-600 font-medium mt-4">{message}</p>}
                </div>
            </main>
        </AuthenticatedPage>
    );
}
