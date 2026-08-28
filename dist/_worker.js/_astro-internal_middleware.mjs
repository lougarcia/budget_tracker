globalThis.process ??= {}; globalThis.process.env ??= {};
import { d as defineMiddleware, s as sequence } from './chunks/render-context_C9gvr3oG.mjs';
import { g as getDb, b as createAuth } from './chunks/index_BYBH5494.mjs';
import { t as trackerMembers, e as eq, b as trackers, c as categories } from './chunks/schema_D3bIJDv1.mjs';
import './chunks/astro-designed-error-pages_CuzHJZgZ.mjs';
import './chunks/astro/server_BZuKIedG.mjs';

const onRequest$2 = defineMiddleware(async (context, next) => {
  const runtimeEnv = context.locals?.runtime?.env;
  const db = getDb(runtimeEnv);
  const auth = createAuth({
    DATABASE_URL: runtimeEnv?.DATABASE_URL,
    DATABASE_AUTH_TOKEN: runtimeEnv?.DATABASE_AUTH_TOKEN,
    BETTER_AUTH_SECRET: runtimeEnv?.BETTER_AUTH_SECRET,
    BETTER_AUTH_URL: runtimeEnv?.BETTER_AUTH_URL
  });
  context.locals.db = db;
  context.locals.auth = auth;
  try {
    const session = await auth.api.getSession({
      headers: context.request.headers
    });
    context.locals.user = session?.user || null;
    context.locals.session = session?.session || null;
    if (session?.user) {
      const userId = session.user.id;
      const memberships = await db.select().from(trackerMembers).where(eq(trackerMembers.userId, userId)).limit(1);
      if (memberships.length === 0) {
        const trackerId = crypto.randomUUID();
        const now = /* @__PURE__ */ new Date();
        await db.transaction(async (tx) => {
          await tx.insert(trackers).values({
            id: trackerId,
            name: "My Budget",
            description: "Your personal financial workspace",
            currency: "USD",
            ownerId: userId,
            createdAt: now,
            updatedAt: now
          });
          await tx.insert(trackerMembers).values({
            id: crypto.randomUUID(),
            trackerId,
            userId,
            role: "owner",
            createdAt: now,
            updatedAt: now
          });
          const defaultIncomeCategories = [
            "Salary",
            "Freelance",
            "Business",
            "Investment",
            "Bonus",
            "Gift",
            "Other"
          ];
          const defaultExpenseCategories = [
            "Housing",
            "Utilities",
            "Groceries",
            "Dining",
            "Transportation",
            "Healthcare",
            "Insurance",
            "Shopping",
            "Entertainment",
            "Education",
            "Travel",
            "Personal",
            "Subscriptions",
            "Debt",
            "Savings",
            "Other"
          ];
          for (const name of defaultIncomeCategories) {
            await tx.insert(categories).values({
              id: crypto.randomUUID(),
              trackerId,
              name,
              type: "income",
              createdAt: now,
              updatedAt: now
            });
          }
          for (const name of defaultExpenseCategories) {
            await tx.insert(categories).values({
              id: crypto.randomUUID(),
              trackerId,
              name,
              type: "expense",
              createdAt: now,
              updatedAt: now
            });
          }
        });
      }
    }
  } catch (err) {
    console.error("Auth session error:", err);
    context.locals.user = null;
    context.locals.session = null;
  }
  const url = new URL(context.request.url);
  const isAppRoute = url.pathname.startsWith("/app");
  if (isAppRoute && !context.locals.user) {
    return context.redirect("/login");
  }
  if ((url.pathname === "/login" || url.pathname === "/register") && context.locals.user) {
    return context.redirect("/app/trackers");
  }
  return next();
});

const onRequest$1 = (context, next) => {
  if (context.isPrerendered) {
    context.locals.runtime ??= {
      env: process.env
    };
  }
  return next();
};

const onRequest = sequence(
	onRequest$1,
	onRequest$2
	
);

export { onRequest };
