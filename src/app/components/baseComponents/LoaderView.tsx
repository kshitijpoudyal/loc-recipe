import React from "react";

interface LoaderComponentProps {
    loading: boolean;
}

export const LoaderComponent: React.FC<LoaderComponentProps> = ({loading}) => {
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-green-600"></div>
            </div>
        );
    }
    return <></>;
};