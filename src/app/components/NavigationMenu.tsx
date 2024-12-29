'use client'

import {useState} from 'react'
import {
    Dialog,
    DialogPanel,
    PopoverGroup,
} from '@headlessui/react'
import {
    Bars3Icon,
    XMarkIcon,
} from '@heroicons/react/24/outline'
import Link from "next/link";

export default function NavigationMenu() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    return (
        <header className="items-center bg-green-100">
            <nav aria-label="Global" className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8">
                <div className="flex lg:hidden">
                    <button
                        type="button"
                        onClick={() => setMobileMenuOpen(true)}
                        className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
                    >
                        <span className="sr-only">Open main menu</span>
                        <Bars3Icon aria-hidden="true" className="size-6"/>
                    </button>
                </div>
                <PopoverGroup className="hidden lg:flex lg:gap-x-12 items-center">
                    <Link href="/" className="text-sm/6 font-semibold text-gray-900">
                        Home
                    </Link>
                    <Link href="/add-recipe" className="text-sm/6 font-semibold text-gray-900">
                        Add Recipe
                    </Link>
                    {/*<Link href="/list-recipe" className="text-sm/6 font-semibold text-gray-900">*/}
                    {/*    List Recipe*/}
                    {/*</Link>*/}
                    <Link href="/daily-schedule" className="text-sm/6 font-semibold text-gray-900">
                        Daily Schedule
                    </Link>
                    <Link href="/login" className="text-sm/6 font-semibold text-gray-900">
                        Login
                    </Link>
                </PopoverGroup>
            </nav>
            <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
                <div className="fixed inset-0 z-10"/>
                <DialogPanel
                    className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
                    <div className="flex items-center justify-between">
                        <button
                            type="button"
                            onClick={() => setMobileMenuOpen(false)}
                            className="-m-2.5 rounded-md p-2.5 text-gray-700"
                        >
                            <span className="sr-only">Close menu</span>
                            <XMarkIcon aria-hidden="true" className="size-6"/>
                        </button>
                    </div>
                    <div className="mt-6 flow-root">
                        <div className="-my-6 divide-y divide-gray-500/10">
                            <div className="space-y-2 py-6">
                                <Link
                                    href="/"
                                    className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                                >
                                    Home
                                </Link>
                                <Link
                                    href="/add-recipe"
                                    className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                                >
                                    Add Recipe
                                </Link>
                                {/*<Link*/}
                                {/*    href="/list-recipe"*/}
                                {/*    className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"*/}
                                {/*>*/}
                                {/*    List Recipe*/}
                                {/*</Link>*/}
                                <Link
                                    href="/daily-schedule"
                                    className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                                >
                                    Daily Schedule
                                </Link>
                                <Link
                                    href="/login"
                                    className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                                >
                                    Login
                                </Link>
                            </div>
                        </div>
                    </div>
                </DialogPanel>
            </Dialog>
        </header>
    )
}
