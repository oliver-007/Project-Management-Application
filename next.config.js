/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    esmExternals: "loose", // <-- add this
    serverComponentsExternalPackages: ["mongoose"], // <-- and this
  },
  images: {
    domains: ["lh3.googleusercontent.com", "res.cloudinary.com"],
  },
  // and the following to enable top-level await support for Webpack
  webpack: (config) => {
    config.experiments = {
      layers: true,
      topLevelAwait: true,
    };
    return config;
  },
};

module.exports = nextConfig;
