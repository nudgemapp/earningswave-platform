/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "logo.clearbit.com",
      "static2.finnhub.io",
      "static.finnhub.io",
      "img.clerk.com",
    ],
  },
};

export default nextConfig;
