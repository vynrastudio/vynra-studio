/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    // Serve AVIF/WebP variants from the optimizer where supported.
    formats: ["image/avif", "image/webp"],
    // 75 = default for most images; 95 = near-lossless founder portrait.
    qualities: [75, 95],
  },
};

export default nextConfig;
