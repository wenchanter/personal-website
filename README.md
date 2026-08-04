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
`quote`, and `code`.

If `CMS_API_URL` is not set, the current articles in `app/data/blog.ts` are
used as local seed content. If a configured CMS request fails or returns
invalid content, the build fails so the previous Cloudflare Pages deployment
remains live.
