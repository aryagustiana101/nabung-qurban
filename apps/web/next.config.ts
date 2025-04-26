import { env } from "~/env";

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  images: {
    unoptimized: env.DISABLE_IMAGE_OPTIMIZATION,
    remotePatterns: [{ hostname: "**.vultrobjects.com" }],
  },
};

export default nextConfig;
