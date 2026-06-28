import "server-only";

/** Error thrown when an upstream 101 Digital service returns a non-2xx status. */
export class UpstreamError extends Error {
  readonly status: number;
  readonly body: unknown;

  constructor(status: number, message: string, body?: unknown) {
    super(message);
    this.name = "UpstreamError";
    this.status = status;
    this.body = body;
  }
}

interface RequestOptions {
  method?: "GET" | "POST";
  headers?: Record<string, string>;
  body?: BodyInit;
  timeoutMs?: number;
}

export async function requestJson<T>(
  url: string,
  { method = "GET", headers, body, timeoutMs = 15_000 }: RequestOptions = {},
): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  let response: Response;
  try {
    response = await fetch(url, {
      method,
      headers,
      body,
      redirect: "error",
      cache: "no-store",
      signal: controller.signal,
    });
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new UpstreamError(504, "Upstream request timed out");
    }
    throw new UpstreamError(502, "Failed to reach upstream service");
  } finally {
    clearTimeout(timeout);
  }

  const text = await response.text();
  const data = text ? safeJsonParse(text) : undefined;

  if (!response.ok) {
    throw new UpstreamError(
      response.status,
      `Upstream responded with ${response.status}`,
      data,
    );
  }

  return data as T;
}

function safeJsonParse(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}
