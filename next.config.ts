import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://web-production-190c.up.railway.app/api/:path*',
      },
    ];
  },
};

export default nextConfig;
