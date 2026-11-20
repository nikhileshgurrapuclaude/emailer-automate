import { v2 as cloudinary } from "cloudinary";

// Initialize Cloudinary
const cloudName = process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;
const projectFolder = process.env.CLOUDINARY_PROJECT_FOLDER || "emailer-studio";

if (cloudName && apiKey && apiSecret) {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });
}

export function isCloudinaryConfigured() {
  return Boolean(
    cloudName &&
    apiKey &&
    apiSecret &&
    !cloudName.includes("your_") &&
    !apiKey.includes("your_")
  );
}

/**
 * Upload an image buffer to Cloudinary organized by project folder
 * @param {Buffer} buffer - File buffer
 * @param {Object} options - { folder, filename }
 * @returns {Promise<{ success: boolean, url: string, publicId: string }>}
 */
export async function uploadImageToCloudinary(buffer, { folder = "avendus", filename = "banner" }) {
  if (!isCloudinaryConfigured()) {
    return { success: false, error: "Cloudinary credentials not configured" };
  }

  // Prepend project folder so assets stay clean and organized
  const fullFolder = folder.startsWith(projectFolder) ? folder : `${projectFolder}/${folder}`;

  // Strip extension from public_id for Cloudinary
  const publicId = filename.replace(/\.[^/.]+$/, "");

  return new Promise((resolve) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: fullFolder,
        public_id: publicId,
        resource_type: "image",
        overwrite: true,
        invalidate: true,
      },
      (error, result) => {
        if (error) {
          console.error("Cloudinary image upload error:", error);
          resolve({ success: false, error: error.message });
        } else {
          resolve({
            success: true,
            url: result.secure_url,
            publicId: result.public_id,
            format: result.format,
          });
        }
      }
    );
    uploadStream.end(buffer);
  });
}

/**
 * Upload raw HTML content to Cloudinary (for permanent shareable index.html link)
 * @param {string} htmlContent - Full HTML string
 * @param {Object} options - { folder, filename }
 * @returns {Promise<{ success: boolean, url: string }>}
 */
export async function uploadRawHtmlToCloudinary(htmlContent, { folder = "avendus", filename = "index.html" }) {
  if (!isCloudinaryConfigured()) {
    return { success: false, error: "Cloudinary credentials not configured" };
  }

  const fullFolder = folder.startsWith(projectFolder) ? folder : `${projectFolder}/${folder}`;
  const buffer = Buffer.from(htmlContent, "utf-8");

  return new Promise((resolve) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: fullFolder,
        public_id: filename,
        resource_type: "raw",
        overwrite: true,
        invalidate: true,
      },
      (error, result) => {
        if (error) {
          console.error("Cloudinary HTML upload error:", error);
          resolve({ success: false, error: error.message });
        } else {
          resolve({
            success: true,
            url: result.secure_url,
          });
        }
      }
    );
    uploadStream.end(buffer);
  });
}

/**
 * Delete a deal folder and all its assets from Cloudinary
 * @param {string} folder - e.g. "avendus/deal_ArkaFincap"
 * @returns {Promise<{ success: boolean }>}
 */
export async function deleteFolderFromCloudinary(folder) {
  if (!isCloudinaryConfigured() || !folder) {
    return { success: false, error: "Cloudinary credentials not configured" };
  }

  const cleanFolder = folder.replace(/^\/+|\/+$/g, "");
  const fullFolder = cleanFolder.startsWith(projectFolder) ? cleanFolder : `${projectFolder}/${cleanFolder}`;

  try {
    // 1. Delete all images under the folder prefix
    await new Promise((resolve) => {
      cloudinary.api.delete_resources_by_prefix(
        fullFolder,
        { resource_type: "image" },
        (error, result) => {
          if (error) console.warn("Cloudinary delete images notice:", error.message);
          resolve(result);
        }
      );
    });

    // 2. Delete all raw files (e.g. index.html) under the folder prefix
    await new Promise((resolve) => {
      cloudinary.api.delete_resources_by_prefix(
        fullFolder,
        { resource_type: "raw" },
        (error, result) => {
          if (error) console.warn("Cloudinary delete raw notice:", error.message);
          resolve(result);
        }
      );
    });

    // 3. Delete the folder itself
    await new Promise((resolve) => {
      cloudinary.api.delete_folder(fullFolder, (error, result) => {
        if (error) console.warn("Cloudinary delete folder notice:", error.message);
        resolve(result);
      });
    });

    return { success: true };
  } catch (err) {
    console.warn("Delete folder from Cloudinary error:", err.message);
    return { success: false, error: err.message };
  }
}

export default cloudinary;
