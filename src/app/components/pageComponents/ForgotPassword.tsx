"use client";
import React, { useState } from "react";
import Link from "next/link";
import { sendPasswordReset } from "@/app/utils/firebaseUtils/User";

const FOOD_IMAGE = "https://lh3.googleusercontent.com/aida-public/AB6AXuCS7sWIF0nfANvtJt-8lT3AM9mywADn4Hi9vY9pCdm42b_iLQr6WY_p1nehrLuTnmFsZPgEXzVp_ib4QBtZ33QlHRX-VEkLujb8P4LEaOqQhzdbNs8vqdjqbYWp_CfpvmUMub1uEYjWm9qU24Sn-Npw9KF_d4izA6Snvim3PVBTXcHmH-re8p5ntO-L1TlgQUNd_T94jrNZhRwRxObgkeVJDHN-bsfrjL0sehqJwVIA928C-rMlFwNb_ps74jMLNmlhEjardoBw9htb";

export const ForgotPasswordComponent = () => {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [sent, setSent] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            await sendPasswordReset(email);
            setSent(true);
        } catch (err: unknown) {
            const code = (err as { code?: string }).code;
            if (code === "auth/user-not-found") {
                setError("No account found with that email address.");
            } else if (code === "auth/invalid-email") {
                setError("Please enter a valid email address.");
            } else {
                setError("Something went wrong. Please try again.");
            }
            console.error(err);
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
                        &quot;A great chef never forgets their passion — only sometimes their password.&quot;
                    </p>
                    <div className="mt-8 flex items-center gap-3">
                        <div className="h-px w-12 bg-primary"/>
                        <span className="font-label text-sm text-primary uppercase font-medium">Est. 2024</span>
                    </div>
                </div>
            </section>

            {/* Right: Form */}
            <section className="w-full md:w-1/2 lg:w-2/5 bg-surface-container-lowest flex flex-col px-8 md:px-16 lg:px-24 py-12 relative min-h-screen md:min-h-0">
                <div className="flex-1 flex flex-col justify-center">

                    {/* Mobile brand */}
                    <div className="md:hidden mb-12 text-center">
                        <h1 className="font-headline text-3xl text-primary font-bold">Lochu&apos;s Recipe</h1>
                        <p className="font-label text-xs uppercase tracking-widest text-on-surface/60 mt-2">The Culinary Curator</p>
                    </div>

                    {!sent ? (
                        <>
                            <div className="mb-10">
                                <h2 className="font-headline text-3xl text-on-surface mb-2">Reset Password</h2>
                                <p className="text-on-surface/60 font-body">Enter your email and we&apos;ll send you a reset link.</p>
                            </div>

                            {error && (
                                <div className="mb-6 px-4 py-3 rounded-lg bg-error-container text-on-error-container text-sm font-label">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
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

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`w-full hero-gradient text-on-primary font-label font-semibold py-4 rounded-full shadow-lg shadow-primary/20 hover:opacity-90 active:scale-[0.98] transition-all text-lg ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
                                >
                                    {loading ? 'Sending...' : 'Send Reset Link'}
                                </button>
                            </form>
                        </>
                    ) : (
                        <div className="text-center">
                            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                                <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                                </svg>
                            </div>
                            <h2 className="font-headline text-3xl text-on-surface mb-3">Check your inbox</h2>
                            <p className="text-on-surface/60 font-body mb-2">
                                We sent a password reset link to
                            </p>
                            <p className="font-label font-semibold text-primary mb-8">{email}</p>
                            <p className="text-on-surface/50 font-body text-sm">
                                Didn&apos;t receive it? Check your spam folder or{' '}
                                <button
                                    onClick={() => { setSent(false); setError(""); }}
                                    className="text-primary font-semibold hover:underline"
                                >
                                    try again
                                </button>.
                            </p>
                        </div>
                    )}

                    <div className="mt-12 text-center">
                        <Link href="/login" className="text-on-surface/50 font-body text-sm hover:text-primary transition-colors">
                            ← Back to login
                        </Link>
                    </div>

                </div>
            </section>
        </div>
    );
};
