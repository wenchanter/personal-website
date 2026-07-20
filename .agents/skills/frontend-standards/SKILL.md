---
name: "frontend-standards"
description: "Enforces this project's Next.js coding standards and GSAP scroll-animation rule. Invoke when creating, editing, or reviewing frontend code in this workspace."
---

# Frontend Standards

Use this skill for any frontend work in this project, especially when creating pages, layouts, components, styles, or animations.

## Core Rules

- Follow Next.js coding standards and the project's existing structure.
- Treat this project as App Router based unless the codebase clearly shows otherwise.
- Prefer Server Components by default. Only use Client Components when interactivity, browser APIs, refs, or animation libraries require it.
- Use TypeScript patterns that match the existing codebase.
- Keep components small, readable, and composable.
- Organize components by responsibility or feature folder, not as a flat list in `src/components/`. For example, place layout chrome in `src/components/layout/` and keep related files together.
- Reuse shared layout structure and shared UI where appropriate instead of duplicating markup.
- Prefer semantic HTML and accessible markup.

## Next.js Standards

- Read the relevant guide in `node_modules/next/dist/docs/` before making framework-specific changes because this project may use newer or breaking Next.js behavior.
- Use `app/layout.*`, `app/page.*`, nested layouts, and route conventions correctly.
- Keep shared chrome such as header, footer, and global wrappers in layouts rather than duplicating them in pages.
- Use the Metadata API for page metadata instead of manually adding head tags.
- Use `next/link` for internal navigation when navigation components are introduced.
- Use `next/image` when rendering project images that benefit from Next.js image handling.
- Keep server-only logic out of client components.
- Do not introduce outdated Pages Router patterns into App Router files.

## Styling Standards

- Follow the project's existing styling approach first.
- Prefer utility-first styling if the workspace already uses Tailwind.
- Keep spacing, sizing, and responsive behavior consistent with the existing layout.
- Avoid unnecessary custom CSS when existing utilities solve the problem cleanly.

## Animation Rule

- Use GSAP for scroll-based animations in this project.
- Prefer `gsap` with `ScrollTrigger` for reveal, parallax, pinned, or timeline-based scroll effects.
- Do not introduce alternative scroll-animation libraries unless the user explicitly asks for them.
- Only place GSAP code inside Client Components.
- Register plugins explicitly, clean up animations on unmount, and scope selectors safely.
- Keep animation code isolated from presentational markup when possible.

## GSAP Usage Guidance

- Import from `gsap` and `gsap/ScrollTrigger`.
- Register `ScrollTrigger` before use.
- Use refs for animation targets instead of broad document queries when possible.
- Wrap setup in `useEffect` or `useLayoutEffect` depending on rendering needs.
- Revert or kill animations during cleanup to avoid duplicate triggers and memory leaks.
- Respect reduced motion when adding non-essential motion.

## When To Invoke

Invoke this skill when:

- creating or editing pages, layouts, sections, or reusable UI
- reviewing frontend code for project compliance
- adding animation to sections, hero blocks, or scrolling experiences
- deciding whether to use Server or Client Components
- implementing any scroll-linked interaction

## Preferred Decisions

- Next.js conventions first
- existing project patterns second
- GSAP for scroll animation
- semantic and accessible markup always
- minimal, maintainable code over clever abstractions
