"use client";

// MODULES //
import { useState, useEffect, useMemo } from "react";

// COMPONENTS //
import HeaderNav from "@/components/HeaderNav/HeaderNav";
import ToastNotification from "@/components/ToastNotification/ToastNotification";

// SECTIONS //
import DealsSidebar from "@/sections/DealsSidebar/DealsSidebar";
import StudioEditor from "@/sections/StudioEditor/StudioEditor";
import StudioPreview from "@/sections/StudioPreview/StudioPreview";

// SERVICES //
import { mailerService } from "@/services/mailerService";
import { storageService } from "@/services/storageService";

// UTILS //
import { generateEmailerHtml } from "@/utils/templateGenerator";

// STYLES //
import styles from "./Studio.module.scss";

export default function StudioPage() {
  const [deals, setDeals] = useState([]);
  const [activeDeal, setActiveDeal] = useState(null);
  const [originUrl, setOriginUrl] = useState("https://emailer-automate.vercel.app");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [toast, setToast] = useState(null);

  // Initialize deals and keep canonical Vercel origin
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.location.origin &&
      !window.location.origin.startsWith("file:") &&
      !window.location.origin.includes("localhost") &&
      !window.location.origin.includes("127.0.0.1")
    ) {
      setOriginUrl(window.location.origin);
    } else {
      setOriginUrl("https://emailer-automate.vercel.app");
    }
    const loadedDeals = mailerService.getAllMailers();
    setDeals(loadedDeals);
    if (loadedDeals.length > 0) {
      setActiveDeal(loadedDeals[0]);
    }
  }, []);

  const showToast = (message, type = "info") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Re-generate production HTML (for Copy for Email & Export)
  const htmlContent = useMemo(() => {
    if (!activeDeal) return "";
    return generateEmailerHtml({
      ...activeDeal,
      originUrl,
    });
  }, [activeDeal, originUrl]);

  // Live preview HTML for Studio Preview pane (renders in-memory/base64 banner instantly without broken image)
  const previewHtml = useMemo(() => {
    if (!activeDeal) return "";
    return generateEmailerHtml(
      {
        ...activeDeal,
        originUrl,
      },
      { isLivePreview: true }
    );
  }, [activeDeal, originUrl]);

  // Handle selecting a deal from sidebar
  const handleSelectDeal = (deal) => {
    setActiveDeal(deal);
  };

  // Handle creating a fresh new deal
  const handleNewDeal = () => {
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, "");
    const newDeal = {
      id: `deal_${Date.now()}`,
      brand_id: "brand_avendus",
      brand_slug: "avendus",
      brand: "avendus",
      folder_name: `new_avendus_${dateStr}`,
      folderName: `new_avendus_${dateStr}`,
      email_title: "New Transaction Announcement",
      title: "New Transaction Announcement",
      preview_text: "Discover the latest transaction insights",
      previewText: "Discover the latest transaction insights",
      banner_url: "https://emailer-automate.vercel.app/avendus/deal_KSH_Group/img/bannerNew.jpg",
      bannerUrl: "https://emailer-automate.vercel.app/avendus/deal_KSH_Group/img/bannerNew.jpg",
      body_content: `**New Transaction Announcement**\n\nDear Reader,\n\nAvendus Capital is pleased to announce our latest strategic transaction advisory in India.\n\n**Avendus Capital acted as the exclusive financial advisor on this transaction.**\n\nOur team continues to lead transformative deals across high-growth sectors.\n\nBest regards,\nAvendus Capital Team`,
      content: `**New Transaction Announcement**\n\nDear Reader,\n\nAvendus Capital is pleased to announce our latest strategic transaction advisory in India.\n\n**Avendus Capital acted as the exclusive financial advisor on this transaction.**\n\nOur team continues to lead transformative deals across high-growth sectors.\n\nBest regards,\nAvendus Capital Team`,
      cta_text: "Know More",
      buttonLabel: "Know More",
      cta_url: "https://www.avendus.com",
      buttonLink: "https://www.avendus.com",
      signoff_text: "Best regards,",
      signature_name: "Avendus Capital Team",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const updated = mailerService.saveMailer(newDeal);
    setDeals(mailerService.getAllMailers());
    setActiveDeal(updated);
    showToast(`Created new emailer "${newDeal.folder_name}"!`, "success");
  };

  // Handle deleting a deal
  const handleDeleteDeal = (id) => {
    mailerService.deleteMailer(id);
    const updated = mailerService.getAllMailers();
    setDeals(updated);
    if (activeDeal?.id === id) {
      setActiveDeal(updated[0] || null);
    }
    showToast("Emailer deleted.", "info");
  };

  // Handle saving deal changes (Update Tab)
  const handleSaveDeal = async () => {
    if (!activeDeal) return;

    // Upload banner to folder on server/storage if base64/preview is available
    if (activeDeal.banner_base64 || activeDeal.banner_preview_url) {
      try {
        await storageService.uploadBannerToServer({
          base64: activeDeal.banner_base64,
          brand: activeDeal.brand_slug || activeDeal.brand || "avendus",
          folderName: activeDeal.folder_name || activeDeal.folderName,
          filename: activeDeal.banner_filename || activeDeal.bannerFilename || "bannerNew.jpg",
        });
      } catch (e) {
        console.warn("Upload banner sync notice:", e);
      }
    }

    const saved = mailerService.saveMailer(activeDeal);
    setDeals(mailerService.getAllMailers());
    setActiveDeal(saved);
    showToast(`Saved "${activeDeal.folder_name}" and synced assets!`, "success");
  };

  // Handle generating emailer & uploading banner to folder
  const handleGenerate = async () => {
    if (!activeDeal) return;

    const brand = activeDeal.brand_slug || activeDeal.brand || "avendus";
    const folder = activeDeal.folder_name || activeDeal.folderName || "deal_emailer";
    const filename = activeDeal.banner_filename || activeDeal.bannerFilename || "bannerNew.jpg";

    // Upload banner to folder when clicked Generate
    if (activeDeal.banner_base64 || activeDeal.banner_preview_url) {
      try {
        await storageService.uploadBannerToServer({
          base64: activeDeal.banner_base64,
          brand,
          folderName: folder,
          filename,
        });
      } catch (e) {
        console.warn("Upload banner notice on generate:", e);
      }
    }

    const saved = mailerService.saveMailer(activeDeal);
    setDeals(mailerService.getAllMailers());
    setActiveDeal(saved);
    showToast(`Banner uploaded to /${brand}/${folder}/img/${filename} and emailer generated!`, "success");
  };

  return (
    <div className={styles.studioContainer}>
      <HeaderNav
        brandName="Avendus Capital"
        originUrl={originUrl}
        onOriginChange={setOriginUrl}
        showSidebarToggle={true}
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
      />

      <div className={styles.workspace}>
        <DealsSidebar
          deals={deals}
          activeDealId={activeDeal?.id}
          onSelectDeal={handleSelectDeal}
          onNewDeal={handleNewDeal}
          onDeleteDeal={handleDeleteDeal}
          isCollapsed={!isSidebarOpen}
          onToggleCollapse={() => setIsSidebarOpen((prev) => !prev)}
        />

        {activeDeal && (
          <>
            <StudioEditor
              deal={activeDeal}
              onChange={setActiveDeal}
              onSave={handleSaveDeal}
              onGenerate={handleGenerate}
            />

            <StudioPreview
              deal={activeDeal}
              htmlContent={htmlContent}
              previewHtml={previewHtml}
              onNotify={showToast}
            />
          </>
        )}
      </div>

      <ToastNotification toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
