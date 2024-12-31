'use client'
import React, {useState} from 'react';
import Image from "next/image";
import 'firebase/auth';
import {authenticateUser} from "@/app/utils/firebaseUtils/User";
import {
    classNames, getInputFieldCss, getLinkTextCss, getPrimaryButtonCss
} from "@/app/utils/CssUtils";
import {redirectToHome} from "@/app/utils/routerUtils/RouterUtils";
import {useRouter} from "next/navigation";

export const LoginComponent = () => {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await authenticateUser(email, password);
            redirectToHome(router);
        } catch (err) {
            setError(`Invalid credentials or error occurred. ${err}`,);
        }
    }
    return (
        <div className="mx-auto max-w-2xl px-4 py-24 sm:px-6 sm:py-32 lg:max-w-7xl lg:px-8 bg-">
            <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                <div className="sm:mx-auto w-12">
                    <Image
                        alt="Lochu's Cafe"
                        width={50}
                        height={50}
                        src="/lochu_s_cafe_icon.svg"
                        className="mx-auto w-auto"
                    />
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">
                                Email address
                            </label>
                            <div className="mt-2">
                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    autoComplete="email"
                                    required
                                    className={classNames("block w-full", getInputFieldCss())}
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">
                                    Password
                                </label>
                                <div className="text-sm">
                                    <a href="#"
                                       className={getLinkTextCss()}>
                                        Forgot password?
                                    </a>
                                </div>
                            </div>
                            <div className="mt-2">
                                <input
                                    id="password"
                                    type="password"
                                    name="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    autoComplete="current-password"
                                    className={classNames("block w-full", getInputFieldCss())}
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className={classNames("flex w-full justify-center", getPrimaryButtonCss())}
                            >
                                Sign in
                            </button>
                        </div>
                    </form>
                </div>
                {error && <p className="mt-10 text-center text-sm/6 text-gray-500">
                    error
                </p>}
            </div>
        </div>
    );
}
