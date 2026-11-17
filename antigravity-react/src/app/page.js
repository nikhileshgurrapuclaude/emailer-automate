"use client";

// MODULES //
import { useState, useEffect } from "react";
import Link from "next/link";
import { Folder, Clock, ArrowRight } from "lucide-react";

// COMPONENTS //
import HeaderNav from "@/components/HeaderNav/HeaderNav";
import BrandCard from "@/components/BrandCard/BrandCard";

// SERVICES //
import { mailerService } from "@/services/mailerService";

// STYLES //
import styles from "@/styles/pages/Home.module.scss";

export default function HomePage() {
  const [recentDeals, setRecentDeals] = useState([]);

  useEffect(() => {
    setRecentDeals(mailerService.getAllMailers());
  }, []);

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
    <div className={styles.homeContainer}>
      <HeaderNav brandName="Brand Workspace Hub" />

      <main className={styles.mainContent}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <div className={styles.pillBadge}>
            <span>✦</span>
            <span>Email Platform</span>
          </div>
          <h1 className={styles.title}>
            Emailer <span className={styles.highlight}>Automation</span> Studio
          </h1>
          <p className={styles.subtitle}>
            Select a brand workspace to create, format, preview, and export 100% client-compliant
            HTML emailers with custom assets.
          </p>
        </section>

        {/* Brand Workspaces Grid */}
        <section className={styles.brandGrid}>
          <BrandCard
            id="avendus"
            title="Avendus Emailer"
            badgeText="ACTIVE & READY"
            badgeType="active"
            description="Formal M&A deal announcements, quarterly ECM updates, and research newsletters with verified Outlook-compliant tables."
            tags={["5 Templates", "IB Signature", "Single <p>"]}
            href="/studio"
            isActive={true}
            iconType="building"
          />

          <BrandCard
            id="sanctum"
            title="Sanctum Emailer"
            badgeText="COMING SOON"
            badgeType="comingSoon"
            description="Wealth management advisory updates, portfolio digests, and high-net-worth client communications."
            tags={["Sanctum Theme", "AWM Footer"]}
            href="/studio"
            isActive={false}
            iconType="building"
          />

          <BrandCard
            id="custom"
            title="Custom Emailer"
            badgeText="BLANK CANVAS"
            badgeType="blank"
            description="Build custom client email templates with flexible branding, custom signatures, and custom navigation bars."
            tags={["Any Brand", "Custom Footer"]}
            href="/studio"
            isActive={false}
            iconType="sparkles"
          />
        </section>

        {/* Recent Emailers & Quick Edit */}
        {recentDeals.length > 0 && (
          <section className={styles.recentSection}>
            <div className={styles.recentHeader}>
              <h2 className={styles.recentTitle}>
                <Folder size={22} color="#FED430" />
                <span>Recent Emailers &amp; Quick Edit</span>
              </h2>
              <span className={styles.recentSubtitle}>Saved in your browser</span>
            </div>

            <div className={styles.recentGrid}>
              {recentDeals.map((deal) => (
                <Link key={deal.id} href="/studio" className={styles.recentCard}>
                  <div>
                    <div className={styles.recentFolderName}>
                      <Folder size={16} color="#FED430" />
                      <span>{deal.folder_name}</span>
                    </div>
                    <div className={styles.recentEmailTitle}>
                      {deal.email_title || "Untitled Deal"}
                    </div>
                  </div>
                  <div className={styles.recentMeta}>
                    <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
                      <Clock size={12} />
                      {formatDate(deal.updated_at || deal.created_at)}
                    </span>
                    <span className={styles.openBadge}>
                      <span>Open</span>
                      <ArrowRight size={13} />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
