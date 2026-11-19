"use client";

// MODULES //
import { useRef } from "react";
import { Upload, Bold, Italic, Quote, Save, Play } from "lucide-react";

// SERVICES //
import { storageService } from "@/services/storageService";

// STYLES //
import styles from "./StudioEditor.module.scss";

export default function StudioEditor({
  deal = {},
  onChange,
  onSave,
  onGenerate,
}) {
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  const updateField = (field, value) => {
    if (onChange) {
      const updated = { ...deal, [field]: value };
      if (field === "folder_name") {
        updated.folderName = value;
        const brandSlug = deal.brand_slug || deal.brand || "avendus";
        const oldFolder = deal.folder_name || deal.folderName;
        // If banner was pointing to old folder, automatically update it to match new folder
        if (oldFolder && deal.banner_url && deal.banner_url.startsWith(`/${brandSlug}/${oldFolder}/img/`)) {
          const filename = deal.banner_url.split("/").pop();
          const newPath = `/${brandSlug}/${value}/img/${filename}`;
          updated.banner_url = newPath;
          updated.bannerUrl = newPath;
        }
      }
      if (field === "email_title") updated.title = value;
      if (field === "preview_text") updated.previewText = value;
      if (field === "banner_url") {
        updated.bannerUrl = value;
        if (!value) {
          updated.banner_preview_url = "";
          updated.bannerPreviewUrl = "";
          updated.banner_base64 = "";
        }
      }
      if (field === "body_content") updated.content = value;
      if (field === "cta_text") updated.buttonLabel = value;
      if (field === "cta_url") updated.buttonLink = value;
      onChange(updated);
    }
  };

  // Keyboard shortcut Ctrl+B for bolding text
  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "b") {
      e.preventDefault();
      applyFormatting("**", "**");
    }
  };

  const applyFormatting = (prefix, suffix) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selected = text.substring(start, end);

    const replacement = `${prefix}${selected || "bold text"}${suffix}`;
    const newText = text.substring(0, start) + replacement + text.substring(end);

    updateField("body_content", newText);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + prefix.length,
        start + prefix.length + (selected ? selected.length : 9)
      );
    }, 0);
  };

  // Handle local file upload
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const brandSlug = deal.brand_slug || deal.brand || "avendus";
    const folderName = deal.folder_name || deal.folderName || "new_emailer";

    const uploadResult = await storageService.uploadImage({
      file,
      brandSlug,
      folderName,
      customName: "banner",
    });

    if (uploadResult?.serverPath) {
      if (onChange) {
        onChange({
          ...deal,
          // Server path matching all other image links
          banner_url: uploadResult.serverPath,
          bannerUrl: uploadResult.serverPath,
          banner_filename: uploadResult.filename,
          bannerFilename: uploadResult.filename,
          // Preview and base64 for instant thumbnail and zip bundling
          banner_preview_url: uploadResult.previewUrl,
          bannerPreviewUrl: uploadResult.previewUrl,
          banner_base64: uploadResult.base64,
        });
      }
    }
  };

  const folderName = deal.folder_name || deal.folderName || "";
  const emailTitle = deal.email_title || deal.title || "";
  const previewText = deal.preview_text || deal.previewText || "";
  const bannerUrl = deal.banner_url || deal.bannerUrl || "";
  const bannerPreview = deal.banner_preview_url || deal.bannerPreviewUrl || bannerUrl;
  const bodyContent = deal.body_content || deal.content || "";
  const ctaText = deal.cta_text || deal.buttonLabel || "";
  const ctaUrl = deal.cta_url || deal.buttonLink || "";
  const signoffText = deal.signoff_text || "Best regards,";
  const signatureName = deal.signature_name || "Avendus Capital Team";

  return (
    <div className={styles.editorPanel}>
      <div className={styles.topBar}>
        <div className={styles.headerText}>
          <div className={styles.title}>
            <span>✏️</span>
            <span>Emailer Editor</span>
          </div>
          <div className={styles.subtitle}>Strict single &lt;p&gt; compliant structure</div>
        </div>
        <div className={styles.actionButtons}>
          <button className={styles.updateBtn} onClick={onSave} title="Save Changes">
            <Save size={13} />
            <span>Update Tab</span>
          </button>
          <button className={styles.generateBtn} onClick={onGenerate} title="Re-generate HTML Preview">
            <Play size={13} />
            <span>Generate</span>
          </button>
        </div>
      </div>

      <div className={styles.formContent}>
        {/* 1. Folder Name */}
        <div className={styles.fieldGroup}>
          <div className={styles.labelRow}>
            <label className={styles.label}>
              1. Folder Name <span className={styles.required}>*</span>
            </label>
            <span className={styles.sublabel}>
              Asset URL: /[{deal.brand_slug || deal.brand || "avendus"}]/[{folderName || "folder_name"}]/img/
            </span>
          </div>
          <input
            type="text"
            className={styles.input}
            value={folderName}
            onChange={(e) => updateField("folder_name", e.target.value)}
            placeholder="e.g. deal_KSH_Group"
          />
        </div>

        {/* 2. Email Title */}
        <div className={styles.fieldGroup}>
          <label className={styles.label}>
            2. Email Title (Title Tag) <span className={styles.required}>*</span>
          </label>
          <input
            type="text"
            className={styles.input}
            value={emailTitle}
            onChange={(e) => updateField("email_title", e.target.value)}
            placeholder="e.g. KSH Group sells 100% stake in KSH INFRA to IndoSpace"
          />
        </div>

        {/* 3. Preview Text */}
        <div className={styles.fieldGroup}>
          <label className={styles.label}>3. Preview Text (Inbox Snippet)</label>
          <input
            type="text"
            className={styles.input}
            value={previewText}
            onChange={(e) => updateField("preview_text", e.target.value)}
            placeholder="e.g. Avendus acts as exclusive financial advisor..."
          />
        </div>

        {/* 4. Banner Image */}
        <div className={styles.fieldGroup}>
          <label className={styles.label}>4. Banner Image (600px width)</label>
          <div className={styles.uploadRow}>
            <button
              type="button"
              className={styles.uploadBtn}
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload size={14} />
              <span>Upload File</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className={styles.hiddenFileInput}
              onChange={handleFileUpload}
            />
            <input
              type="text"
              className={styles.input}
              value={bannerUrl}
              onChange={(e) => updateField("banner_url", e.target.value)}
              placeholder="e.g. /avendus/deal_ArkaFincap/img/bannerNew.jpg"
            />
          </div>

          {bannerPreview && (
            <div className={styles.bannerPreviewWrapper}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={bannerPreview}
                alt="Banner Preview"
                onError={(e) => {
                  if (!e.target.src.endsWith("/avendus/img/bannerNew.jpg")) {
                    e.target.src = "/avendus/img/bannerNew.jpg";
                  }
                }}
              />
            </div>
          )}
        </div>

        {/* 5. Email Body Content */}
        <div className={styles.fieldGroup}>
          <div className={styles.toolbar}>
            <div className={styles.toolbarTools}>
              <button
                type="button"
                className={styles.toolBtn}
                onClick={() => applyFormatting("**", "**")}
                title="Bold (Ctrl+B)"
              >
                <Bold size={13} />
              </button>
              <button
                type="button"
                className={styles.toolBtn}
                onClick={() => applyFormatting("*", "*")}
                title="Italic"
              >
                <Italic size={13} />
              </button>
              <button
                type="button"
                className={styles.toolBtn}
                onClick={() => applyFormatting("> ", "")}
                title="Quote"
              >
                <Quote size={13} />
              </button>
            </div>
            <div className={styles.toolbarHint}>Tip: type **bold text** directly | Press Ctrl+B to bold</div>
          </div>
          <textarea
            ref={textareaRef}
            className={styles.textarea}
            value={bodyContent}
            onChange={(e) => updateField("body_content", e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter email content here..."
          />
        </div>

        {/* 6. CTA Button */}
        <div className={styles.gridTwo}>
          <div className={styles.fieldGroup}>
            <label className={styles.label}>CTA Button Label</label>
            <input
              type="text"
              className={styles.input}
              value={ctaText}
              onChange={(e) => updateField("cta_text", e.target.value)}
              placeholder="e.g. Know More"
            />
          </div>
          <div className={styles.fieldGroup}>
            <label className={styles.label}>CTA Button URL</label>
            <input
              type="text"
              className={styles.input}
              value={ctaUrl}
              onChange={(e) => updateField("cta_url", e.target.value)}
              placeholder="https://..."
            />
          </div>
        </div>

        {/* 7. Signoff and Team */}
        <div className={styles.gridTwo}>
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Signoff Text</label>
            <input
              type="text"
              className={styles.input}
              value={signoffText}
              onChange={(e) => updateField("signoff_text", e.target.value)}
              placeholder="Best regards,"
            />
          </div>
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Team Signature</label>
            <input
              type="text"
              className={styles.input}
              value={signatureName}
              onChange={(e) => updateField("signature_name", e.target.value)}
              placeholder="Avendus Capital Team"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
