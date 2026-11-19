"use client";

// MODULES //
import Link from "next/link";
import { Layers, Globe, PanelLeft } from "lucide-react";

// STYLES //
import styles from "./HeaderNav.module.scss";

/**
 * Top navigation bar with active brand badge, origin URL configuration, sidebar toggle, and brand switcher
 */
export default function HeaderNav({
  brandName = "Avendus Capital",
  originUrl = "https://emailer-automate.vercel.app",
  onOriginChange,
  showSidebarToggle = false,
  isSidebarOpen = true,
  onToggleSidebar,
}) {
  return (
    <header className={styles.header}>
      <div className={styles.leftSection}>
        {showSidebarToggle && (
          <button
            type="button"
            className={styles.sidebarToggleBtn}
            onClick={onToggleSidebar}
            title={isSidebarOpen ? "Collapse Deals Sidebar" : "Expand Deals Sidebar"}
          >
            <PanelLeft size={15} style={{ color: "#FED430" }} />
            <span>{isSidebarOpen ? "◀ Deals Sidebar" : "▶ Deals Sidebar"}</span>
          </button>
        )}

        <Link href="/" className={styles.logo}>
          <span className={styles.rocket}>🚀</span>
          <span>
            Emailer<span className={styles.accent}>Studio</span>
          </span>
        </Link>
        <div className={styles.brandBadge}>{brandName}</div>
      </div>

      <div className={styles.rightSection}>
        <div className={styles.originWrapper}>
          <label htmlFor="originInput">
            <Globe size={14} style={{ color: "#FED430" }} />
            <span>Origin:</span>
          </label>
          <input
            id="originInput"
            type="text"
            value={originUrl}
            onChange={(e) => onOriginChange && onOriginChange(e.target.value)}
            placeholder="https://your-domain.vercel.app"
          />
        </div>

        <Link href="/" className={styles.switchBrandBtn}>
          <Layers size={14} style={{ color: "#FED430" }} />
          <span>Switch Brand</span>
        </Link>
      </div>
    </header>
  );
}
