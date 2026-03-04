import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  distDir: '/tmp/cb-front-next',
  turbopack: {
    root: '/Volumes/MiDRIVE/Chroma-Team/chromabase-frontend',
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
      },
      {
        protocol: 'https',
        hostname: 'ui-avatars.com',
      },
    ],
  },
};

export default nextConfig;
