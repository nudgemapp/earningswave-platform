/** @type {import('next-sitemap').IConfig} */
const config = {
  siteUrl: process.env.SITE_URL || "https://earningswave.com",
  generateRobotsTxt: true,
  // Add any other options here
};

export default config;
