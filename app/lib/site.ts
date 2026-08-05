/**
 * The site's canonical origin, used by `metadataBase`, the sitemap, and
 * robots.txt.
 *
 * It lives in one place because it is baked into every canonical URL and
 * `<loc>` entry — three copies of it drifting apart is how a sitemap ends up
 * advertising a domain the site is not served from. Changing to a custom
 * domain later is this one line plus a rebuild.
 */
export const SITE_URL = "https://harrisontech.pages.dev";
