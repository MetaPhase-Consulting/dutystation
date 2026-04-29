// Throttled, cached, retried HTTP fetcher shared by every Phase 3 enricher.
//
// Responsibilities:
//   - per-host token-bucket throttle (default 1 req / 500 ms; configurable)
//   - exponential backoff with jitter on 429 / 5xx (3 retries, capped at 30 s)
//   - User-Agent: dutystation-enrichment/1.0 (allow-listed in public/robots.txt)
//   - optional robots.txt honor for HTML targets (cached 24 h)
//   - disk cache at <cacheDir>/<host>/<sha1(url)>.json with {fetchedAt, etag, body}
//   - honors If-None-Match against cache when the upstream supports ETags
//
// Use createPoliteFetch({ cacheDir, ... }) for a fully injectable instance.
// Tests pass fetchImpl/now/sleep to avoid real network and timers.

import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

export const POLITE_FETCH_USER_AGENT =
  "dutystation-enrichment/1.0 (+https://dutystation.us/data-sources)";

const DEFAULT_THROTTLE_MS = 500;
const DEFAULT_TTL_MS = 24 * 60 * 60 * 1000;
const DEFAULT_TIMEOUT_MS = 15_000;
const DEFAULT_RETRIES = 3;
const BASE_BACKOFF_MS = 1_000;
const MAX_BACKOFF_MS = 30_000;
const ROBOTS_TTL_MS = 24 * 60 * 60 * 1000;

export function createPoliteFetch({
  cacheDir,
  userAgent = POLITE_FETCH_USER_AGENT,
  defaultThrottleMs = DEFAULT_THROTTLE_MS,
  defaultTtlMs = DEFAULT_TTL_MS,
  defaultTimeoutMs = DEFAULT_TIMEOUT_MS,
  perHostThrottleMs = {},
  fetchImpl = globalThis.fetch,
  now = () => Date.now(),
  sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms)),
  randomJitter = () => Math.random(),
  log = () => {},
} = {}) {
  if (!cacheDir) {
    throw new Error("createPoliteFetch: cacheDir is required");
  }
  ensureDir(cacheDir);

  const hostLastRequest = new Map();
  const robotsCache = new Map();

  async function throttleForHost(host) {
    const interval = perHostThrottleMs[host] ?? defaultThrottleMs;
    if (interval <= 0) return;
    const last = hostLastRequest.get(host) ?? 0;
    const wait = last + interval - now();
    if (wait > 0) {
      await sleep(wait);
    }
    hostLastRequest.set(host, now());
  }

  async function checkRobots(url) {
    const parsed = new URL(url);
    const cached = robotsCache.get(parsed.host);
    if (cached && now() - cached.fetchedAt < ROBOTS_TTL_MS) {
      return cached.allow(parsed.pathname);
    }
    const robotsUrl = `${parsed.protocol}//${parsed.host}/robots.txt`;
    try {
      const response = await fetchImpl(robotsUrl, {
        headers: { "user-agent": userAgent },
      });
      const body = response.ok ? await response.text() : "";
      const allow = parseRobotsTxt(body, userAgent);
      robotsCache.set(parsed.host, { fetchedAt: now(), allow });
      return allow(parsed.pathname);
    } catch {
      // robots.txt fetch failures are non-fatal; default to allow with logging.
      const allow = () => true;
      robotsCache.set(parsed.host, { fetchedAt: now(), allow });
      return true;
    }
  }

  function readCacheEntry(url) {
    const file = cacheFilePath(cacheDir, url);
    if (!fs.existsSync(file)) return null;
    try {
      return JSON.parse(fs.readFileSync(file, "utf8"));
    } catch {
      return null;
    }
  }

  function writeCacheEntry(url, entry) {
    const file = cacheFilePath(cacheDir, url);
    ensureDir(path.dirname(file));
    fs.writeFileSync(file, JSON.stringify(entry, null, 2));
  }

  async function fetchOnce(url, { headers, timeoutMs }) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      return await fetchImpl(url, {
        method: "GET",
        redirect: "follow",
        signal: controller.signal,
        headers: { "user-agent": userAgent, ...headers },
      });
    } finally {
      clearTimeout(timer);
    }
  }

  async function politeFetch(url, opts = {}) {
    const {
      ttlMs = defaultTtlMs,
      timeoutMs = defaultTimeoutMs,
      retries = DEFAULT_RETRIES,
      headers = {},
      parser = "json",
      honorRobots = false,
      bypassCache = false,
    } = opts;

    if (honorRobots) {
      const allowed = await checkRobots(url);
      if (!allowed) {
        throw new Error(`polite-fetch: robots.txt disallows ${url}`);
      }
    }

    const cached = bypassCache ? null : readCacheEntry(url);
    if (cached && now() - cached.fetchedAt < ttlMs) {
      return parseBody(cached.body, parser);
    }

    const conditionalHeaders = cached?.etag ? { "if-none-match": cached.etag } : {};
    const host = new URL(url).host;

    let lastError = null;
    for (let attempt = 0; attempt <= retries; attempt += 1) {
      await throttleForHost(host);
      try {
        const response = await fetchOnce(url, {
          headers: { ...conditionalHeaders, ...headers },
          timeoutMs,
        });

        if (response.status === 304 && cached) {
          writeCacheEntry(url, { ...cached, fetchedAt: now() });
          return parseBody(cached.body, parser);
        }

        if (response.status === 429 || (response.status >= 500 && response.status < 600)) {
          lastError = new Error(`polite-fetch: ${response.status} ${response.statusText}`);
          if (attempt < retries) {
            await sleep(backoffMs(attempt, randomJitter));
            continue;
          }
          throw lastError;
        }

        if (!response.ok) {
          throw new Error(`polite-fetch: ${response.status} ${response.statusText} for ${url}`);
        }

        const body = await response.text();
        const etag = response.headers.get("etag") ?? null;
        writeCacheEntry(url, { fetchedAt: now(), etag, body });
        return parseBody(body, parser);
      } catch (error) {
        lastError = error;
        log({ url, attempt, error: String(error?.message ?? error) });
        if (attempt < retries && isRetryable(error)) {
          await sleep(backoffMs(attempt, randomJitter));
          continue;
        }
        throw error;
      }
    }
    throw lastError ?? new Error(`polite-fetch: exhausted retries for ${url}`);
  }

  return politeFetch;
}

