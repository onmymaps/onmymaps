import type { NextConfig } from "next";

const nextConfig: NextConfig = {

  turbopack: {},

  webpack: (config) => {

    config.resolve.fallback = {
      fs: false,
      path: false,
      zlib: false,
      http: false,
      https: false,
      stream: false,
      crypto: false
    };

    return config;
  }

};

export default nextConfig;