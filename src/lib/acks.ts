// The fixed acknowledgment vocabulary (lockfile §10, Amendment 1). Three words, no
// opposite. Stored as tokens; the client renders the display labels.
export const ACK_WORDS = ["seen", "with_you", "more"] as const;
export type AckWord = (typeof ACK_WORDS)[number];

export function isAckWord(x: unknown): x is AckWord {
  return typeof x === "string" && (ACK_WORDS as readonly string[]).includes(x);
}
