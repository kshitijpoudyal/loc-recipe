// Hosts the Next.js image optimizer is allowed to fetch from. Keep in sync with
// `images.remotePatterns` in next.config.ts. Images from any other host (e.g.
// photos linked by imported recipes) are rendered unoptimized, straight from
// their source, so the optimizer can't be used as an open proxy.
// Firebase Storage photos are deliberately not listed: the optimizer returned
// 502s fetching them, and Firebase already serves them from a CDN.
export const OPTIMIZED_IMAGE_HOSTS = [
    "lh3.googleusercontent.com",
];

export function isOptimizableImage(src?: string | null): boolean {
    if (!src) return false;
    if (src.startsWith("/")) return true;
    try {
        const {protocol, hostname} = new URL(src);
        return protocol === "https:" && OPTIMIZED_IMAGE_HOSTS.includes(hostname);
    } catch {
        return false;
    }
}
