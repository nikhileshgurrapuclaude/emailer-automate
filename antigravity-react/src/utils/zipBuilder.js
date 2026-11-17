// UTILS //
import JSZip from "jszip";

/**
 * List of standard Avendus footer images required in every emailer ZIP
 */
const AVENDUS_FOOTER_IMAGES = [
  { name: "abou_us.png", path: "/avendus/img/abou_us.png" },
  { name: "assest_management.png", path: "/avendus/img/assest_management.png" },
  { name: "credit_solutions.png", path: "/avendus/img/credit_solutions.png" },
  { name: "investment.png", path: "/avendus/img/investment.png" },
  { name: "institutional.png", path: "/avendus/img/institutional.png" },
  { name: "wealth.png", path: "/avendus/img/wealth.png" },
  { name: "IBSignature.png", path: "/avendus/img/IBSignature.png" },
  { name: "AWM_Signature.jpg", path: "/avendus/img/AWM_Signature.jpg" },
  { name: "linkedin.png", path: "/avendus/img/linkedin.png" },
  { name: "twitter.png", path: "/avendus/img/twitter.png" },
  { name: "insta.png", path: "/avendus/img/insta.png" },
  { name: "dark-youtube-48.png", path: "/avendus/img/dark-youtube-48.png" },
];

/**
 * Downloads an image URL as ArrayBuffer or Blob
 */
async function fetchImageBuffer(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.arrayBuffer();
  } catch (err) {
    console.warn(`Could not fetch asset at ${url}:`, err);
    return null;
  }
}

/**
 * Builds and triggers download of a clean emailer ZIP archive
 * Structure:
 *   [folder_name].zip
 *   ├── index.html
 *   └── img/
 *       ├── banner.jpg
 *       └── [footer assets...]
 */
export async function downloadEmailerZip({ deal, htmlContent }) {
  const zip = new JSZip();
  const folderName = deal.folder_name || "emailer";

  // 1. Add index.html at root of ZIP
  zip.file("index.html", htmlContent);

  // 2. Create img folder
  const imgFolder = zip.folder("img");

  // 3. Fetch & add banner image
  if (deal.banner_url) {
    const bannerBuffer = await fetchImageBuffer(deal.banner_url);
    if (bannerBuffer) {
      // Determine file extension
      let ext = "jpg";
      if (deal.banner_url.endsWith(".png")) ext = "png";
      else if (deal.banner_url.endsWith(".webp")) ext = "webp";
      imgFolder.file(`banner.${ext}`, bannerBuffer);
      // Also provide bannerNew.jpg for backwards compatibility with legacy templates
      imgFolder.file("bannerNew.jpg", bannerBuffer);
    }
  }

  // 4. Fetch & add all footer assets
  await Promise.all(
    AVENDUS_FOOTER_IMAGES.map(async (asset) => {
      const buffer = await fetchImageBuffer(asset.path);
      if (buffer) {
        imgFolder.file(asset.name, buffer);
      }
    })
  );

  // 5. Generate ZIP blob
  const zipBlob = await zip.generateAsync({
    type: "blob",
    compression: "DEFLATE",
    compressionOptions: { level: 6 },
  });

  // 6. Trigger direct browser download
  const downloadUrl = URL.createObjectURL(zipBlob);
  const anchor = document.createElement("a");
  anchor.href = downloadUrl;
  anchor.download = `${folderName}.zip`;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  setTimeout(() => URL.revokeObjectURL(downloadUrl), 5000);

  return true;
}
