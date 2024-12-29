import React from "react";

interface HeroTitleProps {
    title: string;
}

export default function HeroTitle({ title }: HeroTitleProps) {
    return (
        <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-balance text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
                {title}
            </h2>
        </div>
    );
}
