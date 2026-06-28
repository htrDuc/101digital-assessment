# SimpleInvoice

A small invoicing web app for the 101 Digital Web Engineer assessment.

The defining design choice is a **Backend-for-Frontend (BFF)**: the browser only
ever talks to this app's own API routes; the real 101 Digital tokens never reach
the client. See [`SECURITY.md`](./SECURITY.md) for the full threat model.

---

## Getting started

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env.local
# Fill OAUTH_CLIENT_ID / OAUTH_CLIENT_SECRET from the assessment PDF (Appendix A)
# and generate a session secret:
node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"
# → paste into SESSION_PASSWORD

# 3. Run
npm run dev          # http://localhost:3000
```

Sign in with the sandbox credentials from the assessment PDF
(username `94756921275`).

### Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm start` | Run the production build |
| `npm test` | Run unit tests |
| `npm run typecheck` | TypeScript, no emit |
| `npm run lint` | ESLint |

---

## Security

Security is treated as a first-class requirement. Highlights:

- Server-side token exchange; secrets only in non-public env vars.
- Tokens kept server-side in an **AES-encrypted** httpOnly/SameSite cookie
  (`__Host-` prefixed in production).
- **CSRF** double-submit token + Origin check on all mutations.
- **Rate limiting** on login (brute-force / credential-stuffing defense).
- **Nonce-based CSP** + HSTS, `nosniff`, `frame-ancestors`, Referrer-Policy,
  Permissions-Policy (set in `proxy.ts`).
- Generic auth errors (no user enumeration); open-redirect-safe `next` param.

Full details and a threat-model table: [`SECURITY.md`](./SECURITY.md).
