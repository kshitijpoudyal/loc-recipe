import React from "react";

interface LoaderComponentProps {
    loading: boolean;
    message?: string;
}

export const LoaderComponent: React.FC<LoaderComponentProps> = ({loading, message}) => {
    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-green-600"></div>
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