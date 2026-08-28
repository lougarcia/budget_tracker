import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from './schema';

export function getDb(env?: { DATABASE_URL?: string; DATABASE_AUTH_TOKEN?: string }) {
  const url = env?.DATABASE_URL || process.env.DATABASE_URL || 'file:local.db';
  const authToken = env?.DATABASE_AUTH_TOKEN || process.env.DATABASE_AUTH_TOKEN;

  const client = createClient({
    url,
    authToken,
  });

  return drizzle(client, { schema });
}

export type DbClient = ReturnType<typeof getDb>;
