// In-memory persistent cache for server-rendered emailer HTMLs
if (!globalThis.__emailerHtmlStore) {
  globalThis.__emailerHtmlStore = new Map();
}

export function saveEmailerHtml(brand, folder, html) {
  if (!brand || !folder || !html) return;
  const key = `${brand.toLowerCase().trim()}_${folder.trim()}`;
  globalThis.__emailerHtmlStore.set(key, html);
}

export function getEmailerHtml(brand, folder) {
  if (!brand || !folder) return null;
  const key = `${brand.toLowerCase().trim()}_${folder.trim()}`;
  return globalThis.__emailerHtmlStore.get(key) || null;
}

export function deleteEmailerHtml(brand, folder) {
  if (!brand || !folder) return;
  const key = `${brand.toLowerCase().trim()}_${folder.trim()}`;
  globalThis.__emailerHtmlStore.delete(key);
}
