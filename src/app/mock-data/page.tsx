"use client";

import React, {useState} from "react";
import {addMockRecipesToFirebase} from "@/app/data/mockData/RecipeMockData";
import {addMockScheduleToFirestore} from "@/app/data/mockData/DailyScheduleMockData";
import {
    classNames,
    getAccentTextColorName, getImportantButtonCss,
    getMainBodyCss,
    getTextColor
} from "@/app/utils/CssUtils";
import HeroTitle from "@/app/components/baseComponents/HeroTitle";
import {AuthenticationGate} from "@/app/components/baseComponents/AuthenticationGate";

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
        <AuthenticationGate>
            <HeroTitle title={"Mock Data"}/>
            <div className="flex flex-row space-x-10">
                <button
                    type="button"
                    onClick={() => handleAction(addMockRecipesToFirebase, "Mock Recipes added successfully!")}
                    className={classNames("w-full py-3 mt-6", getImportantButtonCss())}
                    disabled={loading}
                >
                    {loading ? "Adding Mock Recipes..." : "Add Mock Recipe"}
                </button>

                <button
                    type="button"
                    onClick={() => handleAction(addMockScheduleToFirestore, "Mock Weekly Schedule added successfully!")}
                    className={classNames("w-full py-3 mt-6", getImportantButtonCss())}
                    disabled={loading}
                >
                    {loading ? "Adding Mock Schedule..." : "Add Mock Weekly Schedule"}
                </button>

                {message &&
                    <p className={classNames("text-center font-medium mt-4", getTextColor(false, getAccentTextColorName()))}>{message}</p>}
            </div>
        </AuthenticationGate>
    );
}
