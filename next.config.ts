import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [new URL('https://cryptologos.cc/**')],
  },
};

export default nextConfig;
