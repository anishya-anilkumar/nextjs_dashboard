import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // `postgres` and `bcryptjs` are server-only; keep them out of client bundles.
  serverExternalPackages: ['postgres'],
};

export default nextConfig;
