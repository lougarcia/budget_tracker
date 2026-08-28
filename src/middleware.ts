import { defineMiddleware } from 'astro:middleware';
import { createAuth } from './auth';
import { getDb } from './db';
import { trackers, trackerMembers, categories } from './db/schema';
import { eq } from 'drizzle-orm';

export const onRequest = defineMiddleware(async (context, next) => {
  const runtimeEnv = context.locals?.runtime?.env as any;
  const db = getDb(runtimeEnv);
  const auth = createAuth({
    DATABASE_URL: runtimeEnv?.DATABASE_URL,
    DATABASE_AUTH_TOKEN: runtimeEnv?.DATABASE_AUTH_TOKEN,
    BETTER_AUTH_SECRET: runtimeEnv?.BETTER_AUTH_SECRET,
    BETTER_AUTH_URL: runtimeEnv?.BETTER_AUTH_URL,
  }, context.request.url);

  context.locals.db = db;
  context.locals.auth = auth;

  try {
    const session = await auth.api.getSession({
      headers: context.request.headers,
    });
    context.locals.user = session?.user || null;
    context.locals.session = session?.session || null;

    if (session?.user) {
      const userId = session.user.id;
      const memberships = await db
        .select()
        .from(trackerMembers)
        .where(eq(trackerMembers.userId, userId))
        .limit(1);

      if (memberships.length === 0) {
        const trackerId = crypto.randomUUID();
        const now = new Date();

        await db.transaction(async (tx) => {
          await tx.insert(trackers).values({
            id: trackerId,
            name: 'My Budget',
            description: 'Your personal financial workspace',
            currency: 'USD',
            ownerId: userId,
            createdAt: now,
            updatedAt: now,
          });

          await tx.insert(trackerMembers).values({
            id: crypto.randomUUID(),
            trackerId,
            userId,
            role: 'owner',
            createdAt: now,
            updatedAt: now,
          });

          const defaultIncomeCategories = [
            'Salary', 'Freelance', 'Business', 'Investment', 'Bonus', 'Gift', 'Other'
          ];
          const defaultExpenseCategories = [
            'Housing', 'Utilities', 'Groceries', 'Dining', 'Transportation', 'Healthcare',
            'Insurance', 'Shopping', 'Entertainment', 'Education', 'Travel', 'Personal',
            'Subscriptions', 'Debt', 'Savings', 'Other'
          ];

          for (const name of defaultIncomeCategories) {
            await tx.insert(categories).values({
              id: crypto.randomUUID(),
              trackerId,
              name,
              type: 'income',
              createdAt: now,
              updatedAt: now,
            });
          }

          for (const name of defaultExpenseCategories) {
            await tx.insert(categories).values({
              id: crypto.randomUUID(),
              trackerId,
              name,
              type: 'expense',
              createdAt: now,
              updatedAt: now,
            });
          }
        });
      }
    }
  } catch (err) {
    console.error('Auth session error:', err);
    context.locals.user = null;
    context.locals.session = null;
  }

  const url = new URL(context.request.url);
  const isAppRoute = url.pathname.startsWith('/app');

  if (isAppRoute && !context.locals.user) {
    return context.redirect('/login');
  }

  if ((url.pathname === '/login' || url.pathname === '/register') && context.locals.user) {
    return context.redirect('/app/trackers');
  }

  return next();
});
