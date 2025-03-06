/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.sitebuilderz.com',
      },
    ],
  },
  pwa: {
    dest: 'public',
    register: true,
    skipWaiting: true,
  }
};

export default nextConfig;