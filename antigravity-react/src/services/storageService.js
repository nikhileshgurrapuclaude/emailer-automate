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
   * @returns {Promise<{ url: string, serverPath: string, previewUrl: string, filename: string, base64: string }>}
   */
  async uploadBanner(file, brand = 'avendus', folderName = 'deal_emailer') {
    if (!file) throw new Error('No file selected.');

    const cleanFilename = file.name
      .replace(/[^a-zA-Z0-9._-]/g, '_')
      .replace(/\s+/g, '_');

    // Convert file to Base64 data URL for instant resilient preview and ZIP packaging
    const base64 = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });

    const objectUrl = URL.createObjectURL(file);
    const cleanBrand = (brand || 'avendus').toLowerCase();
    const cleanFolder = (folderName || 'deal_emailer').trim();

    // The canonical server path - matching all other image links
    const serverPath = `/${cleanBrand}/${cleanFolder}/img/${cleanFilename}`;

    // Upload directly to server route /api/upload
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('brand', cleanBrand);
      formData.append('folder', cleanFolder);
      formData.append('filename', cleanFilename);

      await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
    } catch (uploadErr) {
      console.warn('Server upload notice:', uploadErr);
    }

    return {
      url: serverPath,
      serverPath: serverPath,
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
   * Upload banner to server via base64 or file (e.g. when clicked Generate or Update Tab)
   */
  async uploadBannerToServer({ file, base64, brand = 'avendus', folderName = 'deal_emailer', filename = 'banner.jpg' }) {
    const cleanBrand = (brand || 'avendus').toLowerCase();
    const cleanFolder = (folderName || 'deal_emailer').trim();
    const cleanFilename = (filename || 'banner.jpg').replace(/[^a-zA-Z0-9._-]/g, '_');
    const serverPath = `/${cleanBrand}/${cleanFolder}/img/${cleanFilename}`;

    try {
      const formData = new FormData();
      if (file) {
        formData.append('file', file);
      } else if (base64) {
        formData.append('base64', base64);
      }
      formData.append('brand', cleanBrand);
      formData.append('folder', cleanFolder);
      formData.append('filename', cleanFilename);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      return {
        success: data?.success || true,
        serverPath: data?.serverPath || serverPath,
        url: data?.url || serverPath,
      };
    } catch (err) {
      console.warn('Banner upload to server returned:', err);
      return {
        success: false,
        serverPath,
        url: serverPath,
      };
    }
  },

  /**
   * Resolve public master footer asset URL
   */
  getFooterAssetUrl(brand = 'avendus', filename) {
    const origin = process.env.NEXT_PUBLIC_APP_ORIGIN || 'https://emailer-automate.vercel.app';
    const cleanBrand = (brand || 'avendus').toLowerCase();
    return `${origin}/${cleanBrand}/img/${filename}`;
  },
};

export const storageService = StorageService;
export default StorageService;
