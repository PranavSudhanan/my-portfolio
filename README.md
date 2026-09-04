# Pranav S L — Portfolio

A fast, modern, single-page developer portfolio built with **Next.js 16**, **TypeScript**, **Tailwind CSS v4** and **Framer Motion**. Dark, glassy, animated — and ready to deploy on **Vercel** with zero configuration.

## ✨ Features

- Animated hero with a live "terminal" card and rotating role text
- Scroll-reveal animations throughout (respects `prefers-reduced-motion`)
- Experience timeline, categorized skills with real tech logos, and interactive 3D-tilt project cards
- Résumé download, dynamic Open Graph share image, SEO metadata and an SVG favicon
- Fully responsive and accessible

## 🧑‍💻 Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## 🔧 Make it yours

Almost everything lives in one file: [`src/lib/data.ts`](src/lib/data.ts).

- **Text, links, projects, skills, experience** → edit `src/lib/data.ts`
- **GitHub link** → set `profile.github` in `src/lib/data.ts`
- **Profile photo** → drop a square image at `public/profile.jpg`, then in
  `src/components/About.tsx` replace the `PSL` monogram block with a
  `next/image`. The slot is marked with a comment.
- **Résumé** → replace `public/Pranav_S_L_Resume.pdf` (keep the filename, or
  update `profile.resume`)
- **Colors** → tweak the CSS variables in `src/app/globals.css` (`--color-violet`,
  `--color-cyan`, `--color-emerald`, `--color-amber`)
- **Deployment URL** → update `siteUrl` in `src/app/layout.tsx` once you know your
  Vercel domain (improves Open Graph / SEO)

## 🚀 Deploy to Vercel

**Option A — Git (recommended):**

1. Push this folder to a GitHub repo.
2. Go to [vercel.com/new](https://vercel.com/new), import the repo.
3. Vercel auto-detects Next.js — just click **Deploy**. No settings needed.

**Option B — Vercel CLI:**

```bash
npm i -g vercel
vercel
```

Follow the prompts, then `vercel --prod` to promote to production.

## 🏗️ Tech

| | |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Animation | Framer Motion |
| Icons | react-icons |
| Hosting | Vercel |
