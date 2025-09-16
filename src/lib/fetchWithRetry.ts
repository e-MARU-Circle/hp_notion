export interface RetryOptions {
  attempts?: number; // total attempts
  backoffMs?: number; // initial backoff
  timeoutMs?: number; // per-attempt timeout
}

export async function fetchWithRetry(
  input: Parameters<typeof fetch>[0],
  init: Parameters<typeof fetch>[1] & { next?: { revalidate?: number } } = {},
  opts: RetryOptions = {}
) {
  const attempts = Math.max(1, opts.attempts ?? Number(process.env.NOTION_FETCH_ATTEMPTS ?? 3));
  const baseBackoff = Math.max(100, opts.backoffMs ?? Number(process.env.NOTION_FETCH_BACKOFF_MS ?? 800));
  const timeoutMs = Math.max(1000, opts.timeoutMs ?? Number(process.env.NOTION_FETCH_TIMEOUT_MS ?? 15000));

  let lastErr: unknown;
  for (let i = 0; i < attempts; i++) {
    const ac = new AbortController();
    const t = setTimeout(() => ac.abort(), timeoutMs);
    try {
      const res = await fetch(input as any, { ...init, signal: ac.signal });
      clearTimeout(t);
      if (res.ok) return res;
      // Retry on 5xx
      if (res.status >= 500) {
        lastErr = new Error(`HTTP ${res.status}`);
      } else {
        return res; // don't retry 4xx
      }
    } catch (e) {
      lastErr = e;
    } finally {
      clearTimeout(t);
    }
    // backoff before next attempt
    const sleep = baseBackoff * Math.pow(2, i);
    await new Promise((r) => setTimeout(r, sleep));
  }
  throw lastErr instanceof Error ? lastErr : new Error('fetchWithRetry failed');
}

