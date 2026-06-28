import "server-only";

import { z } from "zod";

/**
 * Server-side environment configuration.
 *
 * Validated once at module load so the app *fails fast* on misconfiguration
 * instead of crashing deep inside a request. Every value here is a secret or
 * server-only setting and must never be imported from a Client Component.
 */
const envSchema = z.object({
  AUTH_BASE_URL: z.string().url(),
  API_BASE_URL: z.string().url(),
  OAUTH_CLIENT_ID: z.string().min(1),
  OAUTH_CLIENT_SECRET: z.string().min(1),
  OAUTH_SCOPE: z.string().min(1).default("openid"),
  SESSION_PASSWORD: z
    .string()
    .min(32, "SESSION_PASSWORD must be at least 32 characters"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  const issues = parsed.error.issues
    .map((issue) => `  - ${issue.path.join(".")}: ${issue.message}`)
    .join("\n");
  throw new Error(
    `Invalid environment configuration. Check your .env.local:\n${issues}`,
  );
}

export const env = parsed.data;
