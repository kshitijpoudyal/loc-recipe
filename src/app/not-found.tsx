'use client'

import NavigationMenu from "@/app/components/NavigationMenu";

export default function NotFound() {

    return (
        <>
            <div className="flex min-h-full flex-col">
                <NavigationMenu/>
                <main
                    className="mx-auto flex w-full max-w-7xl flex-auto flex-col justify-center px-6 py-24 sm:py-64 lg:px-8">
                    <p className="text-base/8 font-semibold text-indigo-600">404</p>
                    <h1 className="mt-4 text-pretty text-5xl font-semibold tracking-tight text-gray-900 sm:text-6xl">
                        Page not found
                    </h1>
                    <p className="mt-6 text-pretty text-lg font-medium text-gray-500 sm:text-xl/8">
                        Sorry, we couldn’t find the page you’re looking for.
                    </p>
                    <div className="mt-10">
                        <a href="/" className="text-sm/7 font-semibold text-indigo-600">
                            <span aria-hidden="true">&larr;</span> Back to home
                        </a>
                    </div>
                </main>
            </div>
        </>
    )
}
