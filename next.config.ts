import type { NextConfig } from "next";

/**
 * Next.js configuration.
 * Kept deliberately small: the app is a self-contained frontend with no backend,
 * no database and no environment variables.
 */
const nextConfig: NextConfig = {
  reactStrictMode: true,
};

export default nextConfig;
