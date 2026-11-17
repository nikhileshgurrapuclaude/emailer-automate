# 05 — Supabase Setup & Deployment Guide

This guide walks through setting up the free Supabase backend for Phase 2, running the migrations, uploading master assets, and configuring Next.js.

---

## 1. Create Your Free Supabase Project

1. Go to [supabase.com](https://supabase.com) and click **Start your project** (log in with your GitHub account).
2. Click **New Project** and select your organization.
3. Fill in the project details:
   - **Name:** `emailer-automate-studio`
   - **Database Password:** Generate a secure password and save it in a password manager.
   - **Region:** Choose the region closest to your team (e.g., `Central India (Mumbai)` or `Southeast Asia (Singapore)`).
   - **Pricing Plan:** Select **Free Tier** ($0/month).
4. Click **Create new project** (takes ~1-2 minutes to provision).

---

## 2. Obtain Your Project Credentials

Once provisioned:
1. In the Supabase Dashboard, click on **Project Settings** (gear icon at bottom left).
2. Navigate to **API** in the sidebar.
3. Copy the following keys:
   - **Project URL:** `https://[your-project-id].supabase.co`
   - **anon / public key:** `eyJhbGciOiJIUzI1NiIsInR5cCI...` (safe for browser use).
   - **service_role key:** `eyJhbGciOiJIUzI1NiIsInR5cCI...` (keep secret, server-only).

---

## 3. Run the Database Migration Script

1. In the Supabase Dashboard, click on **SQL Editor** in the left sidebar.
2. Click **New query**.
3. Open [02-DATABASE-SCHEMA.md](file:///c:/emailer-automate/antigravity-react/02-DATABASE-SCHEMA.md), copy the entire SQL migration script from Section 2, and paste it into the editor.
4. Click **Run** (green button).
5. Verify success: Navigate to **Table Editor** to confirm that `profiles`, `brands`, `mailers`, and `mailer_revisions` tables have been created with Row Level Security enabled.

---

## 4. Set Up the Storage Bucket (`mailers`)

1. In the Supabase Dashboard, navigate to **Storage**.
2. Click **New bucket**:
   - **Name:** `mailers`
   - **Public bucket:** Enable toggle **ON** (Public read access is required so Gmail and Outlook can fetch images over HTTPS).
   - **File size limit:** `5MB`.
   - **Allowed MIME types:** `image/jpeg, image/png, image/webp, image/gif`.
3. Click **Save bucket**.
4. Run the storage security policies from [03-STORAGE-SPECIFICATION.md](file:///c:/emailer-automate/antigravity-react/03-STORAGE-SPECIFICATION.md) in the SQL Editor to allow authenticated uploads.

---

## 5. Upload Master Brand Assets to Storage

To ensure that newly drafted emailers never show broken footer icons, upload the 11 Avendus master footer assets into the bucket:

1. Inside the `mailers` bucket, click **Create folder** and name it `assets`.
2. Inside `assets`, create a folder named `avendus`.
3. Inside `avendus`, create a folder named `img`.
4. Upload all 11 footer images from your local workspace:
   `c:\emailer-automate\antigravity-html\avendus\deal_KSH_Group\img\`:
   - `abou_us.png`
   - `assest_management.png`
   - `credit_solutions.png`
   - `dark-youtube-48.png`
   - `IBSignature.png`
   - `insta.png`
   - `institutional.png`
   - `investment.png`
   - `linkedin.png`
   - `twitter.png`
   - `wealth.png`
5. Test: Click on `abou_us.png`, copy the **Public URL**, and open it in a private browser window. If the image loads, your storage CDN is active!

---

## 6. Configure Next.js Environment Variables

Inside `antigravity-react/` (or your Next.js project root), create `.env.local`:

```bash
# Supabase Public Configuration (Safe for Browser)
NEXT_PUBLIC_SUPABASE_URL=https://[your-project-id].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI...

# Base App Domain for Links
NEXT_PUBLIC_APP_ORIGIN=https://emailer-automate-react.vercel.app

# Private Server Secret (Do NOT expose to browser)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI...
```

---

## 7. Install Dependencies

In the Next.js project directory, install the Supabase SDKs and dependencies:

```bash
npm install @supabase/supabase-js @supabase/ssr jszip
```

---

## 8. Supabase Client Setup (`src/services/supabase.js`)

Create the universal Supabase client instance adhering to the project path aliases:

```javascript
// src/services/supabase.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Missing Supabase environment variables in .env.local');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

---

## 9. Verification Checklist

- [ ] Supabase project active on Free Tier ($0/mo).
- [ ] Database tables (`profiles`, `brands`, `mailers`) visible in Table Editor.
- [ ] Storage bucket `mailers` created with Public toggle ON.
- [ ] Master Avendus footer assets uploaded to `assets/avendus/img/`.
- [ ] `.env.local` configured with project URL and anon key.
- [ ] `npm run dev` boots Next.js with Turbopack and connects to Supabase without errors.
