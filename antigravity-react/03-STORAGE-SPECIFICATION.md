# 03 — Supabase Storage Architecture & Asset Delivery

## 1. Bucket Configuration & Access Policy

To resolve the core constraint of Phase 1 (where images only lived in browser memory until a `git push`), Phase 2 uses **Supabase Storage**. Supabase Storage provides S3-compatible, edge-cached, permanent public HTTPS URLs directly from browser uploads.

### Bucket Specifications
- **Bucket ID:** `mailers`
- **Public Access:** `true` (Objects can be downloaded or rendered by anyone on the internet without an auth token).
- **Max File Size:** `5MB` per object.
- **Allowed MIME Types:** `image/jpeg`, `image/png`, `image/webp`, `image/gif`.
- **Cache-Control:** `max-age=31536000, public` (1 year browser & edge CDN cache).

---

## 2. Bucket Storage Path Conventions

```text
mailers/
│
├── assets/                                      # Master Brand Footer & UI Assets
│   ├── avendus/
│   │   └── img/
│   │       ├── IBSignature.png                  (91.6 KB)
│   │       ├── abou_us.png                      (1.4 KB)
│   │       ├── assest_management.png            (1.7 KB)
│   │       ├── credit_solutions.png             (1.5 KB)
│   │       ├── investment.png                   (1.7 KB)
│   │       ├── institutional.png                (1.8 KB)
│   │       ├── wealth.png                       (1.7 KB)
│   │       ├── linkedin.png                     (824 B)
│   │       ├── twitter.png                      (1.1 KB)
│   │       ├── insta.png                        (502 B)
│   │       └── dark-youtube-48.png              (809 B)
│   │
│   ├── sanctum/
│   │   └── img/
│   │       └── [sanctum footer assets...]
│   │
│   └── custom/
│       └── img/
│
└── deals/                                       # Dynamic Deal & Newsletter Banners
    ├── avendus/
    │   ├── deal_KSH_Group/
    │   │   └── bannerNew.jpg
    │   ├── demo_emailer/
    │   │   └── bannerNew.jpg
    │   ├── ecm_newsletter_march_2026/
    │   │   └── ecm_banner.png
    │   ├── ets_newsletter_march_2026/
    │   │   └── ets_banner.png
    │   ├── new_age_report/
    │   │   └── emailer_banner.png
    │   └── [new_deal_folder]/
    │       └── [uploaded_banner.jpg]
    │
    └── sanctum/
        └── [deal_folder]/
```

---

## 3. Supabase Storage SQL Policies

Run this in the Supabase SQL Editor to configure bucket permissions:

```sql
-- 1. Create the Public Storage Bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'mailers',
    'mailers',
    true,
    5242880, -- 5 MB limit
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET
    public = true,
    file_size_limit = 5242880,
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

-- 2. Policy: Allow Anyone on the Internet to Read/View Images (Required for Emails)
CREATE POLICY "Public Read Access for Mailer Assets"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'mailers');

-- 3. Policy: Allow Authenticated Users to Upload Images
CREATE POLICY "Authenticated Users Can Upload Mailer Assets"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'mailers');

-- 4. Policy: Allow Authenticated Users to Update/Replace Own Images
CREATE POLICY "Authenticated Users Can Update Mailer Assets"
    ON storage.objects FOR UPDATE
    TO authenticated
    USING (bucket_id = 'mailers');

-- 5. Policy: Allow Authenticated Users to Delete Images
CREATE POLICY "Authenticated Users Can Delete Mailer Assets"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (bucket_id = 'mailers');
```

---

## 4. Frontend Upload Service Implementation

Here is the exact service implementation in Next.js (`@/services/storageService.js`) to handle direct uploads from the UI:

```javascript
// src/services/storageService.js
import { supabase } from '@/services/supabase';

export const StorageService = {
  /**
   * Uploads a deal banner directly to Supabase Storage
   * @param {File} file - The image file selected from the computer
   * @param {string} brand - e.g. 'avendus'
   * @param {string} folderName - e.g. 'deal_Adani_Group'
   * @returns {Promise<{ publicUrl: string, filename: string }>}
   */
  async uploadBanner(file, brand = 'avendus', folderName = 'deal_emailer') {
    if (!file) throw new Error('No file provided for upload.');

    // 1. Sanitize file name
    const ext = file.name.split('.').pop().toLowerCase();
    const cleanFilename = file.name
      .replace(/[^a-zA-Z0-9._-]/g, '_')
      .replace(/\s+/g, '_');
    
    // Path inside bucket: deals/avendus/deal_Adani_Group/banner_adani.jpg
    const filePath = `deals/${brand.toLowerCase()}/${folderName.trim()}/${cleanFilename}`;

    // 2. Direct upload to Supabase
    const { data, error } = await supabase.storage
      .from('mailers')
      .upload(filePath, file, {
        cacheControl: '31536000',
        upsert: true // Overwrite if same file re-uploaded
      });

    if (error) {
      console.error('Supabase Storage upload error:', error);
      throw new Error(`Upload failed: ${error.message}`);
    }

    // 3. Obtain permanent public HTTPS URL
    const { data: publicData } = supabase.storage
      .from('mailers')
      .getPublicUrl(filePath);

    return {
      publicUrl: publicData.publicUrl,
      filename: cleanFilename,
      path: filePath
    };
  },

  /**
   * Resolves the master footer asset URL from Supabase Storage
   * @param {string} brand - 'avendus' | 'sanctum' | 'custom'
   * @param {string} filename - 'abou_us.png'
   */
  getFooterAssetUrl(brand = 'avendus', filename) {
    const filePath = `assets/${brand.toLowerCase()}/img/${filename}`;
    const { data } = supabase.storage
      .from('mailers')
      .getPublicUrl(filePath);
    return data.publicUrl;
  }
};
```

---

## 5. How this Guarantees 0 Errors in Gmail & Outlook

When an emailer is built in Phase 2:
1. Every footer image points to:
   ```html
   <img src="https://[id].supabase.co/storage/v1/object/public/mailers/assets/avendus/img/abou_us.png" />
   ```
2. The dynamic banner image points to:
   ```html
   <img src="https://[id].supabase.co/storage/v1/object/public/mailers/deals/avendus/deal_Adani/banner.jpg" />
   ```
3. **When you copy-paste into Gmail:**
   - Gmail detects standard HTTPS links.
   - It downloads and renders them via its proxy cache with **zero local hard drive restrictions**.
   - No `"There was an error attaching your image"` error.
   - The email is sent and renders cleanly on iPhones, Android devices, Outlook Desktop, and Webmail.
