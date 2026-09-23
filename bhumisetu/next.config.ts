import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/SIH-Project',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
