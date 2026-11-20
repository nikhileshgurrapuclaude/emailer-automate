/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      // Rewrite deal footer image requests to global brand assets
      {
        source: "/avendus/:folder/img/:asset*",
        destination: "/avendus/img/:asset*",
      },
      // Rewrite exact shareable HTML link to dynamic viewer
      {
        source: "/:brand/:folder/index.html",
        destination: "/api/view/:brand/:folder",
      },
      // Rewrite exact folder link to dynamic viewer
      {
        source: "/:brand/:folder",
        destination: "/api/view/:brand/:folder",
      },
    ];
  },
};

export default nextConfig;
