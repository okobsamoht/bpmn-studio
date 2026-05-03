/**
 * Generates PNG icons at all required sizes, plus .ico (Windows) and
 * an .iconset directory (macOS — run iconutil separately in CI).
 * Zero extra dependencies: uses only Node's built-in zlib.
 */
const zlib = require('zlib');
const fs = require('fs');
const path = require('path');

// ── CRC32 ────────────────────────────────────────────────────────────────────
const crcTable = new Uint32Array(256);
for (let i = 0; i < 256; i++) {
  let c = i;
  for (let k = 0; k < 8; k++) c = (c & 1) ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  crcTable[i] = c;
}
function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}
function pngChunk(type, data) {
  const t = Buffer.from(type);
  const l = Buffer.alloc(4); l.writeUInt32BE(data.length);
  const cr = Buffer.alloc(4); cr.writeUInt32BE(crc32(Buffer.concat([t, data])));
  return Buffer.concat([l, t, data, cr]);
}

// ── Draw icon pixel (indigo bg, white BPMN cross+circle symbol) ──────────────
function pixel(nx, ny) {
  // nx, ny: 0..1, centered at 0.5
  const cx = 0.5, cy = 0.5;
  const ax = Math.abs(nx - cx), ay = Math.abs(ny - cy);

  // Rounded-rect bounds (radius 21%)
  const rr = 0.21;
  const inRR =
    (ax <= 0.5 - rr && ay <= 0.5) ||
    (ay <= 0.5 - rr && ax <= 0.5) ||
    (ax > 0.5 - rr && ay > 0.5 - rr &&
     (ax - (0.5 - rr)) ** 2 + (ay - (0.5 - rr)) ** 2 <= rr ** 2);

  if (!inRR) return null; // transparent

  // White cross bars
  const bar = 0.055, ext = 0.27;
  if ((Math.abs(ny - cy) < bar && Math.abs(nx - cx) < ext) ||
      (Math.abs(nx - cx) < bar && Math.abs(ny - cy) < ext)) {
    return [255, 255, 255, 255];
  }

  // White circle ring
  const d = Math.sqrt((nx - cx) ** 2 + (ny - cy) ** 2);
  if (d < 0.13 && d > 0.09) return [255, 255, 255, 255];
  if (d < 0.055)             return [255, 255, 255, 255];

  return [0x4f, 0x46, 0xe5, 255]; // indigo #4f46e5
}

// ── Build a PNG buffer at given size ─────────────────────────────────────────
function buildPNG(size) {
  const rows = [];
  for (let y = 0; y < size; y++) {
    const row = Buffer.alloc(1 + size * 4);
    row[0] = 0; // filter: None
    for (let x = 0; x < size; x++) {
      const nx = size === 1 ? 0.5 : x / (size - 1);
      const ny = size === 1 ? 0.5 : y / (size - 1);
      const px = pixel(nx, ny) || [0, 0, 0, 0];
      row.set(px, 1 + x * 4);
    }
    rows.push(row);
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; ihdr[9] = 6; // RGBA

  const idat = zlib.deflateSync(Buffer.concat(rows), { level: 9 });
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  return Buffer.concat([
    sig,
    pngChunk('IHDR', ihdr),
    pngChunk('IDAT', idat),
    pngChunk('IEND', Buffer.alloc(0))
  ]);
}

// ── Create .ico with a 256x256 PNG payload ───────────────────────────────────
function buildICO(png256) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);  // type: 1 = ICO
  header.writeUInt16LE(1, 4);  // image count

  const entry = Buffer.alloc(16);
  entry[0] = 0; entry[1] = 0; entry[2] = 0; entry[3] = 0; // 256×256, 0 colors
  entry.writeUInt16LE(1, 4);   // color planes
  entry.writeUInt16LE(32, 6);  // bpp
  entry.writeUInt32LE(png256.length, 8);
  entry.writeUInt32LE(6 + 16, 12); // data offset

  return Buffer.concat([header, entry, png256]);
}

// ── Generate everything ───────────────────────────────────────────────────────
const build = path.join(__dirname, '..', 'build');
const iconsDir = path.join(build, 'icons');
const iconsetDir = path.join(build, 'icon.iconset');
fs.mkdirSync(iconsDir, { recursive: true });
fs.mkdirSync(iconsetDir, { recursive: true });

const sizes = [16, 24, 32, 48, 64, 128, 256, 512, 1024];
const pngs = {};

for (const s of sizes) {
  pngs[s] = buildPNG(s);
  fs.writeFileSync(path.join(iconsDir, `${s}x${s}.png`), pngs[s]);
}

// main icon (512px) used by electron-builder for Linux
fs.writeFileSync(path.join(build, 'icon.png'), pngs[512]);

// Windows ICO
fs.writeFileSync(path.join(build, 'icon.ico'), buildICO(pngs[256]));

// macOS iconset — CI will run: iconutil -c icns build/icon.iconset -o build/icon.icns
const macSizes = [16, 32, 64, 128, 256, 512];
for (const s of macSizes) {
  fs.writeFileSync(path.join(iconsetDir, `icon_${s}x${s}.png`), pngs[s]);
  const s2 = s * 2;
  if (pngs[s2]) fs.writeFileSync(path.join(iconsetDir, `icon_${s}x${s}@2x.png`), pngs[s2]);
}

console.log('Icons generated →', build);
