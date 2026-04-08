import type {Metadata} from "next";
import {Noto_Serif, Work_Sans} from "next/font/google";

import "./globals.css";
import React from "react";
import NavigationMenu from "@/app/components/navComponents/NavigationMenu";
import {AuthProvider} from "@/app/components/baseComponents/AuthProvider";
import {RecipeProvider} from "@/app/components/baseComponents/RecipeProvider";

const notoSerif = Noto_Serif({
    variable: "--font-noto-serif",
    subsets: ["latin"],
    weight: ["400", "700"],
    style: ["normal", "italic"],
});

const workSans = Work_Sans({
    variable: "--font-work-sans",
    subsets: ["latin"],
    weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
    title: "Lochu's Recipe",
    description: "Lochu's Cafe where Nature reside",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body
            className={`${notoSerif.variable} ${workSans.variable} bg-surface font-body text-on-surface antialiased`}
        >
        <AuthProvider shouldRedirectToLogin={false}>
            <RecipeProvider>
                <NavigationMenu/>
                <main>{children}</main>
            </RecipeProvider>
        </AuthProvider>
        </body>
        </html>
    );
}
