import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { createPoliteFetch, parseRobotsTxt, POLITE_FETCH_USER_AGENT } from "../polite-fetch.mjs";

function jsonResponse(body, init = {}) {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { "content-type": "application/json", ...(init.headers ?? {}) },
    ...init,
  });
}

function makeClock() {
  let t = 1_700_000_000_000;
  return {
    now: () => t,
    advance: (ms) => {
      t += ms;
    },
  };
}

function makeSleep(clock) {
  return vi.fn(async (ms) => {
    clock.advance(ms);
  });
}

let cacheDir;

beforeEach(() => {
  cacheDir = fs.mkdtempSync(path.join(os.tmpdir(), "polite-fetch-test-"));
});

afterEach(() => {
  fs.rmSync(cacheDir, { recursive: true, force: true });
});

describe("createPoliteFetch", () => {
  it("returns parsed JSON and writes a cache entry on success", async () => {
    const fetchImpl = vi.fn().mockResolvedValue(
      jsonResponse({ ok: true }, { headers: { etag: '"abc"' } })
    );
    const clock = makeClock();
    const sleep = makeSleep(clock);

    const politeFetch = createPoliteFetch({
      cacheDir,
      fetchImpl,
      now: clock.now,
      sleep,
    });

    const result = await politeFetch("https://example.test/api");
    expect(result).toEqual({ ok: true });
    expect(fetchImpl).toHaveBeenCalledTimes(1);

    const cacheFiles = fs.readdirSync(path.join(cacheDir, "example.test"));
    expect(cacheFiles).toHaveLength(1);
    const entry = JSON.parse(
      fs.readFileSync(path.join(cacheDir, "example.test", cacheFiles[0]), "utf8")
    );
    expect(entry.etag).toBe('"abc"');
    expect(JSON.parse(entry.body)).toEqual({ ok: true });
  });

  it("serves a fresh cache entry without calling fetch", async () => {
    const fetchImpl = vi.fn().mockResolvedValue(jsonResponse({ ok: true }));
    const clock = makeClock();
    const politeFetch = createPoliteFetch({
      cacheDir,
      fetchImpl,
      now: clock.now,
      sleep: makeSleep(clock),
    });

    await politeFetch("https://example.test/api");
    fetchImpl.mockClear();

    const second = await politeFetch("https://example.test/api");
    expect(second).toEqual({ ok: true });
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it("revalidates with If-None-Match when the cache entry is stale", async () => {
    const fetchImpl = vi
      .fn()
      .mockResolvedValueOnce(jsonResponse({ ok: true }, { headers: { etag: '"v1"' } }))
      .mockResolvedValueOnce(new Response(null, { status: 304 }));

    const clock = makeClock();
    const politeFetch = createPoliteFetch({
      cacheDir,
      fetchImpl,
      now: clock.now,
      sleep: makeSleep(clock),
    });

    await politeFetch("https://example.test/api", { ttlMs: 1_000 });
    clock.advance(2_000);
    const second = await politeFetch("https://example.test/api", { ttlMs: 1_000 });

    expect(second).toEqual({ ok: true });
    expect(fetchImpl).toHaveBeenCalledTimes(2);
    const lastCall = fetchImpl.mock.calls.at(-1);
    expect(lastCall[1].headers["if-none-match"]).toBe('"v1"');
  });

  it("retries with exponential backoff on 429 then succeeds", async () => {
    const fetchImpl = vi
      .fn()
      .mockResolvedValueOnce(new Response("rate limit", { status: 429 }))
      .mockResolvedValueOnce(jsonResponse({ ok: true }));

    const clock = makeClock();
    const sleep = makeSleep(clock);
    const politeFetch = createPoliteFetch({
      cacheDir,
      fetchImpl,
      now: clock.now,
      sleep,
      randomJitter: () => 0,
    });

    const result = await politeFetch("https://example.test/api");
    expect(result).toEqual({ ok: true });
    expect(fetchImpl).toHaveBeenCalledTimes(2);
    // First sleep is the initial throttle (host bucket), then backoff after 429.
    const backoffSleep = sleep.mock.calls.find(([ms]) => ms >= 1_000);
    expect(backoffSleep).toBeDefined();
  });

  it("throws after exhausting retries on persistent 5xx", async () => {
    const fetchImpl = vi.fn().mockResolvedValue(new Response("boom", { status: 503 }));
    const clock = makeClock();
    const politeFetch = createPoliteFetch({
      cacheDir,
      fetchImpl,
      now: clock.now,
      sleep: makeSleep(clock),
      randomJitter: () => 0,
    });

    await expect(politeFetch("https://example.test/api", { retries: 2 })).rejects.toThrow(/503/);
    expect(fetchImpl).toHaveBeenCalledTimes(3);
  });

  it("enforces per-host throttle between consecutive calls", async () => {
    const fetchImpl = vi.fn().mockImplementation(() => Promise.resolve(jsonResponse({ ok: true })));
    const clock = makeClock();
    const sleep = makeSleep(clock);
    const politeFetch = createPoliteFetch({
      cacheDir,
      fetchImpl,
      now: clock.now,
      sleep,
      defaultThrottleMs: 500,
    });

    await politeFetch("https://example.test/a");
    await politeFetch("https://example.test/b");

    const throttleSleeps = sleep.mock.calls.filter(([ms]) => ms > 0 && ms <= 500);
    expect(throttleSleeps.length).toBeGreaterThanOrEqual(1);
  });

  it("sends the configured User-Agent on every request", async () => {
    const fetchImpl = vi.fn().mockResolvedValue(jsonResponse({}));
    const clock = makeClock();
    const politeFetch = createPoliteFetch({
      cacheDir,
      fetchImpl,
      now: clock.now,
      sleep: makeSleep(clock),
    });

    await politeFetch("https://example.test/api");
    const headers = fetchImpl.mock.calls[0][1].headers;
    expect(headers["user-agent"]).toBe(POLITE_FETCH_USER_AGENT);
  });

  it("throws when robots.txt disallows the path", async () => {
    const robotsBody = "User-agent: *\nDisallow: /private";
    const fetchImpl = vi.fn().mockImplementation((url) => {
      if (url.endsWith("/robots.txt")) {
        return Promise.resolve(new Response(robotsBody, { status: 200 }));
      }
      return Promise.resolve(jsonResponse({ ok: true }));
    });

    const clock = makeClock();
    const politeFetch = createPoliteFetch({
      cacheDir,
      fetchImpl,
      now: clock.now,
      sleep: makeSleep(clock),
    });

    await expect(
      politeFetch("https://example.test/private/data", { honorRobots: true })
    ).rejects.toThrow(/robots.txt/);
  });

  it("requires cacheDir", () => {
    expect(() => createPoliteFetch({})).toThrow(/cacheDir/);
  });
});

describe("parseRobotsTxt", () => {
  it("treats empty body as allow-all", () => {
    const allow = parseRobotsTxt("", "agent");
    expect(allow("/")).toBe(true);
    expect(allow("/anything")).toBe(true);
  });

  it("respects Disallow under wildcard agent", () => {
    const allow = parseRobotsTxt("User-agent: *\nDisallow: /admin", "dutystation-enrichment/1.0");
    expect(allow("/")).toBe(true);
    expect(allow("/admin/users")).toBe(false);
  });

  it("prefers specific agent group over wildcard", () => {
    const body = [
      "User-agent: *",
      "Disallow: /",
      "",
      "User-agent: dutystation-enrichment",
      "Allow: /public",
    ].join("\n");
    const allow = parseRobotsTxt(body, "dutystation-enrichment/1.0");
    expect(allow("/public/x")).toBe(true);
    expect(allow("/private")).toBe(true); // no matching disallow in our group
  });

  it("longest-match wins between Allow and Disallow", () => {
    const body = "User-agent: *\nDisallow: /api\nAllow: /api/public";
    const allow = parseRobotsTxt(body, "agent");
    expect(allow("/api/private")).toBe(false);
    expect(allow("/api/public/data")).toBe(true);
  });
});
