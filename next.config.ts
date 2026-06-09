import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Allow preview environment hostnames */
  allowedDevOrigins: ["*", "*.localhost", "*.trycloudflare.com", "*.gitpod.io", "*.csb.app"],

  /* Allowed hostnames for image optimization */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },

  /* Skip trailing slash redirects */
  skipTrailingSlashRedirect: true,
};

export default nextConfig;