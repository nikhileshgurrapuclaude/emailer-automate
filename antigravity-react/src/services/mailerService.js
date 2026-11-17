/**
 * Mailer Service
 * Manages emailer drafts, deals, and persistent storage.
 * Designed for modular backend integration (Supabase in final step).
 */

import { SEED_DEALS } from "@/data/seedDeals";

const STORAGE_KEY = "emailer_studio_deals_v4";

export const MailerService = {
  // Fetch all saved mailers
  getAllMailers() {
    if (typeof window === "undefined") {
      return [...SEED_DEALS];
    }

    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn("Storage retrieval warning:", e);
    }

    this.saveAllMailers(SEED_DEALS);
    return [...SEED_DEALS];
  },

  // Save full mailers array
  saveAllMailers(deals) {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(deals));
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
    const updated = {
      ...mailer,
      updated_at: new Date().toISOString(),
    };

    const existingIndex = deals.findIndex(
      (d) => d.id === mailer.id || d.folder_name === mailer.folder_name
    );

    if (existingIndex >= 0) {
      deals[existingIndex] = updated;
    } else {
      deals.unshift(updated);
    }

    this.saveAllMailers(deals);
    return updated;
  },

  // Create empty template
  createBlankMailer(folderName = "new_deal", brand = "avendus") {
    return {
      id: `deal_${Date.now()}`,
      brand_id: `brand_${brand}`,
      brand_slug: brand,
      folder_name: folderName,
      email_title: "New Transaction Announcement",
      preview_text: "Discover the latest transaction insights",
      banner_url: `/${brand}/img/bannerNew.jpg`,
      body_content: `**New Transaction Announcement**\n\nDear Reader,\n\nAvendus Capital is pleased to announce our latest strategic transaction advisory in India.\n\n**Avendus Capital acted as the exclusive financial advisor on this transaction.**\n\nOur team continues to lead transformative deals across high-growth sectors.\n\nBest regards,\nAvendus Capital Team`,
      cta_text: "Know More",
      cta_url: "https://www.avendus.com",
      signoff_text: "Best regards,",
      signature_name: "Avendus Capital Team",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
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
