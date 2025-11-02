/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/sheet-music',
  assetPrefix: '/sheet-music',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;