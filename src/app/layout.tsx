import type {Metadata, Viewport} from "next";
import {Noto_Serif, Work_Sans} from "next/font/google";

import "./globals.css";
import React from "react";
import NavigationMenu from "@/app/components/navComponents/NavigationMenu";
import {AuthProvider} from "@/app/components/baseComponents/AuthProvider";
import {RecipeProvider} from "@/app/components/baseComponents/RecipeProvider";
import {PWAInstallProvider} from "@/app/components/baseComponents/PWAInstallProvider";

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

export const viewport: Viewport = {
    themeColor: "#3c692f",
    width: "device-width",
    initialScale: 1,
    minimumScale: 1,
};

export const metadata: Metadata = {
    title: "Lochu's Recipe",
    description: "Lochu's Cafe where Nature reside",
    manifest: "/manifest.json",
    appleWebApp: {
        capable: true,
        statusBarStyle: "default",
        title: "Lochu's Kitchen",
    },
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <head>
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"/>
            <link rel="apple-touch-icon" href="/lochu_s_cafe_icon.png"/>
        </head>
        <body
            className={`${notoSerif.variable} ${workSans.variable} bg-surface font-body text-on-surface antialiased`}
        >
        <PWAInstallProvider>
        <AuthProvider shouldRedirectToLogin={false}>
            <RecipeProvider>
                <NavigationMenu/>
                <main>{children}</main>
                <footer className="w-full py-4 text-center">
                    <p className="text-xs font-label text-on-surface/40">
                        Powered by{' '}
                        <a href="https://www.kshitijstudio.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors font-semibold">
                            KshitijStudio
                        </a>
                    </p>
                </footer>
            </RecipeProvider>
        </AuthProvider>
        </PWAInstallProvider>
        </body>
        </html>
    );
}
