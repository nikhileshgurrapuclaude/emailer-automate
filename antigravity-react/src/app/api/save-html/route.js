import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import { saveEmailerHtml } from "@/lib/htmlStore";
import { uploadRawHtmlToCloudinary, isCloudinaryConfigured } from "@/lib/cloudinary";

export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const json = await request.json();
    const brand = (json.brand || "avendus").toLowerCase().trim();
    const folder = (json.folder || "new_emailer").trim();
    const htmlContent = json.htmlContent || "";

    if (!htmlContent) {
      return NextResponse.json({ success: false, error: "Empty HTML content" }, { status: 400 });
    }

    // 1. Save in server memory cache
    saveEmailerHtml(brand, folder, htmlContent);

    // 2. Save to Cloudinary as raw HTML if configured
    let cloudHtmlUrl = null;
    if (isCloudinaryConfigured()) {
      try {
        const cloudRes = await uploadRawHtmlToCloudinary(htmlContent, {
          folder: `${brand}/${folder}`,
          filename: "index.html",
        });
        if (cloudRes.success) {
          cloudHtmlUrl = cloudRes.url;
        }
      } catch (cErr) {
        console.warn("Cloudinary HTML upload notice:", cErr.message);
      }
    }

    // 3. Save to local disk if writable
    try {
      const targetDir = path.join(process.cwd(), "public", brand, folder);
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }
      fs.writeFileSync(path.join(targetDir, "index.html"), htmlContent, "utf-8");
    } catch (fsErr) {
      // Expected in serverless read-only filesystem (Vercel)
    }

    const defaultOrigin = process.env.NEXT_PUBLIC_APP_ORIGIN || "https://emailer-automate.vercel.app";
    const shareUrl = `${defaultOrigin}/${brand}/${folder}/index.html`;

    return NextResponse.json({
      success: true,
      shareUrl,
      cloudHtmlUrl,
      message: `Emailer HTML saved successfully for ${shareUrl}`,
    });
  } catch (err) {
    console.error("Save HTML error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
