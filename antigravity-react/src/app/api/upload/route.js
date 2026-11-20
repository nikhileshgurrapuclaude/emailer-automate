import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import { uploadImageToCloudinary, isCloudinaryConfigured } from "@/lib/cloudinary";

export const dynamic = "force-dynamic";

/**
 * API Route: /api/upload
 * Handles uploading banner and image assets to deal-specific folder.
 * Uses Cloudinary for permanent free cloud storage when configured,
 * and saves to local disk when running in development.
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
    const defaultOrigin = process.env.NEXT_PUBLIC_APP_ORIGIN || "https://emailer-automate.vercel.app";
    const localServerPath = `${defaultOrigin}/${cleanBrand}/${cleanFolder}/img/${cleanFilename}`;

    let savedToDisk = false;
    let savedToCloudinary = false;
    let cloudUrl = null;

    // 1. Upload to Cloudinary if buffer exists and Cloudinary is configured
    if (buffer && isCloudinaryConfigured()) {
      try {
        const cloudResult = await uploadImageToCloudinary(buffer, {
          folder: `${cleanBrand}/${cleanFolder}/img`,
          filename: cleanFilename,
        });

        if (cloudResult.success && cloudResult.url) {
          savedToCloudinary = true;
          cloudUrl = cloudResult.url;
        }
      } catch (cErr) {
        console.warn("Cloudinary upload failed:", cErr.message);
      }
    }

    // 2. Try local disk save if buffer exists (works in local dev)
    if (buffer) {
      try {
        const targetDir = path.join(process.cwd(), "public", cleanBrand, cleanFolder, "img");
        if (!fs.existsSync(targetDir)) {
          fs.mkdirSync(targetDir, { recursive: true });
        }
        const targetFilePath = path.join(targetDir, cleanFilename);
        fs.writeFileSync(targetFilePath, buffer);

        // Also save as bannerNew.jpg for backwards compatibility
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

    const finalUrl = cloudUrl || localServerPath;

    return NextResponse.json({
      success: true,
      filename: cleanFilename,
      folder: cleanFolder,
      brand: cleanBrand,
      serverPath: finalUrl,
      url: finalUrl,
      savedToDisk,
      savedToCloudinary,
      message: `Banner successfully uploaded to ${finalUrl}`,
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
