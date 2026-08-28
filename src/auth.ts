import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { getDb } from "./db";

export function createAuth(env?: { DATABASE_URL?: string; DATABASE_AUTH_TOKEN?: string; BETTER_AUTH_SECRET?: string; BETTER_AUTH_URL?: string }, requestUrl?: string) {
  const db = getDb(env);

  let baseURL = env?.BETTER_AUTH_URL || process.env.BETTER_AUTH_URL;
  if (!baseURL && requestUrl) {
    try {
      const u = new URL(requestUrl);
      baseURL = u.origin;
    } catch {}
  }
  if (!baseURL) {
    baseURL = "http://localhost:4321";
  }

  return betterAuth({
    database: drizzleAdapter(db, {
      provider: "sqlite",
    }),
    emailAndPassword: {
      enabled: true,
      minPasswordLength: 6,
    },
    secret: env?.BETTER_AUTH_SECRET || process.env.BETTER_AUTH_SECRET || "development_secret_key_change_me",
    baseURL,
  });
}

// Default export for local / default runtime context
export const auth = createAuth();
