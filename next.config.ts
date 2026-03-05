import type { NextConfig } from "next";

const isVercel = process.env.VERCEL === '1';

const nextConfig: NextConfig = {
  distDir: isVercel ? '.next' : '/tmp/cb-front-next',
  ...(isVercel ? {} : {
    turbopack: {
      root: '/Volumes/MiDRIVE/Chroma-Team/chromabase-frontend',
    }
  }),
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
