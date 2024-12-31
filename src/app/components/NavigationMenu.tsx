"use client";

import { useState } from "react";
import { Dialog, DialogPanel, PopoverGroup } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import {useAuth} from "@/app/components/baseComponents/AuthProvider";

export default function NavigationMenu() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { user } = useAuth();

    const menuItems = [
        { href: "/", label: "Home" },
        { href: "/daily-schedule", label: "Daily Schedule" },
        { href: "/login", label: "Login", showWhen:!user },
        { href: "/add-recipe", label: "Add Recipe", showWhen: !!user },
        { href: "/logout", label: "Logout", showWhen: !!user },
    ];

    const renderMenuItems = (className: string) =>
        menuItems
            .filter((item) => item.showWhen === undefined || item.showWhen)
            .map((item) => (
                <Link
                    key={item.href}
                    href={item.href}
                    className={className}
                >
                    {item.label}
                </Link>
            ));

    return (
        <header className="bg-green-100">
            <nav
                aria-label="Global"
                className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8"
            >
                <div className="flex lg:hidden">
                    <button
                        type="button"
                        onClick={() => setMobileMenuOpen(true)}
                        className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
                        aria-label="Open main menu"
                    >
                        <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                    </button>
                </div>
                <PopoverGroup className="hidden lg:flex lg:gap-x-12">
                    {renderMenuItems("text-sm font-semibold text-gray-900")}
                </PopoverGroup>
            </nav>
            <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
                <div className="fixed inset-0 z-10 bg-black bg-opacity-25" />
                <DialogPanel
                    className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10"
                >
                    <div className="flex items-center justify-between">
                        <button
                            type="button"
                            onClick={() => setMobileMenuOpen(false)}
                            className="-m-2.5 rounded-md p-2.5 text-gray-700"
                            aria-label="Close menu"
                        >
                            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                        </button>
                    </div>
                    <div className="mt-6 flow-root">
                        <div className="-my-6 divide-y divide-gray-500/10">
                            <div className="space-y-2 py-6">
                                {renderMenuItems(
                                    "-mx-3 block rounded-lg px-3 py-2 text-base font-semibold text-gray-900 hover:bg-gray-50"
                                )}
                            </div>
                        </div>
                    </div>
                </DialogPanel>
            </Dialog>
        </header>
    );
}
