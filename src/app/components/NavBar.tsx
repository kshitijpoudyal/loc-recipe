import React from "react";
import { Link } from "react-router-dom";

export default function NavBar() {
    return (
        <nav className="bg-indigo-600 text-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="text-2xl font-bold">Recipe App</div>

                    {/* Navigation Links */}
                    <div className="space-x-4">
                        <Link
                            to="/"
                            className="hover:bg-indigo-700 px-3 py-2 rounded-md text-sm font-medium"
                        >
                            Home
                        </Link>
                        <Link
                            to="/addRecipe"
                            className="hover:bg-indigo-700 px-3 py-2 rounded-md text-sm font-medium"
                        >
                            Add Recipe
                        </Link>
                        <Link
                            to="/listRecipe"
                            className="hover:bg-indigo-700 px-3 py-2 rounded-md text-sm font-medium"
                        >
                            List Recipes
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}
