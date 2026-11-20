import path from "path";
import fs from "fs";
import { getEmailerHtml } from "@/lib/htmlStore";
import { SEED_DEALS } from "@/data/seedDeals";
import { generateEmailerHtml } from "@/utils/templateGenerator";

export const dynamic = "force-dynamic";

export async function GET(request, { params }) {
  try {
    const { brand = "avendus", folder = "deal" } = await params;
    const cleanBrand = brand.toLowerCase().trim();
    const cleanFolder = folder.trim();

    // 1. Check in-memory store
    let html = getEmailerHtml(cleanBrand, cleanFolder);

    // 2. Check local filesystem if file exists on disk
    if (!html) {
      try {
        const filePath = path.join(process.cwd(), "public", cleanBrand, cleanFolder, "index.html");
        if (fs.existsSync(filePath)) {
          html = fs.readFileSync(filePath, "utf-8");
        }
      } catch (e) {
        // Ignore file read error on serverless
      }
    }

    // 3. Check if matching seed deal exists
    if (!html) {
      const match = SEED_DEALS.find(
        (d) => (d.folder_name || d.folderName) === cleanFolder
      );
      if (match) {
        html = generateEmailerHtml({
          ...match,
          originUrl: process.env.NEXT_PUBLIC_APP_ORIGIN || "https://emailer-automate.vercel.app",
        });
      }
    }

    // 4. Fallback generation if no match found
    if (!html) {
      html = generateEmailerHtml({
        brand_slug: cleanBrand,
        folder_name: cleanFolder,
        email_title: "Transaction Announcement",
        content: `**New Transaction Announcement**\n\nDear Reader,\n\nAvendus Capital is pleased to announce our latest strategic transaction advisory in India.\n\n**Avendus Capital acted as the exclusive financial advisor on this transaction.**\n\nOur team continues to lead transformative deals across high-growth sectors.\n\nBest regards,\nAvendus Capital Team`,
        cta_text: "Know More",
        cta_url: "https://www.avendus.com",
        originUrl: process.env.NEXT_PUBLIC_APP_ORIGIN || "https://emailer-automate.vercel.app",
      });
    }

    return new Response(html, {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "public, max-age=60, s-maxage=120",
      },
    });
  } catch (err) {
    console.error("View route error:", err);
    return new Response(`<h1>Error rendering emailer</h1><p>${err.message}</p>`, {
      status: 500,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }
}
