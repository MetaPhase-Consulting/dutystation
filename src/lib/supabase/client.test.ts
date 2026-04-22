import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

describe("getSupabaseClient", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.unstubAllEnvs();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("returns null when VITE_SUPABASE_URL is missing", async () => {
    vi.stubEnv("VITE_SUPABASE_URL", "");
    vi.stubEnv("VITE_SUPABASE_ANON_KEY", "anon-key");

    const { getSupabaseClient } = await import("./client");
    expect(getSupabaseClient()).toBeNull();
  });

  it("returns null when VITE_SUPABASE_ANON_KEY is missing", async () => {
    vi.stubEnv("VITE_SUPABASE_URL", "https://example.supabase.co");
    vi.stubEnv("VITE_SUPABASE_ANON_KEY", "");

    const { getSupabaseClient } = await import("./client");
    expect(getSupabaseClient()).toBeNull();
  });

  it("returns a client when both env vars are set", async () => {
    vi.stubEnv("VITE_SUPABASE_URL", "https://example.supabase.co");
    vi.stubEnv("VITE_SUPABASE_ANON_KEY", "anon-key");

    const { getSupabaseClient } = await import("./client");
    const client = getSupabaseClient();
    expect(client).not.toBeNull();
    expect(client).toHaveProperty("from");
  });

  it("returns the same singleton on repeated calls", async () => {
    vi.stubEnv("VITE_SUPABASE_URL", "https://example.supabase.co");
    vi.stubEnv("VITE_SUPABASE_ANON_KEY", "anon-key");

    const { getSupabaseClient } = await import("./client");
    const first = getSupabaseClient();
    const second = getSupabaseClient();
    expect(first).toBe(second);
  });
});
