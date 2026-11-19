/**
 * Mailer Service
 * Manages emailer drafts, deals, and persistent storage.
 * Designed for modular backend integration (Supabase in final step).
 */

import { SEED_DEALS } from "@/data/seedDeals";

const STORAGE_KEY = "emailer_studio_deals_v6";

function normalizeDeal(deal) {
  if (!deal) return null;
  const folder = deal.folder_name || deal.folderName || "new_deal";
  const title = deal.email_title || deal.title || "Transaction Announcement";
  const preview = deal.preview_text || deal.previewText || "";
  const banner = deal.banner_url || deal.bannerUrl || "/avendus/deal_KSH_Group/img/bannerNew.jpg";
  const body = deal.body_content || deal.content || "";
  const ctaText = deal.cta_text || deal.buttonLabel || "Know More";
  const ctaUrl = deal.cta_url || deal.buttonLink || "https://www.avendus.com";
  const signoff = deal.signoff_text || "Best regards,";
  const signature = deal.signature_name || "Avendus Capital Team";
  const brand = deal.brand_slug || deal.brand || "avendus";
  const createdAt = deal.created_at || deal.lastModified || new Date().toISOString();
  const updatedAt = deal.updated_at || deal.lastModified || new Date().toISOString();

  return {
    ...deal,
    id: deal.id || `deal_${Date.now()}`,
    brand_id: deal.brand_id || `brand_${brand}`,
    brand_slug: brand,
    brand: brand,
    folder_name: folder,
    folderName: folder,
    email_title: title,
    title: title,
    preview_text: preview,
    previewText: preview,
    banner_url: banner,
    bannerUrl: banner,
    body_content: body,
    content: body,
    cta_text: ctaText,
    buttonLabel: ctaText,
    cta_url: ctaUrl,
    buttonLink: ctaUrl,
    signoff_text: signoff,
    signature_name: signature,
    created_at: createdAt,
    updated_at: updatedAt,
  };
}

export const MailerService = {
  // Fetch all saved mailers
  getAllMailers() {
    if (typeof window === "undefined") {
      return SEED_DEALS.map(normalizeDeal);
    }

    try {
      // Check current version
      let saved = localStorage.getItem(STORAGE_KEY);
      // Migrate from older versions if necessary
      if (!saved) {
        saved = localStorage.getItem("emailer_studio_deals_v5") ||
                localStorage.getItem("emailer_studio_deals_v4");
      }

      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const normalized = parsed.map(normalizeDeal);
          this.saveAllMailers(normalized);
          return normalized;
        }
      }
    } catch (e) {
      console.warn("Storage retrieval warning:", e);
    }

    const initial = SEED_DEALS.map(normalizeDeal);
    this.saveAllMailers(initial);
    return initial;
  },

  // Save full mailers array
  saveAllMailers(deals) {
    if (typeof window === "undefined") return;
    try {
      const normalized = (deals || []).map(normalizeDeal);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
    } catch (e) {
      console.warn("Storage write warning:", e);
    }
  },

  // Get a single mailer by ID
  getMailerById(id) {
    const deals = this.getAllMailers();
    return deals.find((d) => d.id === id) || null;
  },

  // Save or update a mailer
  saveMailer(mailer) {
    const deals = this.getAllMailers();
    const normalizedMailer = normalizeDeal({
      ...mailer,
      updated_at: new Date().toISOString(),
    });

    const existingIndex = deals.findIndex(
      (d) => d.id === normalizedMailer.id || d.folder_name === normalizedMailer.folder_name
    );

    if (existingIndex >= 0) {
      deals[existingIndex] = normalizedMailer;
    } else {
      deals.unshift(normalizedMailer);
    }

    this.saveAllMailers(deals);
    return normalizedMailer;
  },

  // Create empty template
  createBlankMailer(folderName = "new_deal", brand = "avendus") {
    return normalizeDeal({
      id: `deal_${Date.now()}`,
      brand_id: `brand_${brand}`,
      brand_slug: brand,
      folder_name: folderName,
      email_title: "New Transaction Announcement",
      preview_text: "Discover the latest transaction insights",
      banner_url: `/avendus/deal_KSH_Group/img/bannerNew.jpg`,
      body_content: `**New Transaction Announcement**\n\nDear Reader,\n\nAvendus Capital is pleased to announce our latest strategic transaction advisory in India.\n\n**Avendus Capital acted as the exclusive financial advisor on this transaction.**\n\nOur team continues to lead transformative deals across high-growth sectors.\n\nBest regards,\nAvendus Capital Team`,
      cta_text: "Know More",
      cta_url: "https://www.avendus.com",
      signoff_text: "Best regards,",
      signature_name: "Avendus Capital Team",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
  },

  // Delete a mailer
  deleteMailer(id) {
    const deals = this.getAllMailers();
    const filtered = deals.filter((d) => d.id !== id);
    this.saveAllMailers(filtered);
    return filtered;
  },
};

export const mailerService = MailerService;
export default MailerService;
