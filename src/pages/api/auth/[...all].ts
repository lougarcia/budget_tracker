import type { APIRoute } from 'astro';
import { createAuth } from '../../../auth';

export const ALL: APIRoute = async (context) => {
  const runtimeEnv = context.locals?.runtime?.env as any;
  const auth = createAuth({
    DATABASE_URL: runtimeEnv?.DATABASE_URL,
    DATABASE_AUTH_TOKEN: runtimeEnv?.DATABASE_AUTH_TOKEN,
    BETTER_AUTH_SECRET: runtimeEnv?.BETTER_AUTH_SECRET,
    BETTER_AUTH_URL: runtimeEnv?.BETTER_AUTH_URL,
  }, context.request.url);
  return auth.handler(context.request);
};
