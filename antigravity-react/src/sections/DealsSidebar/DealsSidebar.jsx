"use client";

// MODULES //
import { useState } from "react";
import { Folder, Plus, Search, Clock, X } from "lucide-react";

// STYLES //
import styles from "./DealsSidebar.module.scss";

export default function DealsSidebar({
  deals = [],
  activeDealId,
  onSelectDeal,
  onNewDeal,
  onDeleteDeal,
  isCollapsed = false,
}) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredDeals = deals.filter((deal) => {
    const q = searchQuery.toLowerCase();
    const folder = (deal.folder_name || "").toLowerCase();
    const title = (deal.email_title || "").toLowerCase();
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
    <aside className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ""}`}>
      <div className={styles.topBar}>
        <div className={styles.title}>
          <Folder size={16} className={styles.folderIcon} />
          <span>Saved Deals</span>
        </div>
        <button className={styles.newBtn} onClick={onNewDeal} title="Create New Emailer">
          <Plus size={14} />
          <span>New</span>
        </button>
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
            return (
              <div
                key={deal.id}
                className={`${styles.dealItem} ${isActive ? styles.active : ""}`}
                onClick={() => onSelectDeal(deal)}
              >
                <div className={styles.dealInfo}>
                  <div className={styles.dealHeader}>
                    <Folder size={14} className={styles.folderIcon} />
                    <span className={styles.folderName}>{deal.folder_name}</span>
                  </div>
                  <div className={styles.dealTitle}>{deal.email_title || "Untitled Deal"}</div>
                  <div className={styles.dealDate}>
                    <Clock size={11} />
                    <span>{formatDate(deal.updated_at || deal.created_at)}</span>
                  </div>
                </div>

                <button
                  className={styles.deleteBtn}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm(`Delete "${deal.folder_name}"?`)) {
                      onDeleteDeal(deal.id);
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
  );
}
