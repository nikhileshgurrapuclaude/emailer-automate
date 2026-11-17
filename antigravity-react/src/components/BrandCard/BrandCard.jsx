"use client";

// MODULES //
import Link from "next/link";
import { Building2, Sparkles } from "lucide-react";

// STYLES //
import styles from "./BrandCard.module.scss";

export default function BrandCard({
  id,
  title,
  description,
  badgeText,
  badgeType = "comingSoon", // "active" | "comingSoon" | "blank"
  tags = [],
  href = "/studio",
  isActive = false,
  iconType = "building", // "building" | "sparkles"
}) {
  const getBadgeClass = () => {
    if (badgeType === "active") return styles.activeBadge;
    if (badgeType === "blank") return styles.blankBadge;
    return styles.comingSoonBadge;
  };

  const getIconClass = () => {
    if (iconType === "sparkles") return styles.sparkle;
    if (isActive) return "";
    return styles.neutral;
  };

  return (
    <div className={`${styles.card} ${isActive ? styles.active : styles.disabled}`}>
      <span className={`${styles.badge} ${getBadgeClass()}`}>{badgeText}</span>

      <div>
        <div className={`${styles.iconWrapper} ${getIconClass()}`}>
          {iconType === "sparkles" ? <Sparkles size={22} /> : <Building2 size={22} />}
        </div>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.description}>{description}</p>
        <div className={styles.tags}>
          {tags.map((tag, idx) => (
            <span key={idx} className={styles.tag}>
              {tag}
            </span>
          ))}
        </div>
      </div>

      {isActive ? (
        <Link href={href} className={`${styles.actionBtn} ${styles.primary}`}>
          Open {title.replace(" Emailer", "")} Studio &rarr;
        </Link>
      ) : (
        <button disabled className={`${styles.actionBtn} ${styles.secondary}`}>
          Open {title.replace(" Emailer", "")} Studio
        </button>
      )}
    </div>
  );
}
