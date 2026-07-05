import { describe, it, expect } from "vitest";
import { req, cookieOf, registerAdmin } from "./helpers";

describe("auth", () => {
  it("bootstraps the first account as admin with no invite", async () => {
    const res = await req("/api/auth/register", {
      method: "POST",
      body: { handle: "ren", passphrase: "a-quiet-passphrase" },
    });
    expect(res.status).toBe(201);
    const { user } = (await res.json()) as { user: { handle: string; is_admin: boolean } };
    expect(user.handle).toBe("ren");
    expect(user.is_admin).toBe(true);
    expect(cookieOf(res)).toBeTruthy();
  });

  it("returns the current user from the session cookie", async () => {
    const cookie = await registerAdmin();
    const res = await req("/api/auth/me", { cookie });
    const { user } = (await res.json()) as { user: { handle: string } | null };
    expect(user?.handle).toBe("ren");
  });

  it("treats /me as anonymous without a cookie", async () => {
    const res = await req("/api/auth/me");
    const { user } = (await res.json()) as { user: unknown };
    expect(user).toBeNull();
  });

  it("requires an invite for the second account", async () => {
    await registerAdmin();
    const res = await req("/api/auth/register", {
      method: "POST",
      body: { handle: "ada", passphrase: "ada-secret-pass" },
    });
    expect(res.status).toBe(400);
  });

  it("rejects a duplicate handle", async () => {
    const cookie = await registerAdmin();
    const mint = await req("/api/invites", { method: "POST", cookie });
    const { invite } = (await mint.json()) as { invite: { code: string } };
    const res = await req("/api/auth/register", {
      method: "POST",
      body: { handle: "ren", passphrase: "whatever-pass", invite: invite.code },
    });
    expect(res.status).toBe(409);
  });

  it("rejects a used or unknown invite code", async () => {
    await registerAdmin();
    const res = await req("/api/auth/register", {
      method: "POST",
      body: { handle: "nobody", passphrase: "some-pass-phrase", invite: "NOPE-NOPE-NOPE" },
    });
    expect(res.status).toBe(400);
  });

  it("logs in with the right passphrase and rejects the wrong one", async () => {
    await registerAdmin("ren", "a-quiet-passphrase");
    const bad = await req("/api/auth/login", {
      method: "POST",
      body: { handle: "ren", passphrase: "wrong" },
    });
    expect(bad.status).toBe(401);

    const good = await req("/api/auth/login", {
      method: "POST",
      body: { handle: "ren", passphrase: "a-quiet-passphrase" },
    });
    expect(good.status).toBe(200);
    expect(cookieOf(good)).toBeTruthy();
  });

  it("rejects short passphrases and malformed handles", async () => {
    const short = await req("/api/auth/register", {
      method: "POST",
      body: { handle: "ren", passphrase: "short" },
    });
    expect(short.status).toBe(400);

    const badHandle = await req("/api/auth/register", {
      method: "POST",
      body: { handle: "Not A Handle!", passphrase: "a-quiet-passphrase" },
    });
    expect(badHandle.status).toBe(400);
  });
});
