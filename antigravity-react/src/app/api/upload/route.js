import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";

export const dynamic = "force-dynamic";

/**
 * API Route: /api/upload
 * Handles uploading banner and image assets to deal-specific folder.
 * In local environment: saves to public/[brand]/[folder]/img/[filename].
 * If Supabase is configured: uploads to Supabase Storage bucket 'mailers'.
 */
export async function POST(request) {
  try {
    let brand = "avendus";
    let folder = "new_emailer";
    let filename = "banner.jpg";
    let buffer = null;

    const contentType = request.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const file = formData.get("file");
      const base64Data = formData.get("base64");
      brand = formData.get("brand") || brand;
      folder = formData.get("folder") || folder;
      filename = formData.get("filename") || (file ? file.name : filename);

      if (file && typeof file.arrayBuffer === "function") {
        const arrayBuf = await file.arrayBuffer();
        buffer = Buffer.from(arrayBuf);
      } else if (base64Data) {
        const cleaned = base64Data.replace(/^data:image\/\w+;base64,/, "");
        buffer = Buffer.from(cleaned, "base64");
      }
    } else {
      const json = await request.json();
      brand = json.brand || brand;
      folder = json.folder || folder;
      filename = json.filename || filename;
      if (json.base64) {
        const cleaned = json.base64.replace(/^data:image\/\w+;base64,/, "");
        buffer = Buffer.from(cleaned, "base64");
      }
    }

    // Clean names
    const cleanBrand = brand.replace(/[^a-zA-Z0-9_-]/g, "") || "avendus";
    const cleanFolder = folder.replace(/[^a-zA-Z0-9_-]/g, "") || "deal_emailer";
    const cleanFilename = filename.replace(/[^a-zA-Z0-9._-]/g, "_") || "banner.jpg";
    const defaultOrigin = "https://emailer-automate.vercel.app";
    const serverPath = `${defaultOrigin}/${cleanBrand}/${cleanFolder}/img/${cleanFilename}`;

    let savedToDisk = false;
    let savedToCloud = false;
    let cloudUrl = null;

    // 1. Try local disk save if buffer exists
    if (buffer) {
      try {
        const targetDir = path.join(process.cwd(), "public", cleanBrand, cleanFolder, "img");
        if (!fs.existsSync(targetDir)) {
          fs.mkdirSync(targetDir, { recursive: true });
        }
        const targetFilePath = path.join(targetDir, cleanFilename);
        fs.writeFileSync(targetFilePath, buffer);

        // Also save as bannerNew.jpg for compatibility
        const compatFilePath = path.join(targetDir, "bannerNew.jpg");
        fs.writeFileSync(compatFilePath, buffer);

        // Sync standard footer assets to the new deal folder if not already present
        const brandMasterImgDir = path.join(process.cwd(), "public", cleanBrand, "img");
        if (fs.existsSync(brandMasterImgDir)) {
          const masterFiles = fs.readdirSync(brandMasterImgDir);
          for (const f of masterFiles) {
            const destPath = path.join(targetDir, f);
            if (!fs.existsSync(destPath) && f !== "bannerNew.jpg") {
              fs.copyFileSync(path.join(brandMasterImgDir, f), destPath);
            }
          }
        }

        savedToDisk = true;
      } catch (fsErr) {
        // Expected in serverless read-only filesystem (Vercel)
        console.warn("Local disk write skipped (serverless environment):", fsErr.message);
      }
    }

    // 2. Check for Supabase Storage if credentials exist
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (supabaseUrl && !supabaseUrl.includes("your-project.supabase.co") && supabaseKey && !supabaseKey.includes("your-anon-key") && buffer) {
      try {
        const storagePath = `${cleanBrand}/${cleanFolder}/img/${cleanFilename}`;
        const uploadUrl = `${supabaseUrl}/storage/v1/object/mailers/${storagePath}`;

        const uploadRes = await fetch(uploadUrl, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${supabaseKey}`,
            "apikey": supabaseKey,
            "Content-Type": "image/jpeg",
            "x-upsert": "true",
          },
          body: buffer,
        });

        if (uploadRes.ok) {
          savedToCloud = true;
          cloudUrl = `${supabaseUrl}/storage/v1/object/public/mailers/${storagePath}`;
        }
      } catch (cloudErr) {
        console.warn("Supabase upload skipped:", cloudErr.message);
      }
    }

    return NextResponse.json({
      success: true,
      filename: cleanFilename,
      folder: cleanFolder,
      brand: cleanBrand,
      serverPath,
      url: cloudUrl || serverPath,
      savedToDisk,
      savedToCloud,
      message: `Banner successfully uploaded to ${serverPath}`,
    });
  } catch (err) {
    console.error("Upload route error:", err);
    return NextResponse.json(
      {
        success: false,
        error: err.message || "Failed to upload file",
      },
      { status: 500 }
    );
  }
}
