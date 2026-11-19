"use client";

// MODULES //
import { useState } from "react";
import { Monitor, Smartphone, Copy, Check, Download } from "lucide-react";

// UTILS //
import { downloadEmailerZip } from "@/utils/zipBuilder";

// STYLES //
import styles from "./StudioPreview.module.scss";

export default function StudioPreview({
  deal = {},
  htmlContent = "",
  previewHtml = "",
  onNotify,
}) {
  const [viewMode, setViewMode] = useState("desktop"); // "desktop" | "mobile"
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  // Copy email HTML formatted for direct paste into Gmail / Outlook
  const handleCopyForEmail = async () => {
    try {
      if (typeof window !== "undefined" && navigator.clipboard && window.ClipboardItem) {
        const htmlBlob = new Blob([htmlContent], { type: "text/html" });
        const textBlob = new Blob([htmlContent], { type: "text/plain" });
        await navigator.clipboard.write([
          new ClipboardItem({
            "text/html": htmlBlob,
            "text/plain": textBlob,
          }),
        ]);
        setCopied(true);
        if (onNotify) onNotify("Copied formatted email! Paste directly into Gmail/Outlook (Ctrl+V)", "success");
        setTimeout(() => setCopied(false), 3000);
      } else {
        // Fallback to text copy
        await navigator.clipboard.writeText(htmlContent);
        setCopied(true);
        if (onNotify) onNotify("HTML code copied to clipboard", "success");
        setTimeout(() => setCopied(false), 3000);
      }
    } catch (err) {
      console.error("Clipboard write error:", err);
      if (onNotify) onNotify("Failed to copy automatically. Please copy from iframe source.", "error");
    }
  };

  // Download complete ZIP archive (index.html + img folder)
  const handleDownloadZip = async () => {
    try {
      setDownloading(true);
      if (onNotify) onNotify("Packaging clean ZIP archive...", "info");
      await downloadEmailerZip({ deal, htmlContent });
      if (onNotify) onNotify(`Downloaded ${deal.folder_name || "emailer"}.zip!`, "success");
    } catch (err) {
      console.error("ZIP creation error:", err);
      if (onNotify) onNotify("Failed to generate ZIP archive.", "error");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className={styles.previewPanel}>
      <div className={styles.topBar}>
        <div className={styles.modeToggles}>
          <button
            className={`${styles.toggleBtn} ${viewMode === "desktop" ? styles.active : ""}`}
            onClick={() => setViewMode("desktop")}
            title="Desktop View (600px)"
          >
            <Monitor size={14} />
            <span>Desktop (600px)</span>
          </button>
          <button
            className={`${styles.toggleBtn} ${viewMode === "mobile" ? styles.active : ""}`}
            onClick={() => setViewMode("mobile")}
            title="Mobile View (380px)"
          >
            <Smartphone size={14} />
            <span>Mobile (380px)</span>
          </button>
        </div>

        <div className={styles.actionButtons}>
          <button
            className={`${styles.copyBtn} ${copied ? styles.copied : ""}`}
            onClick={handleCopyForEmail}
            title="Copy formatted email for Gmail/Outlook"
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            <span>{copied ? "Copied!" : "Copy for Email"}</span>
          </button>

          <button
            className={styles.downloadBtn}
            onClick={handleDownloadZip}
            disabled={downloading}
            title="Download clean ZIP (index.html + img/)"
          >
            <Download size={14} />
            <span>{downloading ? "Packaging..." : "Download ZIP"}</span>
          </button>
        </div>
      </div>

      <div className={styles.iframeContainer}>
        <div className={`${styles.iframeWrapper} ${styles[viewMode]}`}>
          <iframe
            className={styles.previewIframe}
            srcDoc={previewHtml || htmlContent}
            title="Email Preview"
            sandbox="allow-same-origin"
          />
        </div>
      </div>
    </div>
  );
}
