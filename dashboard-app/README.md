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

## Design Concept

This project strictly follows an **Apple-style** (or highly polished "Bento Grid") design system. The core tenets include:
- **Glassmorphism & Blur:** Heavy reliance on `backdrop-filter: blur(...)` for floating elements like menus and overlays.
- **Subtle Interactions:** Hover effects should be soft, usually involving slight `transform: translateY` animations and smooth cubic-bezier transitions (`transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);`).
- **Clean Gradients & Shadows:** Deep, soft shadows (`box-shadow`) paired with delicate borders (e.g., `border: 1px solid rgba(255,255,255,0.1)`) give depth to cards.
- **Refined Typography:** Clear hierarchy using `Plus Jakarta Sans` with varying font weights and tight tracking for titles.
- **Monochrome & High Contrast Focus:** Especially in dark mode, the UI relies on deep blacks (`#000000`, `#0a0a0a`, `#1c1c1e`) combined with vibrant, purposeful accent colors like blue or green for primary actions.
