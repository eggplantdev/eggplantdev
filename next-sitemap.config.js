/** @type {import("next-sitemap").IConfig} */

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

module.exports = {
  siteUrl,
  generateRobotsTxt: true,
  // Dev-only routes that 404 in production (guarded by NODE_ENV); keep them out of the sitemap.
  exclude: ["/heros-test", "/sections-concepts-test", "/eggplant-palette", "/email-previews", "/icon"],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
      },
    ],
  },
};
