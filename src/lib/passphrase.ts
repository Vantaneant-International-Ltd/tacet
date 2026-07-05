import { scrypt } from "@noble/hashes/scrypt";
import { randomBytes } from "@noble/hashes/utils";

// Passphrase hashing with scrypt (lockfile §3: "scrypt via a WebCrypto-compatible lib
// that runs on Workers"). @noble/hashes is pure JS and runs identically on Workers and
// in Node, so the same code hashes at registration and when generating placeholder seed
// data. Stored format: scrypt$N$r$p$saltB64$hashB64.
const N = 16384; // 2^14 — sane cost for the Workers CPU budget
const R = 8;
const P = 1;
const DK_LEN = 32;

function toB64(bytes: Uint8Array): string {
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin);
}

function fromB64(s: string): Uint8Array {
  const bin = atob(s);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

export function hashPassphrase(passphrase: string): string {
  const salt = randomBytes(16);
  const dk = scrypt(new TextEncoder().encode(passphrase), salt, { N, r: R, p: P, dkLen: DK_LEN });
  return `scrypt$${N}$${R}$${P}$${toB64(salt)}$${toB64(dk)}`;
}

export function verifyPassphrase(passphrase: string, stored: string): boolean {
  const parts = stored.split("$");
  if (parts.length !== 6 || parts[0] !== "scrypt") return false;
  const n = Number(parts[1]);
  const r = Number(parts[2]);
  const p = Number(parts[3]);
  const salt = fromB64(parts[4]);
  const expected = fromB64(parts[5]);
  const dk = scrypt(new TextEncoder().encode(passphrase), salt, { N: n, r, p, dkLen: expected.length });
  // constant-time compare
  if (dk.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < dk.length; i++) diff |= dk[i] ^ expected[i];
  return diff === 0;
}
