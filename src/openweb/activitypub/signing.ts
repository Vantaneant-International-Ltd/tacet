// HTTP Signatures for AUTHORIZED FETCH — signed GET requests that let stricter homes
// (e.g. Mastodon "secure mode") serve publicly-readable content. This is the ONLY
// cryptographic surface in the adapter, and it is deliberately narrow:
//
//   • read-only: it signs GET requests only. There is no POST, no delivery, no inbox
//     processing, no user authentication, no publishing.
//   • it presents a SERVER actor (not a user) whose public key the remote home fetches
//     to verify the signature. That's the whole mechanism.
//   • it is entirely optional: with no key configured, the adapter makes unsigned GETs
//     exactly as before.
//
// Signs the draft-cavage "(request-target) host date" set with RSASSA-PKCS1-v1_5/SHA-256.

export interface RequestSigner {
  keyId: string;
  // Returns the headers to add to a GET request to `url`.
  sign(method: string, url: string): Promise<Record<string, string>>;
}

// The exact string that gets signed. Pure and deterministic — unit-tested.
export function buildSigningString(method: string, url: URL, date: string): string {
  const target = `${method.toLowerCase()} ${url.pathname}${url.search}`;
  return `(request-target): ${target}\nhost: ${url.host}\ndate: ${date}`;
}

function pemToArrayBuffer(pem: string): ArrayBuffer {
  const b64 = pem
    .replace(/-----BEGIN [A-Z ]+-----/g, "")
    .replace(/-----END [A-Z ]+-----/g, "")
    .replace(/\s+/g, "");
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes.buffer;
}

function bufferToBase64(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf);
  let bin = "";
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin);
}

// Build a signer from a PKCS#8 private-key PEM. The CryptoKey is imported lazily and
// cached. `keyId` is the actor's key URL (e.g. https://tacet.social/…/actor#main-key).
export function makeRsaSigner(keyId: string, privateKeyPem: string): RequestSigner {
  let keyPromise: Promise<CryptoKey> | null = null;
  const getKey = () => {
    if (!keyPromise) {
      keyPromise = crypto.subtle.importKey(
        "pkcs8",
        pemToArrayBuffer(privateKeyPem),
        { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
        false,
        ["sign"],
      );
    }
    return keyPromise;
  };

  return {
    keyId,
    async sign(method: string, url: string): Promise<Record<string, string>> {
      const u = new URL(url);
      const date = new Date().toUTCString();
      const signingString = buildSigningString(method, u, date);
      const key = await getKey();
      const sig = await crypto.subtle.sign(
        "RSASSA-PKCS1-v1_5",
        key,
        new TextEncoder().encode(signingString),
      );
      const signature = bufferToBase64(sig);
      const header =
        `keyId="${keyId}",algorithm="rsa-sha256",` +
        `headers="(request-target) host date",signature="${signature}"`;
      return { date, signature: header };
    },
  };
}

// Build the signer from Worker env, or undefined when unconfigured (→ unsigned fetch).
export function makeSignerFromEnv(env: {
  AP_ACTOR_ID?: string;
  AP_PRIVATE_KEY?: string;
}): RequestSigner | undefined {
  if (!env.AP_ACTOR_ID || !env.AP_PRIVATE_KEY) return undefined;
  return makeRsaSigner(`${env.AP_ACTOR_ID}#main-key`, env.AP_PRIVATE_KEY);
}
