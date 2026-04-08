"use client";

import { useState } from "react";
import { Dialog, DialogPanel } from "@headlessui/react";
import Link from "next/link";
import { useAuth } from "@/app/components/baseComponents/AuthProvider";

export default function NavigationMenu() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { user } = useAuth();

    const navLinks = [
        { href: "/", label: "Home" },
        { href: "/daily-schedule", label: "Planner", authOnly: true },
        { href: "/add-recipe", label: "Add", authOnly: true },
        { href: "/mock-data", label: "Mock Data", authOnly: true },
        { href: "/login", label: "Login", guestOnly: true },
        { href: "/logout", label: "Logout", authOnly: true },
    ].filter((item) => {
        if (item.authOnly) return !!user;
        if (item.guestOnly) return !user;
        return true;
    });

    return (
        <nav className="fixed top-0 w-full z-50 bg-surface/80 glass-nav">
            <div className="flex justify-between items-center px-8 py-4 max-w-full mx-auto">
                {/* Brand + desktop links */}
                <div className="flex items-center gap-8">
                    <Link href="/" className="text-2xl font-headline font-bold text-primary">
                        Lochu&apos;s Recipe
                    </Link>
                    <div className="hidden md:flex items-center gap-6">
                        {navLinks.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="text-on-surface/60 font-body font-medium hover:text-primary transition-colors duration-300"
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Right: search + account + mobile hamburger */}
                <div className="flex items-center gap-4">
                    <div className="hidden lg:flex items-center bg-surface-container-low px-4 py-2 rounded-full">
                        <span className="material-symbols-outlined text-outline" style={{ fontSize: "18px" }}>search</span>
                        <input
                            className="bg-transparent border-none focus:ring-0 text-sm font-label ml-2 w-64 placeholder:text-outline-variant outline-none"
                            placeholder="Search curated recipes..."
                            type="text"
                        />
                    </div>
                    <button className="text-primary" aria-label="Account">
                        <span className="material-symbols-outlined" style={{ fontSize: "28px" }}>account_circle</span>
                    </button>
                    <button
                        className="md:hidden text-on-surface"
                        onClick={() => setMobileMenuOpen(true)}
                        aria-label="Open menu"
                    >
                        <span className="material-symbols-outlined">menu</span>
                    </button>
                </div>
            </div>

            {/* Mobile drawer */}
            <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="md:hidden">
                <div className="fixed inset-0 z-10 bg-on-surface/20" />
                <DialogPanel className="fixed inset-y-0 right-0 z-20 w-full max-w-sm bg-surface-container-lowest px-6 py-6 overflow-y-auto">
                    <div className="flex items-center justify-between mb-8">
                        <span className="text-xl font-headline font-bold text-primary">Lochu&apos;s Recipe</span>
                        <button
                            onClick={() => setMobileMenuOpen(false)}
                            className="text-on-surface-variant"
                            aria-label="Close menu"
                        >
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>
                    <div className="flex flex-col gap-4">
                        {navLinks.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className="text-lg font-body font-medium text-on-surface hover:text-primary transition-colors py-2 border-b border-outline-variant/20"
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>
                </DialogPanel>
            </Dialog>
        </nav>
    );
}
