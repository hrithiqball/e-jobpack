/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.nu-heat.co.uk',
        port: '',
        pathname: '/wp-content/uploads/2020/10/Underfloor-heating-manifold.jpg',
      },
    ],
  },
  output: 'standalone',
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
};

export default nextConfig;
