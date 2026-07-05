// Insert obviously-fake placeholder data for local development.
//
// Everything here is marked as placeholder: handles and room slugs are prefixed
// `placeholder-`, bodies are tagged [PLACEHOLDER]. None of it is real personal data, and
// `npm run seed:wipe` removes it (see scripts/seed-wipe.sql). Per lockfile §2, placeholder
// data must never reach a deploy.
//
// The passphrase for every placeholder account is: placeholder-passphrase
//
// Run: npm run seed   (applies to the LOCAL simulated D1)

import { execFileSync } from "node:child_process";
import { writeFileSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { ulid } from "../src/lib/ulid.ts";
import { hashPassphrase } from "../src/lib/passphrase.ts";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..");
const PASSPHRASE = "placeholder-passphrase";

// Deterministic-ish increasing timestamps so ULIDs and created_at agree on chronology.
const base = Date.UTC(2026, 0, 1, 9, 0, 0);
let tick = 0;
function stamp() {
  const t = base + tick * 60_000; // one minute apart
  tick += 1;
  return { iso: new Date(t).toISOString(), id: ulid(t) };
}

function q(value) {
  if (value === null || value === undefined) return "NULL";
  return `'${String(value).replace(/'/g, "''")}'`;
}

const sql = [];
sql.push("-- GENERATED placeholder data — do not commit, do not deploy.");

// --- users -----------------------------------------------------------------
const users = [
  { handle: "placeholder-admin", is_admin: 1 },
  { handle: "placeholder-ada", is_admin: 0 },
  { handle: "placeholder-boris", is_admin: 0 },
].map((u) => {
  const s = stamp();
  return { ...u, id: s.id, created_at: s.iso, passphrase_hash: hashPassphrase(PASSPHRASE) };
});
for (const u of users) {
  sql.push(
    `INSERT INTO users (id, handle, passphrase_hash, created_at, is_admin) VALUES (${q(u.id)}, ${q(u.handle)}, ${q(u.passphrase_hash)}, ${q(u.created_at)}, ${u.is_admin});`,
  );
}
const admin = users[0];

// --- rooms -----------------------------------------------------------------
const rooms = [
  { slug: "placeholder-parlour", name: "The Parlour", description: "[PLACEHOLDER] a quiet front room.", default_lens: "timeline" },
  { slug: "placeholder-darkroom", name: "The Darkroom", description: "[PLACEHOLDER] pictures, developing slowly.", default_lens: "grid" },
].map((r) => {
  const s = stamp();
  return { ...r, id: s.id, created_at: s.iso };
});
for (const r of rooms) {
  sql.push(
    `INSERT INTO rooms (id, slug, name, description, default_lens, created_by, created_at) VALUES (${q(r.id)}, ${q(r.slug)}, ${q(r.name)}, ${q(r.description)}, ${q(r.default_lens)}, ${q(admin.id)}, ${q(r.created_at)});`,
  );
}

// --- memberships (all placeholder users in all placeholder rooms) ----------
for (const u of users) {
  for (const r of rooms) {
    const s = stamp();
    sql.push(
      `INSERT INTO memberships (user_id, room_id, joined_at) VALUES (${q(u.id)}, ${q(r.id)}, ${q(s.iso)});`,
    );
  }
}

// --- invites (one spent, one unused) ---------------------------------------
{
  const s1 = stamp();
  sql.push(
    `INSERT INTO invites (code, created_by, used_by, created_at, used_at) VALUES (${q("PLACEHOLDER-USED-0001")}, ${q(admin.id)}, ${q(users[1].id)}, ${q(s1.iso)}, ${q(s1.iso)});`,
  );
  const s2 = stamp();
  sql.push(
    `INSERT INTO invites (code, created_by, used_by, created_at, used_at) VALUES (${q("PLACEHOLDER-OPEN-0002")}, ${q(admin.id)}, NULL, ${q(s2.iso)}, NULL);`,
  );
}

// --- posts + replies -------------------------------------------------------
const parlour = rooms[0];
const bodies = [
  "[PLACEHOLDER] Good morning. Nobody is counting anything here, and that is the point.",
  "[PLACEHOLDER] A thought I did not want to shout: rooms feel calmer than feeds.",
  "[PLACEHOLDER] Testing the timeline lens. Three of these should fill a phone screen.",
];
const posts = bodies.map((body, i) => {
  const s = stamp();
  const author = users[i % users.length];
  return { id: s.id, room_id: parlour.id, author_id: author.id, kind: "text", body, created_at: s.iso };
});
for (const p of posts) {
  sql.push(
    `INSERT INTO posts (id, room_id, author_id, kind, body, image_key, created_at) VALUES (${q(p.id)}, ${q(p.room_id)}, ${q(p.author_id)}, ${q(p.kind)}, ${q(p.body)}, NULL, ${q(p.created_at)});`,
  );
}
// a couple of flat replies on the first post
for (const text of [
  "[PLACEHOLDER] Agreed. It reads like a page, not a chat.",
  "[PLACEHOLDER] Kept this one.",
]) {
  const s = stamp();
  sql.push(
    `INSERT INTO replies (id, post_id, author_id, body, created_at) VALUES (${q(s.id)}, ${q(posts[0].id)}, ${q(users[1].id)}, ${q(text)}, ${q(s.iso)});`,
  );
}
// one keep (private to the keeper)
{
  const s = stamp();
  sql.push(
    `INSERT INTO keeps (user_id, post_id, created_at) VALUES (${q(users[1].id)}, ${q(posts[0].id)}, ${q(s.iso)});`,
  );
}
// a couple of acknowledgments (attributed, room-visible, never counted)
for (const [userIdx, postIdx, word] of [
  [1, 0, "with_you"],
  [2, 0, "seen"],
  [1, 1, "more"],
]) {
  const s = stamp();
  sql.push(
    `INSERT INTO acknowledgments (user_id, post_id, word, created_at) VALUES (${q(users[userIdx].id)}, ${q(posts[postIdx].id)}, ${q(word)}, ${q(s.iso)});`,
  );
}

// --- write + apply ---------------------------------------------------------
const wipe = readFileSync(join(here, "seed-wipe.sql"), "utf8");
const generatedPath = join(here, ".seed.generated.sql");
writeFileSync(generatedPath, wipe + "\n" + sql.join("\n") + "\n");

console.log(`Seeding local D1 with placeholder data (passphrase: ${PASSPHRASE}) ...`);
execFileSync(
  "npx",
  ["wrangler", "d1", "execute", "tacet", "--local", `--file=${generatedPath}`, "--yes"],
  { cwd: root, stdio: "inherit" },
);
console.log("Done. Wipe it with: npm run seed:wipe");
