import { CSRF_COOKIE_NAME, CSRF_HEADER_NAME } from "@/lib/constants";
import type { CreateInvoiceInput } from "@/lib/validation/invoice";
import type { LoginInput } from "@/lib/validation/auth";

/** Reads the double-submit CSRF token from the JS-readable cookie. */
function readCsrfToken(): string {
  const match = document.cookie.match(
    new RegExp(`(?:^|; )${CSRF_COOKIE_NAME}=([^;]*)`),
  );
  return match ? decodeURIComponent(match[1]) : "";
}

/** Thrown for non-2xx responses from our own API, carrying a user-facing message. */
export class ApiError extends Error {
  readonly status: number;
  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

/** POST helper to our own BFF endpoints: JSON body + CSRF header + error mapping. */
async function postJson<T>(url: string, body: unknown): Promise<T> {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      [CSRF_HEADER_NAME]: readCsrfToken(),
    },
    body: JSON.stringify(body),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new ApiError(
      response.status,
      (data as { error?: string }).error ?? "Something went wrong",
    );
  }
  return data as T;
}

export function login(input: LoginInput) {
  return postJson<{ profile: { fullName: string } }>("/api/auth/login", input);
}

export function logout() {
  return postJson<{ ok: true }>("/api/auth/logout", {});
}

export function createInvoice(input: CreateInvoiceInput) {
  return postJson<{ ok: true }>("/api/invoices", input);
}
