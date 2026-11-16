/**
 * Zero-dependency In-Browser ZIP Archive Generator
 * Supports files, folders, binary data (Blobs, Uint8Array), and text.
 * Falls back to JSZip if available on window, otherwise uses native pure-JS ZIP writer.
 */
class SimpleZip {
  constructor() {
    this.files = [];
  }

  // Add text or binary file to zip
  // path: string (e.g. "avendus/deal_KSH_Group/index.html")
  // content: string | Blob | Uint8Array | ArrayBuffer
  async file(path, content) {
    let data;
    if (content instanceof Blob) {
      data = new Uint8Array(await content.arrayBuffer());
    } else if (content instanceof ArrayBuffer) {
      data = new Uint8Array(content);
    } else if (content instanceof Uint8Array) {
      data = content;
    } else if (typeof content === 'string') {
      const encoder = new TextEncoder();
      data = encoder.encode(content);
    } else {
      throw new Error(`Unsupported content type for file ${path}`);
    }

    this.files.push({
      path: path.replace(/^\//, ''),
      data: data,
      time: new Date()
    });
  }

  // Generate ZIP Blob
  async generateAsync() {
    if (window.JSZip) {
      const zip = new window.JSZip();
      for (const f of this.files) {
        zip.file(f.path, f.data);
      }
      return await zip.generateAsync({ type: 'blob' });
    }

    return this._createPureZipBlob();
  }

  // Pure JavaScript ZIP Format (Standard PKZIP spec)
  _createPureZipBlob() {
    const localFileHeaders = [];
    const centralDirHeaders = [];
    let currentOffset = 0;

    for (const file of this.files) {
      const filenameBytes = new TextEncoder().encode(file.path);
      const fileData = file.data;
      const crc = this._crc32(fileData);
      const modTime = this._dosDateTime(file.time);

      // Local file header (30 bytes + filename + data)
      const localHeader = new Uint8Array(30 + filenameBytes.length);
      const view = new DataView(localHeader.buffer);
      view.setUint32(0, 0x04034b50, true); // Signature PK\x03\x04
      view.setUint16(4, 20, true);         // Version needed
      view.setUint16(6, 0x0800, true);     // General flags (UTF-8)
      view.setUint16(8, 0, true);          // Compression method (0 = Store)
      view.setUint16(10, modTime.time, true);
      view.setUint16(12, modTime.date, true);
      view.setUint32(14, crc, true);       // CRC-32
      view.setUint32(18, fileData.length, true); // Compressed size
      view.setUint32(22, fileData.length, true); // Uncompressed size
      view.setUint16(26, filenameBytes.length, true);
      view.setUint16(28, 0, true);         // Extra field length
      localHeader.set(filenameBytes, 30);

      localFileHeaders.push(localHeader);
      localFileHeaders.push(fileData);

      // Central directory header (46 bytes + filename)
      const centralHeader = new Uint8Array(46 + filenameBytes.length);
      const cView = new DataView(centralHeader.buffer);
      cView.setUint32(0, 0x02014b50, true); // Signature PK\x01\x02
      cView.setUint16(4, 20, true);         // Version made by
      cView.setUint16(6, 20, true);         // Version needed
      cView.setUint16(8, 0x0800, true);     // UTF-8
      cView.setUint16(10, 0, true);         // Store
      cView.setUint16(12, modTime.time, true);
      cView.setUint16(14, modTime.date, true);
      cView.setUint32(16, crc, true);
      cView.setUint32(20, fileData.length, true);
      cView.setUint32(24, fileData.length, true);
      cView.setUint16(28, filenameBytes.length, true);
      cView.setUint16(30, 0, true);         // Extra length
      cView.setUint16(32, 0, true);         // Comment length
      cView.setUint16(34, 0, true);         // Disk start
      cView.setUint16(36, 0, true);         // Internal attributes
      cView.setUint32(38, 0, true);         // External attributes
      cView.setUint32(42, currentOffset, true); // Relative offset of local header
      centralHeader.set(filenameBytes, 46);

      centralDirHeaders.push(centralHeader);

      currentOffset += localHeader.length + fileData.length;
    }

    // End of Central Directory Record (22 bytes)
    const centralDirSize = centralDirHeaders.reduce((sum, h) => sum + h.length, 0);
    const eocd = new Uint8Array(22);
    const eView = new DataView(eocd.buffer);
    eView.setUint32(0, 0x06054b50, true); // Signature PK\x05\x06
    eView.setUint16(4, 0, true);          // Disk number
    eView.setUint16(6, 0, true);          // Start disk
    eView.setUint16(8, this.files.length, true);  // Entries on disk
    eView.setUint16(10, this.files.length, true); // Total entries
    eView.setUint32(12, centralDirSize, true);    // Size of central dir
    eView.setUint32(16, currentOffset, true);     // Offset of start of central dir
    eView.setUint16(20, 0, true);         // Comment length

    const parts = [...localFileHeaders, ...centralDirHeaders, eocd];
    return new Blob(parts, { type: 'application/zip' });
  }

  _dosDateTime(date) {
    const d = date || new Date();
    const time = (d.getHours() << 11) | (d.getMinutes() << 5) | (d.getSeconds() >> 1);
    const dosDate = ((d.getFullYear() - 1980) << 9) | ((d.getMonth() + 1) << 5) | d.getDate();
    return { time, date: dosDate };
  }

  _crc32(bytes) {
    let crc = 0 ^ (-1);
    for (let i = 0; i < bytes.length; i++) {
      crc = (crc >>> 8) ^ SimpleZip._crcTable[(crc ^ bytes[i]) & 0xFF];
    }
    return (crc ^ (-1)) >>> 0;
  }
}

SimpleZip._crcTable = (() => {
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) {
      c = ((c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
    }
    table[i] = c;
  }
  return table;
})();

window.SimpleZip = SimpleZip;
