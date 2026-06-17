import type { NextConfig } from 'next';
// @ts-expect-error next-pwa does not have type definitions
import withPWAInit from 'next-pwa';

const withPWA = withPWAInit({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
});

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  typescript: {
    ignoreBuildErrors: true,
  },
  // @ts-expect-error turbopack config is required when custom webpack configs are present
  turbopack: {},
};

export default withPWA(nextConfig);
