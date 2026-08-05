This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

# Build-time blog content

The blog is generated as static HTML. Before `next dev` or `next build`,
`scripts/sync-blog.ts` creates `app/generated/blog-data.json` from the CMS.

Configure the build environment with:

```bash
CMS_API_URL=https://cms.example.com/api/posts
CMS_API_TOKEN=optional-bearer-token
```

The endpoint may return an array, `{ docs: [] }`, `{ items: [] }`, or
`{ data: [] }`. Payload-style pagination using `hasNextPage` and `nextPage` is
supported. Only records with no status or with `status`/`_status` equal to
`published` are included.

Each record must contain `slug`, `title`, `description` (or `excerpt`),
`publishedAt` (or `date`), `category`, `tags`, and a `content` (or `blocks`)
array. Supported block types are `lead`, `heading`, `paragraph`, `list`,
`quote`, `code`, and `image`.

If `CMS_API_URL` is not set, the current articles in `app/data/blog.ts` are
used as local seed content. If a configured CMS request fails or returns
invalid content, the build fails so the previous Cloudflare Pages deployment
remains live.

# Live preview for the CMS

`/preview/` is a statically exported route that renders whatever the CMS editor
pushes into it over `postMessage`, using the real `ArticleHero`, `ArticleBody`,
and `ArticleAside`. It exists so the CMS does not have to keep a second copy of
the article renderer — the copy it does keep, for offline use, is held to this
one by a golden test.

```bash
# Origins allowed to drive it, comma separated. Empty disables the preview.
NEXT_PUBLIC_CMS_ORIGIN=http://localhost:8888,https://cms.example.com
```

The page ignores messages from any other origin, is `noindex, nofollow`, and is
excluded from the sitemap. It ships no post content of its own.

After changing `app/components/blog/ArticleBody.tsx`, regenerate the golden file
that the CMS asserts against:

```bash
npm run golden                  # writes golden/article-body.html, copies it to ../blog-cms
BLOG_CMS_DIR=… npm run golden   # if the CMS repo lives elsewhere
```

Reading time and the publish-date format live in `app/blog/derive.ts`, shared by
`scripts/sync-blog.ts` and the preview so both produce the same values.
