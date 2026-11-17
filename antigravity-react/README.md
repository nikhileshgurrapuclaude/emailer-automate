# Antigravity React — Emailer Automation Studio (Phase 2)

Welcome to the **Phase 2 Engineering Blueprint** for Emailer Automation Studio. This repository documents the transition from the client-side SPA (`antigravity-html`) to a modern, enterprise-ready full-stack application built with **Next.js 16 (App Router)** and **Supabase**.

---

## Documentation Index

| File | Description | Key Topics |
| :--- | :--- | :--- |
| **[01-SYSTEM-ARCHITECTURE.md](file:///c:/emailer-automate/antigravity-react/01-SYSTEM-ARCHITECTURE.md)** | High-Level Architecture & Blueprint | Data flow, server actions, Vercel deployment, email client compatibility. |
| **[02-DATABASE-SCHEMA.md](file:///c:/emailer-automate/antigravity-react/02-DATABASE-SCHEMA.md)** | Supabase PostgreSQL Schema & Security | Complete SQL migration script, RLS policies, brand seed data, revisions audit. |
| **[03-STORAGE-SPECIFICATION.md](file:///c:/emailer-automate/antigravity-react/03-STORAGE-SPECIFICATION.md)** | Cloud Asset Delivery & Upload API | Direct browser-to-S3 uploads, permanent HTTPS CDN links, zero Git commits. |
| **[04-COMPONENT-BREAKDOWN.md](file:///c:/emailer-automate/antigravity-react/04-COMPONENT-BREAKDOWN.md)** | Next.js 16 UI Architecture | Base template compliance, App Router page hierarchy, SCSS Modules. |
| **[05-SUPABASE-SETUP-GUIDE.md](file:///c:/emailer-automate/antigravity-react/05-SUPABASE-SETUP-GUIDE.md)** | Step-by-Step Backend Setup | Free tier setup, running migrations, bucket creation, and `.env.local` keys. |

---

## Why Phase 2 Solves the Core Constraints

1. **Permanent Public CDN URLs for Images:**
   - In Phase 1, images lived only in browser memory until manually committed via Git.
   - In Phase 2, selecting a banner automatically uploads it to Supabase Storage within 500ms, immediately returning a permanent public link:
     ```text
     https://[project-id].supabase.co/storage/v1/object/public/mailers/deals/avendus/[deal_folder]/banner.jpg
     ```
   - Copying and pasting into Gmail or Outlook works anywhere with **zero attachment errors**.

2. **Team Collaboration & Saved History:**
   - Emailer drafts are stored in Supabase PostgreSQL instead of browser `localStorage`.
   - Team members can collaborate, search past deals, review revisions, and publish emailers from any computer.

3. **Production-Ready Codebase:**
   - Built directly on a clean Next.js 16 App Router foundation using pure JavaScript, SCSS Modules, and modern architecture.
