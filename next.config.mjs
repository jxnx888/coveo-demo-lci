/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    COVEO_ORGANIZATION_ID: process.env.COVEO_ORGANIZATION_ID || '',
    COVEO_ACCESS_TOKEN: process.env.COVEO_ACCESS_TOKEN || '',
    COVEO_SEARCH_HUB: process.env.COVEO_SEARCH_HUB || '',
    COVEO_CONTEXT: process.env.COVEO_CONTEXT || '',
  }
};

export default nextConfig;
