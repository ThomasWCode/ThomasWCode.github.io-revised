export const lighthouseConfig = {
  urls: ["/", "/programming/", "/physics/", "/blog/", "/gallery/", "/contact/"],
  runs: 3,
  blockedUrlPatterns: [
    "https://api.github.com/**",
    "https://cdn-cookieyes.com/**",
    "https://formspree.io/**",
    "https://www.google.com/recaptcha/**",
    "https://www.googletagmanager.com/**",
  ],
  thresholds: {
    performance: 0.85,
    accessibility: 0.95,
    "best-practices": 0.9,
    seo: 0.95,
  },
};
