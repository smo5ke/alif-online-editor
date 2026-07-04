import type { NextConfig } from "next";

const isGithubActions = process.env.GITHUB_ACTIONS || false;
let assetPrefix = '';
let basePath = '';

// If we are deploying to GitHub Pages, we need to set the base path correctly
// because it runs at https://username.github.io/repo-name/
if (isGithubActions) {
  const repo = process.env.GITHUB_REPOSITORY?.replace(/.*?\//, '');
  if (repo) {
    assetPrefix = `/${repo}/`;
    basePath = `/${repo}`;
  }
}

const nextConfig: NextConfig = {
  // Required for GitHub Pages deployment
  output: 'export',
  assetPrefix: assetPrefix,
  basePath: basePath,
  
  // Disable image optimization since GitHub Pages doesn't support the Next.js image server
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
