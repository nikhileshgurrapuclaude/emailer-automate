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
      onChange({ ...deal, [field]: value });
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

    const brandSlug = deal.brand_slug || "avendus";
    const folderName = deal.folder_name || "new_emailer";

    const uploadResult = await storageService.uploadImage({
      file,
      brandSlug,
      folderName,
      customName: "banner",
    });

    if (uploadResult?.url) {
      updateField("banner_url", uploadResult.url);
    }
  };

  return (
    <div className={styles.editorPanel}>
      <div className={styles.topBar}>
        <div className={styles.headerText}>
          <div className={styles.title}>✏️ Emailer Editor</div>
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
              Asset URL: /[{deal.brand_slug || "avendus"}]/[{deal.folder_name || "folder_name"}]/img/
            </span>
          </div>
          <input
            type="text"
            className={styles.input}
            value={deal.folder_name || ""}
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
            value={deal.email_title || ""}
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
            value={deal.preview_text || ""}
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
              value={deal.banner_url || ""}
              onChange={(e) => updateField("banner_url", e.target.value)}
              placeholder="or enter image URL (e.g. /avendus/img/bannerNew.jpg)"
            />
          </div>

          {deal.banner_url && (
            <div className={styles.bannerPreviewWrapper}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={deal.banner_url} alt="Banner Preview" />
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
            value={deal.body_content || ""}
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
              value={deal.cta_text || ""}
              onChange={(e) => updateField("cta_text", e.target.value)}
              placeholder="e.g. Know More"
            />
          </div>
          <div className={styles.fieldGroup}>
            <label className={styles.label}>CTA Button URL</label>
            <input
              type="text"
              className={styles.input}
              value={deal.cta_url || ""}
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
              value={deal.signoff_text || ""}
              onChange={(e) => updateField("signoff_text", e.target.value)}
              placeholder="Best regards,"
            />
          </div>
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Team Signature</label>
            <input
              type="text"
              className={styles.input}
              value={deal.signature_name || ""}
              onChange={(e) => updateField("signature_name", e.target.value)}
              placeholder="Avendus Capital Team"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
