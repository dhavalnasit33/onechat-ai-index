/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: "/ai-behavior-index",
  trailingSlash: true,
  async rewrites() {
    // Dynamically fallback to localhost during your npm run dev process
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    return [
      {
        source: "/chart-images/:path*",
        destination: `${baseUrl}/ai-behavior-index/api/chart-images/:path*`,
        basePath: false, // Allows Next.js to intercept requests at the absolute domain root
      },
    ];
  },
};

export default nextConfig;
