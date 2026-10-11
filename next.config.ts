import type { NextConfig } from "next";

// Only these hosts go through the image optimizer (see src/app/utils/imageUtils.ts).
const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {protocol: 'https', hostname: 'lh3.googleusercontent.com'},
        ],
    },
};

export default nextConfig;
