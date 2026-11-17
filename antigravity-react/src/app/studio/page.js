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

// UTILS //
import { generateEmailerHtml } from "@/utils/templateGenerator";

// STYLES //
import styles from "./Studio.module.scss";

export default function StudioPage() {
  const [deals, setDeals] = useState([]);
  const [activeDeal, setActiveDeal] = useState(null);
  const [originUrl, setOriginUrl] = useState("https://emailer-automate-antigravity-html.vercel.app");
  const [toast, setToast] = useState(null);

  // Initialize deals on client mount
  useEffect(() => {
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

  // Re-generate HTML when activeDeal or originUrl changes
  const htmlContent = useMemo(() => {
    if (!activeDeal) return "";
    return generateEmailerHtml({
      ...activeDeal,
      originUrl,
    });
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
      folder_name: `new_avendus_${dateStr}`,
      email_title: "New Transaction Announcement",
      preview_text: "Discover the latest transaction insights",
      banner_url: "/avendus/img/bannerNew.jpg",
      body_content: `**New Transaction Announcement**\n\nDear Reader,\n\nAvendus Capital is pleased to announce our latest strategic transaction advisory in India.\n\n**Avendus Capital acted as the exclusive financial advisor on this transaction.**\n\nOur team continues to lead transformative deals across high-growth sectors.\n\nBest regards,\nAvendus Capital Team`,
      cta_text: "Know More",
      cta_url: "https://www.avendus.com",
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

  // Handle saving deal changes
  const handleSaveDeal = () => {
    if (!activeDeal) return;
    const saved = mailerService.saveMailer(activeDeal);
    setDeals(mailerService.getAllMailers());
    setActiveDeal(saved);
    showToast(`Saved "${activeDeal.folder_name}" successfully!`, "success");
  };

  return (
    <div className={styles.studioContainer}>
      <HeaderNav
        brandName="Avendus Capital"
        originUrl={originUrl}
        onOriginChange={setOriginUrl}
      />

      <div className={styles.workspace}>
        <DealsSidebar
          deals={deals}
          activeDealId={activeDeal?.id}
          onSelectDeal={handleSelectDeal}
          onNewDeal={handleNewDeal}
          onDeleteDeal={handleDeleteDeal}
        />

        {activeDeal && (
          <>
            <StudioEditor
              deal={activeDeal}
              onChange={setActiveDeal}
              onSave={handleSaveDeal}
              onGenerate={() => showToast("HTML preview updated!", "success")}
            />

            <StudioPreview
              deal={activeDeal}
              htmlContent={htmlContent}
              onNotify={showToast}
            />
          </>
        )}
      </div>

      <ToastNotification toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
