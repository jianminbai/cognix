import type { NextConfig } from "next";

const isGitHubPages = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath: isGitHubPages ? "/cognix" : undefined,
  assetPrefix: isGitHubPages ? "/cognix/" : undefined,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
