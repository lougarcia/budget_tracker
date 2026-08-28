globalThis.process ??= {}; globalThis.process.env ??= {};
import { o as objectType, s as stringType, n as numberType, i as enumType } from '../../chunks/astro/server_BZuKIedG.mjs';
import { r as requireTrackerAccess, a as requireTrackerOwner } from '../../chunks/auth-guards_eXZIgznn.mjs';
import { b as trackers, t as trackerMembers, c as categories, r as recurringTransactions, a as and, e as eq, h as trackerInvitations, u as user, s as sql, f as transactions, d as budgets } from '../../chunks/schema_D3bIJDv1.mjs';
export { renderers } from '../../renderers.mjs';

const createTrackerSchema = objectType({
  name: stringType().min(1, "Tracker name is required").max(100),
  description: stringType().max(255).optional(),
  currency: stringType().default("USD")
});
createTrackerSchema.partial().extend({
  trackerId: stringType().min(1)
});
const createTransactionSchema = objectType({
  trackerId: stringType().min(1),
  type: enumType(["income", "expense"]),
  amount: numberType().int().positive("Amount must be positive"),
  currency: stringType().default("USD"),
  transactionDate: stringType().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD"),
  merchant: stringType().min(1, "Merchant is required").max(100),
  description: stringType().max(255).optional(),
  categoryId: stringType().min(1, "Category is required"),
  notes: stringType().max(500).optional(),
  paymentMethod: stringType().max(50).optional()
});
createTransactionSchema.partial().extend({
  id: stringType().min(1)
});
const createCategorySchema = objectType({
  trackerId: stringType().min(1),
  name: stringType().min(1, "Category name is required").max(50),
  type: enumType(["income", "expense"]),
  color: stringType().max(20).optional(),
  icon: stringType().max(50).optional()
});
const setBudgetSchema = objectType({
  trackerId: stringType().min(1),
  categoryId: stringType().min(1),
  year: numberType().int().min(2e3).max(2100),
  month: numberType().int().min(1).max(12),
  amount: numberType().int().nonnegative("Budget amount cannot be negative")
});
const createInvitationSchema = objectType({
  trackerId: stringType().min(1),
  inviteeEmail: stringType().email("Invalid email address"),
  role: enumType(["owner", "member"]).default("member")
});
const createRecurringSchema = objectType({
  trackerId: stringType().min(1),
  type: enumType(["income", "expense"]),
  amount: numberType().int().positive("Amount must be positive"),
  categoryId: stringType().min(1, "Category is required"),
  merchant: stringType().min(1, "Merchant is required").max(100),
  description: stringType().max(255).optional(),
  frequency: enumType(["weekly", "biweekly", "monthly", "quarterly", "yearly"]),
  startDate: stringType().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD"),
  endDate: stringType().regex(/^\d{4}-\d{2}-\d{2}$/).optional().nullable()
});
createRecurringSchema.partial().extend({
  id: stringType().min(1)
});

