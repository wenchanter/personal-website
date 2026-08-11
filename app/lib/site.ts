/**
 * The site's canonical origin, used by `metadataBase`, the sitemap, and
 * robots.txt.
 *
 * It lives in one place because it is baked into every canonical URL and
 * `<loc>` entry — copies drifting apart is how a sitemap ends up advertising
 * a domain the site is not served from.
 */
export const SITE_URL = "https://harrisontech.nz";

export const SITE_NAME = "Harrison Wang";

export const SITE_DESCRIPTION =
  "Senior software engineer and software architect specialising in distributed systems, Domain-Driven Design, high-concurrency platforms, and scalable full-stack software.";

export const BLOG_DESCRIPTION =
  "Writing by Harrison Wang on distributed systems, software architecture, Domain-Driven Design, high-concurrency platforms, and engineering at scale.";

export const SITE_KEYWORDS = [
  "Harrison Wang",
  "senior software engineer",
  "software architect",
  "distributed systems",
  "Domain-Driven Design",
  "DDD",
  "high-concurrency systems",
  "scalable architecture",
  "Next.js",
  "React",
] as const;
