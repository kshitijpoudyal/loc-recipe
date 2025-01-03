import type {Metadata} from "next";
import {Geist, Geist_Mono} from "next/font/google";

import "./globals.css";
import React from "react";
import NavigationMenu from "@/app/components/navComponents/NavigationMenu";
import {AuthProvider} from "@/app/components/baseComponents/AuthProvider";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
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
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
        <AuthProvider shouldRedirectToLogin={false}>
            <NavigationMenu/>
            <main>{children}</main>
        </AuthProvider>
        </body>
        </html>
    );
}
