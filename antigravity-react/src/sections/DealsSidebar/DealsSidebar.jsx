"use client";

// MODULES //
import { useState } from "react";
import { Folder, Plus, Search, Clock, X, ChevronLeft, PanelLeftOpen } from "lucide-react";

// STYLES //
import styles from "./DealsSidebar.module.scss";

export default function DealsSidebar({
  deals = [],
  activeDealId,
  onSelectDeal,
  onNewDeal,
  onDeleteDeal,
  isCollapsed = false,
  onToggleCollapse,
}) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredDeals = deals.filter((deal) => {
    const q = searchQuery.toLowerCase();
    const folder = (deal.folder_name || deal.folderName || "").toLowerCase();
    const title = (deal.email_title || deal.title || "").toLowerCase();
    return folder.includes(q) || title.includes(q);
  });

  const formatDate = (dateString) => {
    if (!dateString) return "";
    try {
      const d = new Date(dateString);
      return d.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div data-lenis-prevent>
      {isCollapsed && (
        <button
          type="button"
          className={styles.floatingExpandBtn}
          onClick={onToggleCollapse}
          title="Open Saved Deals Sidebar"
        >
          <PanelLeftOpen size={16} />
          <span>Deals</span>
        </button>
      )}

      <aside className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ""}`}>
        <div className={styles.topBar}>
          <div className={styles.title}>
            <Folder size={17} className={styles.folderIcon} />
            <span>Saved Deals</span>
          </div>
          <div className={styles.topActions}>
            <button className={styles.newBtn} onClick={onNewDeal} title="Create New Emailer">
              <Plus size={14} />
              <span>New</span>
            </button>
            {onToggleCollapse && (
              <button
                className={styles.collapseBtn}
                onClick={onToggleCollapse}
                title="Collapse Sidebar"
              >
                <ChevronLeft size={16} />
              </button>
            )}
          </div>
        </div>

        <div className={styles.searchBox}>
          <Search size={14} className={styles.searchIcon} />
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search emailers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className={styles.dealsList}>
          {filteredDeals.length === 0 ? (
            <div className={styles.emptyState}>No emailers found</div>
          ) : (
            filteredDeals.map((deal) => {
              const isActive = deal.id === activeDealId;
              const folderName = deal.folder_name || deal.folderName || "Untitled Folder";
              const emailTitle = deal.email_title || deal.title || "Untitled Deal";

              return (
                <div
                  key={deal.id}
                  className={`${styles.dealItem} ${isActive ? styles.active : ""}`}
                  onClick={() => onSelectDeal(deal)}
                >
                  <div className={styles.dealInfo}>
                    <div className={styles.dealHeader}>
                      <Folder size={14} className={styles.folderIcon} />
                      <span className={styles.folderName}>{folderName}</span>
                    </div>
                    <div className={styles.dealTitle}>{emailTitle}</div>
                    <div className={styles.dealDate}>
                      <Clock size={11} />
                      <span>{formatDate(deal.updated_at || deal.created_at || deal.lastModified)}</span>
                    </div>
                  </div>

                  <button
                    className={styles.deleteBtn}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm(`Delete "${folderName}"?`)) {
                        onDeleteDeal(deal.id, deal);
                      }
                    }}
                    title="Delete emailer"
                  >
                    <X size={14} />
                  </button>
                </div>
              );
            })
          )}
        </div>
      </aside>
    </div>
  );
}
