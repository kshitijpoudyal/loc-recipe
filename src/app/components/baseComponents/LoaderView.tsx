import React from "react";
import {getSpinnerCss} from "@/app/utils/CssUtils";

interface LoaderComponentProps {
    loading: boolean;
    message?: string;
}

export const LoaderComponent: React.FC<LoaderComponentProps> = ({loading, message}) => {
    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <div className={getSpinnerCss()}></div>
                <div>
                    {message && (
                        <p className="text-sm font-medium text-gray-900 mt-4">{message}</p>
                    )}
                </div>
            </div>
        );
    }
    return <></>;
};