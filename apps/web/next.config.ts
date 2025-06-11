import { env } from "~/env";

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  images: {
    unoptimized: env.DISABLE_IMAGE_OPTIMIZATION,
    remotePatterns: [{ hostname: "**.vultrobjects.com" }],
  },
  rewrites: async () => {
    const url = new URL(env.AWS_ENDPOINT_URL);

    return [
      {
        source: "/static/:path*",
        destination: `${url.protocol}//${env.AWS_BUCKET}.${url.hostname}/static/:path*`,
      },
      {
        source: "/upload/:path*",
        destination: `${url.protocol}//${env.AWS_BUCKET}.${url.hostname}/upload/:path*`,
      },
    ];
  },
};

export default nextConfig;
