// Minimal bech32 (BIP-173, as NIP-19 uses it) for the two conversions Nostr needs: an
// `npub…` identity → a 32-byte hex pubkey (for relay `authors` filters), and a 32-byte
// event id → a `note1…` string (for a njump.me permalink). No dependency; ~60 lines.

const CHARSET = "qpzry9x8gf2tvdw0s3jn54khce6mua7l";
const GEN = [0x3b6a57b2, 0x26508e6d, 0x1ea119fa, 0x3d4233dd, 0x2a1462b3];

function polymod(values: number[]): number {
  let chk = 1;
  for (const v of values) {
    const top = chk >> 25;
    chk = ((chk & 0x1ffffff) << 5) ^ v;
    for (let i = 0; i < 5; i++) if ((top >> i) & 1) chk ^= GEN[i];
  }
  return chk;
}

function hrpExpand(hrp: string): number[] {
  const out: number[] = [];
  for (let i = 0; i < hrp.length; i++) out.push(hrp.charCodeAt(i) >> 5);
  out.push(0);
  for (let i = 0; i < hrp.length; i++) out.push(hrp.charCodeAt(i) & 31);
  return out;
}

function verifyChecksum(hrp: string, data: number[]): boolean {
  return polymod(hrpExpand(hrp).concat(data)) === 1;
}

function createChecksum(hrp: string, data: number[]): number[] {
  const values = hrpExpand(hrp).concat(data).concat([0, 0, 0, 0, 0, 0]);
  const mod = polymod(values) ^ 1;
  const out: number[] = [];
  for (let i = 0; i < 6; i++) out.push((mod >> (5 * (5 - i))) & 31);
  return out;
}

// Convert between bit groups (5↔8), the core of bech32 payload packing.
function convertBits(data: number[], from: number, to: number, pad: boolean): number[] | null {
  let acc = 0;
  let bits = 0;
  const out: number[] = [];
  const maxv = (1 << to) - 1;
  for (const value of data) {
    if (value < 0 || value >> from !== 0) return null;
    acc = (acc << from) | value;
    bits += from;
    while (bits >= to) {
      bits -= to;
      out.push((acc >> bits) & maxv);
    }
  }
  if (pad) {
    if (bits > 0) out.push((acc << (to - bits)) & maxv);
  } else if (bits >= from || ((acc << (to - bits)) & maxv)) {
    return null;
  }
  return out;
}

function toHex(bytes: number[]): string {
  return bytes.map((b) => b.toString(16).padStart(2, "0")).join("");
}
function fromHex(hex: string): number[] {
  const out: number[] = [];
  for (let i = 0; i < hex.length; i += 2) out.push(parseInt(hex.slice(i, i + 2), 16));
  return out;
}

// Decode a bech32 string → { prefix, hex } for the simple TLV-less types (npub, note).
// Returns null on any malformed input (bad checksum, bad chars, wrong length).
export function bech32ToHex(str: string): { prefix: string; hex: string } | null {
  const s = str.toLowerCase().trim();
  const pos = s.lastIndexOf("1");
  if (pos < 1 || pos + 7 > s.length) return null;
  const prefix = s.slice(0, pos);
  const dataChars = s.slice(pos + 1);
  const data: number[] = [];
  for (const ch of dataChars) {
    const v = CHARSET.indexOf(ch);
    if (v === -1) return null;
    data.push(v);
  }
  if (!verifyChecksum(prefix, data)) return null;
  const payload = data.slice(0, -6);
  const bytes = convertBits(payload, 5, 8, false);
  if (!bytes || bytes.length !== 32) return null;
  return { prefix, hex: toHex(bytes) };
}

// Encode a 32-byte hex value under a prefix → a bech32 string (e.g. note1…).
export function hexToBech32(prefix: string, hex: string): string {
  const words = convertBits(fromHex(hex), 8, 5, true);
  if (!words) throw new Error("bad hex for bech32");
  const combined = words.concat(createChecksum(prefix, words));
  return prefix + "1" + combined.map((w) => CHARSET[w]).join("");
}

// npub… → 32-byte x-only pubkey hex, or null if it isn't a valid npub.
export function npubToHex(npub: string): string | null {
  const d = bech32ToHex(npub);
  return d && d.prefix === "npub" ? d.hex : null;
}

// event id hex → note1… (for a human-facing permalink).
export function noteId(eventIdHex: string): string {
  return hexToBech32("note", eventIdHex);
}
