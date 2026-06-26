/** @type {import('next').NextConfig} */
const path = require('path');

const isProd = process.env.NODE_ENV === "production";

const nextConfig = {
  // output: "export", // Comment this line when not building the project
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: true,
  trailingSlash: true,
  // swcMinify: true,
  basePath: isProd ? "" : undefined,
  assetPrefix: isProd ? "" : undefined,

  images: {
    unoptimized: true, // You've defined `images` twice; keep only one
  },

  eslint: {
    ignoreDuringBuilds: true,
  },

  sassOptions: {
    includePaths: [path.join(__dirname, 'public')],
  },
};

module.exports = nextConfig;