function backoffMs(attempt, randomJitter) {
  const base = Math.min(BASE_BACKOFF_MS * 2 ** attempt, MAX_BACKOFF_MS);
  const jitter = randomJitter() * base * 0.25;
  return Math.floor(base + jitter);
}

function isRetryable(error) {
  if (!error) return false;
  if (error.name === "AbortError") return true;
  const message = String(error.message ?? error);
  return /429|5\d\d|ECONNRESET|ETIMEDOUT|ENETUNREACH|EAI_AGAIN/.test(message);
}

function parseBody(body, parser) {
  if (parser === "json") {
    if (typeof body !== "string" || body.length === 0) return null;
    try {
      return JSON.parse(body);
    } catch {
      throw new Error("polite-fetch: failed to parse JSON body");
    }
  }
  return body;
}

function cacheFilePath(cacheDir, url) {
  const parsed = new URL(url);
  const hash = crypto.createHash("sha1").update(url).digest("hex");
  return path.join(cacheDir, parsed.host, `${hash}.json`);
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// Minimal robots.txt parser: returns a function (pathname) => boolean.
// Honors User-agent: <our-agent>, User-agent: *, Disallow:, Allow: rules.
// Longest-match wins per RFC 9309.
export function parseRobotsTxt(body, userAgent) {
  const lines = String(body || "")
    .split(/\r?\n/)
    .map((line) => line.replace(/#.*$/, "").trim())
    .filter(Boolean);

  const groups = [];
  let current = null;
  for (const line of lines) {
    const [field, ...rest] = line.split(":");
    if (!field || rest.length === 0) continue;
    const value = rest.join(":").trim();
    const key = field.toLowerCase();
    if (key === "user-agent") {
      if (!current || current.rules.length > 0) {
        current = { agents: [], rules: [] };
        groups.push(current);
      }
      current.agents.push(value.toLowerCase());
    } else if (current && (key === "allow" || key === "disallow")) {
      current.rules.push({ kind: key, path: value });
    }
  }

  const ourAgent = userAgent.split("/")[0].toLowerCase();
  const candidates = groups.filter((group) =>
    group.agents.some((agent) => agent === "*" || ourAgent.includes(agent))
  );
  // Prefer specific over wildcard.
  const specific = candidates.filter((group) => group.agents.some((agent) => agent !== "*"));
  const applicable = (specific.length ? specific : candidates).flatMap((group) => group.rules);

  return function allow(pathname) {
    let bestMatch = null;
    for (const rule of applicable) {
      if (!rule.path) {
        // Empty Disallow: means allow all.
        if (rule.kind === "disallow") continue;
      }
      if (pathname.startsWith(rule.path)) {
        if (!bestMatch || rule.path.length > bestMatch.path.length) {
          bestMatch = rule;
        }
      }
    }
    if (!bestMatch) return true;
    return bestMatch.kind === "allow";
  };
}
