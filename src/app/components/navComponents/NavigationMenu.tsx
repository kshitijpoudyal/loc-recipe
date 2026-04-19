"use client";

import { useRef, useState } from "react";
import { Dialog, DialogPanel } from "@headlessui/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/app/components/baseComponents/AuthProvider";
import { signOut } from "firebase/auth";
import { auth } from "@/app/config/firebase";
import UserIcon from "@/app/components/baseComponents/UserIcon";

export default function NavigationMenu() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [accountOpen, setAccountOpen] = useState(false);
    const { user } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const accountRef = useRef<HTMLDivElement>(null);

    const navLinks = [
        { href: "/", label: "Home", icon: "home" },
        { href: "/daily-schedule", label: "Meal Planner", icon: "calendar_today", authOnly: true },
        { href: "/add-recipe", label: "Add Recipe", icon: "add_circle", authOnly: true },
        { href: "/login", label: "Login", icon: "login", guestOnly: true },
    ].filter((item) => {
        if (item.authOnly) return !!user;
        if (item.guestOnly) return !user;
        return true;
    });

    const bottomNavLinks = [
        { href: "/", label: "Home", icon: "home", authOnly: false },
        { href: "/daily-schedule", label: "Planner", icon: "restaurant_menu", authOnly: true },
        { href: "/add-recipe", label: "Create", icon: "add_box", authOnly: true },
        { href: "/login", label: "Profile", icon: "account_circle", guestOnly: true },
    ].filter((item) => {
        if (item.authOnly) return !!user;
        if ((item as { guestOnly?: boolean }).guestOnly) return !user;
        return true;
    });

    const handleLogout = async () => {
        await signOut(auth);
        setAccountOpen(false);
        setMobileMenuOpen(false);
        router.push("/login");
    };

    const isActive = (href: string) =>
        href === "/" ? pathname === "/" : pathname.startsWith(href);

    return (
        <>
            {/* Top Header */}
            <header className="fixed top-0 w-full z-50 bg-surface/90 backdrop-blur-md flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-3">
                    {/* Hamburger — mobile only */}
                    <button
                        className="md:hidden text-primary hover:bg-surface-container-high transition-colors p-2 rounded-full active:scale-95"
                        onClick={() => setMobileMenuOpen(true)}
                        aria-label="Open menu"
                    >
                        <span className="material-symbols-outlined">menu</span>
                    </button>
                    <Link href="/" className="text-xl font-headline font-bold text-primary italic tracking-tight">
                        Lochu&apos;s Kitchen
                    </Link>
                </div>

                {/* Desktop nav links */}
                <div className="hidden md:flex items-center gap-6">
                    {navLinks.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`font-body font-medium transition-colors duration-200 ${
                                isActive(item.href)
                                    ? "text-primary"
                                    : "text-on-surface/60 hover:text-primary"
                            }`}
                        >
                            {item.label}
                        </Link>
                    ))}
                </div>

                {/* Right side: account (desktop only) */}
                <div className="hidden md:flex items-center gap-3">
                    <div className="relative" ref={accountRef}>
                        <button
                            onClick={() => setAccountOpen(o => !o)}
                            className="w-9 h-9 rounded-full overflow-hidden border-2 border-primary-container flex items-center justify-center"
                            aria-label="Account"
                        >
                            {user?.photoURL ? (
                                <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <UserIcon className="w-7 h-7 text-primary" />
                            )}
                        </button>

                        {accountOpen && user && (
                            <>
                                <div className="fixed inset-0 z-10" onClick={() => setAccountOpen(false)} />
                                <div className="absolute right-0 top-11 z-20 w-52 bg-surface-container-lowest rounded-2xl shadow-xl border border-outline-variant/20 overflow-hidden">
                                    <div className="px-4 py-3 border-b border-outline-variant/10">
                                        <p className="font-label text-xs text-outline uppercase tracking-widest mb-0.5">Signed in as</p>
                                        <p className="font-body text-sm text-on-surface font-medium truncate">
                                            {user.displayName || user.email}
                                        </p>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-2 px-4 py-3 text-sm font-label font-semibold text-error hover:bg-error/5 transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-base">logout</span>
                                        Sign out
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </header>

            {/* Mobile Drawer */}
            <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="md:hidden">
                {/* Backdrop */}
                <div className="fixed inset-0 z-50 bg-on-surface/40 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />

                <DialogPanel className="fixed top-0 left-0 z-[60] bg-surface rounded-r-3xl h-full w-[85%] max-w-80 shadow-2xl flex flex-col py-8 px-4 ease-in-out duration-300">
                    {/* Profile Section */}
                    <div className="flex flex-col items-start px-4 mb-8">
                        <div className="w-20 h-20 rounded-2xl overflow-hidden mb-4 shadow-lg border-2 border-primary-container">
                            {user?.photoURL ? (
                                <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full bg-primary-container flex items-center justify-center">
                                    <UserIcon className="w-12 h-12 text-primary" />
                                </div>
                            )}
                        </div>
                        <h2 className="text-2xl font-headline text-primary font-bold">
                            {user?.displayName || "Guest"}
                        </h2>
                        <div className="flex flex-col">
                            <span className="font-body uppercase tracking-[0.1em] text-xs text-secondary-container font-semibold">
                                Culinary Curator
                            </span>
                        </div>
                    </div>

                    {/* Nav Links */}
                    <nav className="flex-1 space-y-1">
                        {navLinks.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className={`mx-2 flex items-center gap-4 px-4 py-3.5 rounded-full transition-colors ${
                                    isActive(item.href)
                                        ? "bg-secondary-fixed text-on-secondary-fixed font-semibold"
                                        : "text-on-surface hover:bg-surface-container-low"
                                }`}
                            >
                                <span
                                    className="material-symbols-outlined"
                                    style={isActive(item.href) ? { fontVariationSettings: "'FILL' 1" } : undefined}
                                >
                                    {item.icon}
                                </span>
                                <span className="font-headline text-lg">{item.label}</span>
                            </Link>
                        ))}

                        {/* Sign out in drawer */}
                        {user && (
                            <button
                                onClick={handleLogout}
                                className="w-full mx-2 flex items-center gap-4 px-4 py-3.5 rounded-full text-error hover:bg-error/5 transition-colors"
                            >
                                <span className="material-symbols-outlined">logout</span>
                                <span className="font-headline text-lg">Sign out</span>
                            </button>
                        )}
                    </nav>

                    {/* Footer */}
                    <div className="px-4 py-4 mt-auto border-t border-outline-variant/20">
                        <p className="font-body text-[10px] uppercase tracking-[0.2em] text-on-surface-variant/60">
                            Lochu&apos;s Kitchen © 2024
                        </p>
                        <p className="font-body text-[10px] text-on-surface-variant/40 mt-1">
                            Powered by{' '}
                            <a href="https://www.kshitijstudio.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors font-semibold">
                                KshitijStudio
                            </a>
                        </p>
                    </div>
                </DialogPanel>
            </Dialog>

            {/* Bottom Navigation Bar (mobile only) */}
            <footer className="md:hidden fixed bottom-0 left-0 w-full flex justify-around items-center px-4 pt-3 pb-6 bg-surface/90 backdrop-blur-xl rounded-t-3xl shadow-[0_-4px_20px_rgba(24,29,20,0.06)] z-40">
                {bottomNavLinks.map((item) => {
                    const active = isActive(item.href);
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex flex-col items-center transition-all duration-200 ${
                                active
                                    ? "text-primary bg-surface-container-high rounded-xl px-3 py-1 scale-110"
                                    : "text-on-surface/50 hover:text-on-surface/80"
                            }`}
                        >
                            <span
                                className="material-symbols-outlined"
                                style={active ? { fontVariationSettings: "'FILL' 1" } : undefined}
                            >
                                {item.icon}
                            </span>
                            <span className="font-body font-medium text-[10px] uppercase tracking-wider">{item.label}</span>
                        </Link>
                    );
                })}

            </footer>
        </>
    );
}
