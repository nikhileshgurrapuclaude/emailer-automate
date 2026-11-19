/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/avendus/:folder/img/:asset*',
        destination: '/avendus/img/:asset*',
      },
    ];
  },
};

export default nextConfig;
