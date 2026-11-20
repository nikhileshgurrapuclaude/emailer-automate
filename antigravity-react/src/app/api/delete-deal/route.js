import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import { deleteFolderFromCloudinary, isCloudinaryConfigured } from "@/lib/cloudinary";
import { deleteEmailerHtml } from "@/lib/htmlStore";

export const dynamic = "force-dynamic";

/**
 * API Route: /api/delete-deal
 * Permanently removes a deal's assets and folder:
 * 1. Cleans up all images and raw files in Cloudinary
 * 2. Clears the server HTML cache
 * 3. Deletes the physical directory from disk (if in local development)
 */
export async function POST(request) {
  try {
    const json = await request.json();
    const brand = (json.brand || "avendus").toLowerCase().trim();
    const folder = (json.folder || "").trim();

    if (!folder) {
      return NextResponse.json({ success: false, error: "Folder name is required" }, { status: 400 });
    }

    let deletedFromCloudinary = false;
    let deletedFromDisk = false;

    // 1. Delete all assets and the folder from Cloudinary
    if (isCloudinaryConfigured()) {
      try {
        const cloudRes = await deleteFolderFromCloudinary(`${brand}/${folder}`);
        deletedFromCloudinary = cloudRes.success;
      } catch (cErr) {
        console.warn("Cloudinary folder deletion error:", cErr.message);
      }
    }

    // 2. Remove from in-memory cache
    deleteEmailerHtml(brand, folder);

    // 3. Remove physical directory from disk if it exists (local development)
    try {
      const targetDir = path.join(process.cwd(), "public", brand, folder);
      if (fs.existsSync(targetDir)) {
        fs.rmSync(targetDir, { recursive: true, force: true });
        deletedFromDisk = true;
      }
    } catch (fsErr) {
      console.warn("Local disk deletion notice:", fsErr.message);
    }

    return NextResponse.json({
      success: true,
      folder,
      brand,
      deletedFromCloudinary,
      deletedFromDisk,
      message: `Successfully deleted folder "${folder}" and all its assets.`,
    });
  } catch (err) {
    console.error("Delete deal route error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
