/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/sheet-music-copy',
  images: {
    unoptimized: true,
  },
  reactCompiler: true,
};

export default nextConfig;
