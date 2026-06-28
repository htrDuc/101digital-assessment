# Security Design — SimpleInvoice

How this app handles credentials, sessions, and request integrity — the
assumptions made, the threats considered, and the controls in place.

---

## Core principle — Backend-for-Frontend (BFF)

- The browser talks **only** to this app's own `/api/*` routes.
- The real 101 Digital `access_token` / `org-token` live **server-side** and are attached to upstream calls there.
- The browser never receives a usable token → removes the entire "token stolen from the browser" attack class.

```
Browser ──(encrypted session cookie)──► Next.js server ──(Bearer + org-token)──► 101 Digital
```

---

## Assumptions

- **Deployment**: single instance (one Node process). In-memory state (rate limiter) is per-instance.
- **Transport**: HTTPS terminates in front of the app in production; `Secure` cookies + HSTS assume TLS.
- **Proxy**: a trusted reverse proxy sets `x-forwarded-for` (used for the login rate-limit key).
- **Credentials**: the supplied sandbox credentials are non-production but treated as secrets.
- **Auth flow**: the upstream API only offers the OAuth2 **password grant**, so the app uses it (see *Limitations*).
- **Cookie scope**: the app is served from a single host; no sibling subdomains share cookies.

---

## Controls

**Authentication & secrets**
- Token exchange (`client_id` + `client_secret`) runs only on the server; the browser sends only username/password to our own endpoint.
- Secrets read from non-public env vars; `.env.local` is git-ignored, `.env.example` ships placeholders.
- Env validated at boot — the app refuses to start if a secret is missing.

**Session & cookies**
- Session payload (`accessToken`, `orgToken`, `refreshToken`, `expiresAt`, `profile`) is **AES-sealed** into the cookie — unreadable without `SESSION_PASSWORD`.
- Cookie flags: `httpOnly`, `Secure` (prod), `SameSite=Lax`, `__Host-` prefix (prod) to block subdomain overwrite.
- Session validity is checked both at the edge (`proxy.ts`) and in the server layout/routes (defense in depth).

**CSRF**
- Every mutation (login, logout, create invoice) requires a **double-submit token** (`si_csrf` cookie echoed in the `x-csrf-token` header, compared constant-time) **and** a matching `Origin` header.
- `GET` endpoints stay side-effect-free, so they need no CSRF token.

**Abuse**
- Login throttled to 5 attempts/min per IP + username, with `429` + retry-after.

**Headers & transport**
- Nonce-based CSP (`script-src 'self' 'nonce-…' 'strict-dynamic'` in prod), HSTS, `X-Content-Type-Options: nosniff`, `frame-ancestors 'none'` / `X-Frame-Options: DENY`, `Referrer-Policy`, `Permissions-Policy`.

**Input & errors**
- Zod schemas are the single source of truth, used for client UX and **re-validated on the server**.
- Upstream errors are mapped to generic client messages; stack traces / upstream bodies are never returned.
- Login returns one generic message regardless of which field is wrong.

---

## Enhancements beyond the baseline

The brief recommends a baseline (server-side token exchange, httpOnly cookie, BFF
proxy, secrets hygiene, basic headers). Below is where that baseline leaves a gap,
and what was added to close it.

- **Encrypt the session cookie, not just `httpOnly`.**
  - *Gap:* `httpOnly` only stops page JS from reading a cookie — not logs, monitoring tools, browser extensions, or backups.
  - *Done:* the cookie is AES-sealed, so a leaked cookie reveals no token.

- **Add CSRF defenses on top of cookies.**
  - *Gap:* cookie-based auth is inherently CSRF-prone; `SameSite=Lax` still allows top-level GET and Route Handlers have no built-in CSRF.
  - *Done:* double-submit token **+** Origin check on every mutation.

- **Rate-limit authentication.**
  - *Gap:* an unthrottled password-grant login is a credential-stuffing target.
  - *Done:* per IP + username throttling.

- **Strict CSP with per-request nonce (vs "basic headers").**
  - *Gap:* the token-in-httpOnly-cookie story only holds if XSS is actually prevented; basic headers don't stop script injection.
  - *Done:* nonce-based CSP as the primary XSS control, plus the full header set.

- **Smaller, often-missed gaps closed:**
  - No user enumeration on login (uniform error + timing).
  - Open-redirect-safe post-login `next` (same-origin relative paths only).
  - Fail-fast env validation (no silent boot with missing secrets).
  - SSRF hygiene on outbound calls (fixed hosts, timeouts, no redirect-follow).
  - Stale-session self-heal: a server render that hits a `401` clears the session via a route handler before redirecting, preventing a redirect loop.

---

## Known limitations / future work

- **Refresh-token rotation** — the refresh token is stored but silent refresh is not wired up; a session expires with its access token.
- **Rate limiter is in-memory** (per instance) — production should use a shared store (e.g. Redis/Upstash).
- **Password grant (ROPC)** is mandated by the upstream API; it is a deprecated flow. A production system would prefer Authorization Code + PKCE.
- **Signed double-submit** — the CSRF token could be HMAC-bound to the session to remain safe even if an attacker can overwrite cookies (the Origin check currently covers this).
