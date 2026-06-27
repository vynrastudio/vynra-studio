/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    // Serve AVIF/WebP variants from the optimizer where supported.
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
