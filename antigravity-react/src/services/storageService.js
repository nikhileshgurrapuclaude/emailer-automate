/**
 * Storage Service
 * Handles file uploads, image asset paths, and CDN URL resolution.
 * Ready for direct Supabase Storage bucket integration in the final step.
 */

export const StorageService = {
  /**
   * Upload or process a banner file
   * @param {File} file
   * @param {string} brand
   * @param {string} folderName
   * @returns {Promise<{ url: string, filename: string, base64: string }>}
   */
  async uploadBanner(file, brand = 'avendus', folderName = 'deal_emailer') {
    if (!file) throw new Error('No file selected.');

    const cleanFilename = file.name
      .replace(/[^a-zA-Z0-9._-]/g, '_')
      .replace(/\s+/g, '_');

    // Convert file to Base64 data URL for instant resilient preview
    const base64 = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });

    const objectUrl = URL.createObjectURL(file);

    return {
      url: base64,
      previewUrl: objectUrl,
      filename: cleanFilename,
      base64: base64,
    };
  },

  /**
   * Upload image helper (compatible with options object)
   */
  async uploadImage({ file, brandSlug = 'avendus', folderName = 'deal_emailer' }) {
    return this.uploadBanner(file, brandSlug, folderName);
  },

  /**
   * Resolve public master footer asset URL
   */
  getFooterAssetUrl(brand = 'avendus', filename) {
    const origin = process.env.NEXT_PUBLIC_APP_ORIGIN || 'https://emailer-automate-antigravity-html.vercel.app';
    const cleanBrand = (brand || 'avendus').toLowerCase();
    return `${origin}/${cleanBrand}/deal_KSH_Group/img/${filename}`;
  },
};

export const storageService = StorageService;
export default StorageService;
