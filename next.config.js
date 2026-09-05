/** @type {import('next').NextConfig} */

const path = require("path");

const isProd = process.env.NODE_ENV === "production";

const nextConfig = {

  // ==========================================================
  // NEXT.JS STANDALONE
  // ==========================================================

  output: "standalone",


  // ==========================================================
  // TYPESCRIPT
  // ==========================================================

  typescript: {
    ignoreBuildErrors: true,
  },


  // ==========================================================
  // REACT
  // ==========================================================

  reactStrictMode: true,


  // ==========================================================
  // URL
  // ==========================================================

  trailingSlash: true,

  basePath: isProd ? "" : undefined,

  assetPrefix: isProd ? "" : undefined,


  // ==========================================================
  // ESLINT
  // ==========================================================

  eslint: {
    ignoreDuringBuilds: true,
  },


  // ==========================================================
  // SASS
  // ==========================================================

  sassOptions: {
    includePaths: [path.join(__dirname, "public")],
  },


  // ==========================================================
  // IMAGES
  // ==========================================================

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