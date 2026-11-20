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

    // Inject a floating "Copy for Email" helper bar for the browser preview tab
    const previewBar = `
<div id="emailer-preview-bar" style="position:fixed;top:0;left:0;right:0;height:48px;background:#0f172a;color:#ffffff;display:flex;align-items:center;justify-content:space-between;padding:0 24px;box-shadow:0 4px 12px rgba(0,0,0,0.25);z-index:999999;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;font-size:14px;box-sizing:border-box;">
  <div style="display:flex;align-items:center;gap:12px;">
    <span style="font-weight:600;letter-spacing:-0.2px;color:#f8fafc;">Avendus Emailer Shareable View</span>
    <span style="background:#1e293b;border:1px solid #334155;color:#94a3b8;font-size:11px;font-weight:500;padding:2px 8px;border-radius:12px;">Production Ready</span>
  </div>
  <button id="preview-copy-btn" onclick="copyEmailForGmail()" style="background:#cc1919;color:#ffffff;border:none;padding:7px 16px;border-radius:6px;font-weight:600;font-size:13px;cursor:pointer;display:flex;align-items:center;gap:6px;box-shadow:0 2px 6px rgba(204,25,25,0.35);transition:all 0.2s ease;">
    <span>📋 Copy for Email (Direct Paste for Gmail)</span>
  </button>
</div>
<script>
  function copyEmailForGmail() {
    const btn = document.getElementById('preview-copy-btn');
    const bar = document.getElementById('emailer-preview-bar');
    if (bar) bar.style.display = 'none';
    const cleanHtml = document.documentElement.outerHTML;
    if (bar) bar.style.display = 'flex';
    
    if (navigator.clipboard && window.ClipboardItem) {
      const htmlBlob = new Blob([cleanHtml], { type: 'text/html' });
      const textBlob = new Blob([cleanHtml], { type: 'text/plain' });
      navigator.clipboard.write([
        new ClipboardItem({ 'text/html': htmlBlob, 'text/plain': textBlob })
      ]).then(() => {
        btn.innerHTML = '<span>✅ Copied! Paste directly into Gmail (Ctrl+V)</span>';
        btn.style.background = '#16a34a';
        setTimeout(() => {
          btn.innerHTML = '<span>📋 Copy for Email (Direct Paste for Gmail)</span>';
          btn.style.background = '#cc1919';
        }, 3500);
      }).catch(err => {
        console.error('Copy error:', err);
      });
    }
  }
</script>
<style>
  body { padding-top: 48px !important; }
  @media print { #emailer-preview-bar { display: none !important; } body { padding-top: 0 !important; } }
</style>
`;

    if (html.includes("</body>")) {
      html = html.replace("</body>", `${previewBar}</body>`);
    } else {
      html += previewBar;
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
