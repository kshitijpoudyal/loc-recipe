import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    devIndicators: {
        appIsrStatus: false,
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'picsum.photos',
                port: '', // Leave empty for default ports
                pathname: '/**', // Match all paths under this domain
            },
            {
                protocol: 'https',
                hostname: 'firebasestorage.googleapis.com',
                port: '', // Leave empty for default ports
                pathname: '/**', // Match all paths under this domain
            },
        ],
    },
};

export default nextConfig;
