/**
 * Next.js Configuration
 * @type {import('next').NextConfig}
 * @see https://nextjs.org/docs/app/api-reference/next-config-js
 */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
};

export default nextConfig;
