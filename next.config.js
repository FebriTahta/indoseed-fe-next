/** @type {import('next').NextConfig} */
const path = require("path");

const isProd = process.env.NODE_ENV === "production";

const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },

  reactStrictMode: true,
  trailingSlash: true,

  basePath: isProd ? "" : undefined,
  assetPrefix: isProd ? "" : undefined,

  eslint: {
    ignoreDuringBuilds: true,
  },

  sassOptions: {
    includePaths: [path.join(__dirname, "public")],
  },

  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "http",
        hostname: "145.79.12.74",
        port: "9000",
        pathname: "/dev/**",
      },
    ],
  },
};

module.exports = nextConfig;