function calculateNextOccurrence(startDate, frequency) {
  const date = new Date(startDate);
  const now = /* @__PURE__ */ new Date();
  while (date <= now) {
    switch (frequency) {
      case "weekly":
        date.setDate(date.getDate() + 7);
        break;
      case "biweekly":
        date.setDate(date.getDate() + 14);
        break;
      case "monthly":
        date.setMonth(date.getMonth() + 1);
        break;
      case "quarterly":
        date.setMonth(date.getMonth() + 3);
        break;
      case "yearly":
        date.setFullYear(date.getFullYear() + 1);
        break;
      default:
        date.setMonth(date.getMonth() + 1);
    }
  }
  return date.toISOString().split("T")[0];
}
const POST = async (context) => {
  const user$1 = context.locals.user;
  if (!user$1) {
    return new Response(JSON.stringify({ success: false, error: { code: "UNAUTHENTICATED", message: "Not logged in" } }), {
      status: 401,
      headers: { "Content-Type": "application/json" }
    });
  }
  const db = context.locals.db;
  try {
    const body = await context.request.json();
    const { action, payload } = body;
    switch (action) {
      case "transaction.create": {
        const data = createTransactionSchema.parse(payload);
        await requireTrackerAccess(db, user$1.id, data.trackerId);
        const id = crypto.randomUUID();
        const now = /* @__PURE__ */ new Date();
        await db.insert(transactions).values({
          id,
          trackerId: data.trackerId,
          createdBy: user$1.id,
          type: data.type,
          amount: data.amount,
          currency: data.currency,
          transactionDate: data.transactionDate,
          merchant: data.merchant,
          description: data.description || null,
          categoryId: data.categoryId,
          notes: data.notes || null,
          paymentMethod: data.paymentMethod || null,
          createdAt: now,
          updatedAt: now
        });
        return new Response(JSON.stringify({ success: true, data: { id } }), {
          headers: { "Content-Type": "application/json" }
        });
      }
      case "category.create": {
        const data = createCategorySchema.parse(payload);
        await requireTrackerAccess(db, user$1.id, data.trackerId);
        const id = crypto.randomUUID();
        const now = /* @__PURE__ */ new Date();
        await db.insert(categories).values({
          id,
          trackerId: data.trackerId,
          name: data.name,
          type: data.type,
          color: data.color || null,
          icon: data.icon || null,
          createdAt: now,
          updatedAt: now
        });
        return new Response(JSON.stringify({ success: true, data: { id } }), {
          headers: { "Content-Type": "application/json" }
        });
      }
      case "budget.set": {
        const data = setBudgetSchema.parse(payload);
        await requireTrackerAccess(db, user$1.id, data.trackerId);
        const now = /* @__PURE__ */ new Date();
        const [existing] = await db.select().from(budgets).where(
          and(
            eq(budgets.trackerId, data.trackerId),
            eq(budgets.categoryId, data.categoryId),
            eq(budgets.year, data.year),
            eq(budgets.month, data.month)
          )
        ).limit(1);
        if (existing) {
          await db.update(budgets).set({
            amount: data.amount,
            updatedAt: now
          }).where(eq(budgets.id, existing.id));
          return new Response(JSON.stringify({ success: true, data: { id: existing.id } }), {
            headers: { "Content-Type": "application/json" }
          });
        } else {
          const id = crypto.randomUUID();
          await db.insert(budgets).values({
            id,
            trackerId: data.trackerId,
            categoryId: data.categoryId,
            year: data.year,
            month: data.month,
            amount: data.amount,
            createdAt: now,
            updatedAt: now
          });
          return new Response(JSON.stringify({ success: true, data: { id } }), {
            headers: { "Content-Type": "application/json" }
          });
        }
      }
      case "transaction.delete": {
        const { id, trackerId } = payload;
        if (!id || !trackerId) {
          throw new Error("VALIDATION_ERROR: Missing id or trackerId");
        }
        await requireTrackerAccess(db, user$1.id, trackerId);
        const [existing] = await db.select().from(transactions).where(and(eq(transactions.id, id), eq(transactions.trackerId, trackerId))).limit(1);
        if (!existing) {
          throw new Error("NOT_FOUND: Transaction not found");
        }
        await db.delete(transactions).where(eq(transactions.id, id));
        return new Response(JSON.stringify({ success: true, data: { id } }), {
          headers: { "Content-Type": "application/json" }
        });
      }
      case "category.delete": {
        const { id, trackerId } = payload;
        if (!id || !trackerId) {
          throw new Error("VALIDATION_ERROR: Missing id or trackerId");
        }
        await requireTrackerAccess(db, user$1.id, trackerId);
        const [existing] = await db.select().from(categories).where(and(eq(categories.id, id), eq(categories.trackerId, trackerId))).limit(1);
        if (!existing) {
          throw new Error("NOT_FOUND: Category not found");
        }
        const [txCount] = await db.select({ count: sql`count(*)` }).from(transactions).where(eq(transactions.categoryId, id));
        if (txCount && Number(txCount.count) > 0) {
          throw new Error("CONFLICT: Cannot delete category with existing transactions");
        }
        await db.delete(categories).where(eq(categories.id, id));
        return new Response(JSON.stringify({ success: true, data: { id } }), {
          headers: { "Content-Type": "application/json" }
        });
      }
      case "category.update": {
        const { id, trackerId, ...updates } = payload;
        if (!id || !trackerId) {
          throw new Error("VALIDATION_ERROR: Missing id or trackerId");
        }
        await requireTrackerAccess(db, user$1.id, trackerId);
        const [existing] = await db.select().from(categories).where(and(eq(categories.id, id), eq(categories.trackerId, trackerId))).limit(1);
        if (!existing) {
          throw new Error("NOT_FOUND: Category not found");
        }
        const now = /* @__PURE__ */ new Date();
        await db.update(categories).set({ ...updates, updatedAt: now }).where(eq(categories.id, id));
        return new Response(JSON.stringify({ success: true, data: { id } }), {
          headers: { "Content-Type": "application/json" }
        });
      }
      case "invitation.create": {
        const data = createInvitationSchema.parse(payload);
        await requireTrackerOwner(db, user$1.id, data.trackerId);
        const [existingMember] = await db.select().from(trackerMembers).innerJoin(user, eq(trackerMembers.userId, user.id)).where(
          and(
            eq(trackerMembers.trackerId, data.trackerId),
            eq(user.email, data.inviteeEmail)
          )
        ).limit(1);
        if (existingMember) {
          throw new Error("CONFLICT: User is already a member of this tracker");
        }
        const [existingInvitation] = await db.select().from(trackerInvitations).where(
          and(
            eq(trackerInvitations.trackerId, data.trackerId),
            eq(trackerInvitations.inviteeEmail, data.inviteeEmail),
            eq(trackerInvitations.status, "pending")
          )
        ).limit(1);
        if (existingInvitation) {
          throw new Error("CONFLICT: Invitation already pending for this email");
        }
        const id = crypto.randomUUID();
        const now = /* @__PURE__ */ new Date();
        const expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1e3);
        await db.insert(trackerInvitations).values({
          id,
          trackerId: data.trackerId,
          inviterId: user$1.id,
          inviteeEmail: data.inviteeEmail,
          role: data.role || "member",
          status: "pending",
          expiresAt,
          createdAt: now
        });
        return new Response(JSON.stringify({ success: true, data: { id } }), {
          headers: { "Content-Type": "application/json" }
        });
      }
      case "invitation.cancel": {
        const { id, trackerId } = payload;
        if (!id || !trackerId) {
          throw new Error("VALIDATION_ERROR: Missing id or trackerId");
        }
        await requireTrackerOwner(db, user$1.id, trackerId);
        const [existing] = await db.select().from(trackerInvitations).where(
          and(
            eq(trackerInvitations.id, id),
            eq(trackerInvitations.trackerId, trackerId),
            eq(trackerInvitations.status, "pending")
          )
        ).limit(1);
        if (!existing) {
          throw new Error("NOT_FOUND: Invitation not found");
        }
        await db.update(trackerInvitations).set({ status: "cancelled" }).where(eq(trackerInvitations.id, id));
        return new Response(JSON.stringify({ success: true, data: { id } }), {
          headers: { "Content-Type": "application/json" }
        });
      }
      case "recurring.create": {
        const data = createRecurringSchema.parse(payload);
        await requireTrackerAccess(db, user$1.id, data.trackerId);
        const id = crypto.randomUUID();
        const now = /* @__PURE__ */ new Date();
        const nextOccurrence = calculateNextOccurrence(data.startDate, data.frequency);
        await db.insert(recurringTransactions).values({
          id,
          trackerId: data.trackerId,
          createdBy: user$1.id,
          type: data.type,
          amount: data.amount,
          categoryId: data.categoryId,
          merchant: data.merchant,
          description: data.description || null,
          frequency: data.frequency,
          startDate: data.startDate,
          endDate: data.endDate || null,
          nextOccurrence,
          active: true,
          createdAt: now,
          updatedAt: now
        });
        return new Response(JSON.stringify({ success: true, data: { id } }), {
          headers: { "Content-Type": "application/json" }
        });
      }
      case "recurring.update": {
        const { id, trackerId, ...updates } = payload;
        if (!id || !trackerId) {
          throw new Error("VALIDATION_ERROR: Missing id or trackerId");
        }
        await requireTrackerAccess(db, user$1.id, trackerId);
        const [existing] = await db.select().from(recurringTransactions).where(and(eq(recurringTransactions.id, id), eq(recurringTransactions.trackerId, trackerId))).limit(1);
        if (!existing) {
          throw new Error("NOT_FOUND: Recurring transaction not found");
        }
        const now = /* @__PURE__ */ new Date();
        await db.update(recurringTransactions).set({ ...updates, updatedAt: now }).where(eq(recurringTransactions.id, id));
        return new Response(JSON.stringify({ success: true, data: { id } }), {
          headers: { "Content-Type": "application/json" }
        });
      }
      case "recurring.toggle": {
        const { id, trackerId, active } = payload;
        if (!id || !trackerId) {
          throw new Error("VALIDATION_ERROR: Missing id or trackerId");
        }
        await requireTrackerAccess(db, user$1.id, trackerId);
        const [existing] = await db.select().from(recurringTransactions).where(and(eq(recurringTransactions.id, id), eq(recurringTransactions.trackerId, trackerId))).limit(1);
        if (!existing) {
          throw new Error("NOT_FOUND: Recurring transaction not found");
        }
        const now = /* @__PURE__ */ new Date();
        await db.update(recurringTransactions).set({ active: !!active, updatedAt: now }).where(eq(recurringTransactions.id, id));
        return new Response(JSON.stringify({ success: true, data: { id } }), {
          headers: { "Content-Type": "application/json" }
        });
      }
      case "recurring.delete": {
        const { id, trackerId } = payload;
        if (!id || !trackerId) {
          throw new Error("VALIDATION_ERROR: Missing id or trackerId");
        }
        await requireTrackerAccess(db, user$1.id, trackerId);
        const [existing] = await db.select().from(recurringTransactions).where(and(eq(recurringTransactions.id, id), eq(recurringTransactions.trackerId, trackerId))).limit(1);
        if (!existing) {
          throw new Error("NOT_FOUND: Recurring transaction not found");
        }
        await db.delete(recurringTransactions).where(eq(recurringTransactions.id, id));
        return new Response(JSON.stringify({ success: true, data: { id } }), {
          headers: { "Content-Type": "application/json" }
        });
      }
      case "tracker.create": {
        const data = createTrackerSchema.parse(payload);
        const trackerId = crypto.randomUUID();
        const now = /* @__PURE__ */ new Date();
        await db.transaction(async (tx) => {
          await tx.insert(trackers).values({
            id: trackerId,
            name: data.name,
            description: data.description || null,
            currency: data.currency || "USD",
            ownerId: user$1.id,
            createdAt: now,
            updatedAt: now
          });
          await tx.insert(trackerMembers).values({
            id: crypto.randomUUID(),
            trackerId,
            userId: user$1.id,
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
        return new Response(JSON.stringify({ success: true, data: { trackerId } }), {
          headers: { "Content-Type": "application/json" }
        });
      }
      default:
        return new Response(
          JSON.stringify({ success: false, error: { code: "NOT_FOUND", message: "Unknown RPC action" } }),
          { status: 404, headers: { "Content-Type": "application/json" } }
        );
    }
  } catch (err) {
    console.error("RPC Error:", err);
    const message = err.message || "Internal error";
    let code = "DATABASE_ERROR";
    if (message.startsWith("FORBIDDEN")) code = "FORBIDDEN";
    else if (message.includes("validation") || err.name === "ZodError") code = "VALIDATION_ERROR";
    return new Response(
      JSON.stringify({ success: false, error: { code, message } }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
