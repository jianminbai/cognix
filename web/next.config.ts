import type { NextConfig } from "next";

const isGitHubPages = process.env.GITHUB_PAGES === "true";
const hasCustomDomain = process.env.CUSTOM_DOMAIN === "true";
const pagesBasePath = isGitHubPages && !hasCustomDomain ? "/cognix" : "";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath: pagesBasePath || undefined,
  assetPrefix: pagesBasePath ? `${pagesBasePath}/` : undefined,
  env: {
    NEXT_PUBLIC_BASE_PATH: pagesBasePath,
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
