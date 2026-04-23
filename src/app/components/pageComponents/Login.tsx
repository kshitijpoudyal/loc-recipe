"use client";
import React, {useState} from "react";
import Link from "next/link";
import {authenticateUser, signInWithGoogle} from "@/app/utils/firebaseUtils/User";
import {redirectToHome} from "@/app/utils/routerUtils/RouterUtils";
import {useRouter} from "next/navigation";

const FOOD_IMAGE = "https://lh3.googleusercontent.com/aida-public/AB6AXuCS7sWIF0nfANvtJt-8lT3AM9mywADn4Hi9vY9pCdm42b_iLQr6WY_p1nehrLuTnmFsZPgEXzVp_ib4QBtZ33QlHRX-VEkLujb8P4LEaOqQhzdbNs8vqdjqbYWp_CfpvmUMub1uEYjWm9qU24Sn-Npw9KF_d4izA6Snvim3PVBTXcHmH-re8p5ntO-L1TlgQUNd_T94jrNZhRwRxObgkeVJDHN-bsfrjL0sehqJwVIA928C-rMlFwNb_ps74jMLNmlhEjardoBw9htb";

export const LoginComponent = () => {
    const router = useRouter();
    const [email, setEmail] = useState("kcp@gmail.com");
    const [password, setPassword] = useState("test123");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleGoogleLogin = async () => {
        setLoading(true);
        setError("");
        try {
            const credential = await signInWithGoogle();
            if (credential) redirectToHome(router);
            // on mobile, signInWithRedirect navigates away — no further action needed
        } catch (err: unknown) {
            setError("Google sign-in failed. Please try again.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            await authenticateUser(email, password).then((userCredential) => {
                if (userCredential.user) {
                    redirectToHome(router);
                }
            }).catch((err) => {
                setError("Invalid email or password. Please try again.");
                console.error(err.code, err.message);
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-[1440px] min-h-screen md:min-h-[800px] bg-surface-container-low md:rounded-xl overflow-hidden flex flex-col md:flex-row md:shadow-2xl md:shadow-on-surface/5">

            {/* Left: Visual Panel */}
            <section className="relative hidden md:flex md:w-1/2 lg:w-3/5 items-center justify-center overflow-hidden bg-surface-container-highest">
                <div className="absolute inset-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={FOOD_IMAGE}
                        alt="Gourmet dish"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-on-surface/40 to-transparent"/>
                </div>
                <div className="relative z-10 p-10 rounded-xl max-w-md mx-8 border border-white/20"
                    style={{background: 'rgba(246,252,236,0.8)', backdropFilter: 'blur(20px)'}}>
                    <span className="font-label text-xs uppercase tracking-widest text-primary font-semibold mb-4 block">
                        The Culinary Curator
                    </span>
                    <h1 className="font-headline text-4xl lg:text-5xl text-on-surface mb-6 leading-tight">
                        Lochu&apos;s Recipe
                    </h1>
                    <p className="font-headline text-xl italic text-on-surface/80 leading-relaxed">
                        &quot;Cooking is an art, but dining is an experience. Welcome back to your personal atelier.&quot;
                    </p>
                    <div className="mt-8 flex items-center gap-3">
                        <div className="h-px w-12 bg-primary"/>
                        <span className="font-label text-sm text-primary uppercase font-medium">Est. 2024</span>
                    </div>
                </div>
            </section>

            {/* Right: Login Form */}
            <section className="w-full md:w-1/2 lg:w-2/5 bg-surface-container-lowest flex flex-col px-8 md:px-16 lg:px-24 py-12 relative min-h-screen md:min-h-0">

                <div className="flex-1 flex flex-col justify-center">

                {/* Mobile brand */}
                <div className="md:hidden mb-12 text-center">
                    <h1 className="font-headline text-3xl text-primary font-bold">Lochu&apos;s Recipe</h1>
                    <p className="font-label text-xs uppercase tracking-widest text-on-surface/60 mt-2">The Culinary Curator</p>
                </div>

                <div className="mb-10">
                    <h2 className="font-headline text-3xl text-on-surface mb-2">Welcome Back</h2>
                    <p className="text-on-surface/60 font-body">Sign in to rediscover your curated collection.</p>
                </div>

                {error && (
                    <div className="mb-6 px-4 py-3 rounded-lg bg-error-container text-on-error-container text-sm font-label">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2">
                        <label htmlFor="email" className="font-label text-sm font-semibold uppercase tracking-wider text-on-surface/70 block">
                            Email Address
                        </label>
                        <input
                            id="email"
                            type="email"
                            required
                            autoComplete="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder="chef@lochurecipe.com"
                            className="w-full bg-surface-container-low border-none rounded-lg py-4 px-4 text-on-surface placeholder:text-on-surface/30 focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                        />
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <label htmlFor="password" className="font-label text-sm font-semibold uppercase tracking-wider text-on-surface/70 block">
                                Password
                            </label>
                            <a href="#" className="text-xs font-label font-semibold text-primary hover:text-primary-container transition-colors">
                                Forgot password?
                            </a>
                        </div>
                        <input
                            id="password"
                            type="password"
                            required
                            autoComplete="current-password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full bg-surface-container-low border-none rounded-lg py-4 px-4 text-on-surface placeholder:text-on-surface/30 focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                        />
                    </div>

                    <div className="flex items-center gap-3">
                        <input
                            id="remember"
                            type="checkbox"
                            className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary"
                        />
                        <label htmlFor="remember" className="text-sm font-body text-on-surface/70 select-none cursor-pointer">
                            Keep me logged in for 30 days
                        </label>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full hero-gradient text-on-primary font-label font-semibold py-4 rounded-full shadow-lg shadow-primary/20 hover:opacity-90 active:scale-[0.98] transition-all text-lg ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
                    >
                        {loading ? 'Signing in...' : 'Log In'}
                    </button>
                </form>

                <div className="my-10 flex items-center gap-4">
                    <div className="h-px flex-1 bg-outline-variant/30"/>
                    <span className="font-label text-xs uppercase tracking-widest text-on-surface/40">or continue with</span>
                    <div className="h-px flex-1 bg-outline-variant/30"/>
                </div>

                <button
                    type="button"
                    onClick={handleGoogleLogin}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-outline-variant/20 rounded-lg hover:bg-surface-container-low transition-colors font-body text-sm font-medium disabled:opacity-60"
                >
                    <svg viewBox="0 0 24 24" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    Continue with Google
                </button>

                <div className="mt-12 text-center">
                    <p className="text-on-surface/60 font-body text-sm">
                        Don&apos;t have an account?{' '}
                        <Link href="/register" className="text-primary font-semibold hover:underline ml-1">Begin your culinary journey</Link>
                    </p>
                </div>

                </div>
            </section>
        </div>
    );
};
