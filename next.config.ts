import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // `postgres` is server-only; load it from node_modules instead of bundling it.
  serverExternalPackages: ['postgres'],
};

export default nextConfig;
