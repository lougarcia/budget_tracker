import type { APIRoute } from 'astro';
import { createTransactionSchema, createTrackerSchema, createCategorySchema, setBudgetSchema, createInvitationSchema, createRecurringSchema, updateProfileSchema, changePasswordSchema, updatePreferencesSchema } from '../../lib/validators';
import { requireTrackerAccess, requireTrackerOwner } from '../../lib/auth-guards';

function calculateNextOccurrence(startDate: string, frequency: string): string {
  const date = new Date(startDate);
  const now = new Date();
  
  while (date <= now) {
    switch (frequency) {
      case 'weekly':
        date.setDate(date.getDate() + 7);
        break;
      case 'biweekly':
        date.setDate(date.getDate() + 14);
        break;
      case 'monthly':
        date.setMonth(date.getMonth() + 1);
        break;
      case 'quarterly':
        date.setMonth(date.getMonth() + 3);
        break;
      case 'yearly':
        date.setFullYear(date.getFullYear() + 1);
        break;
      default:
        date.setMonth(date.getMonth() + 1);
    }
  }
  
  return date.toISOString().split('T')[0];
}
import { transactions, categories, budgets, trackers, trackerMembers, trackerInvitations, user as userTable, recurringTransactions, userPreferences } from '../../db/schema';
import { eq, and, sql } from 'drizzle-orm';

export const POST: APIRoute = async (context) => {
  const user = context.locals.user;
  if (!user) {
    return new Response(JSON.stringify({ success: false, error: { code: 'UNAUTHENTICATED', message: 'Not logged in' } }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const db = context.locals.db;

  try {
    const body = await context.request.json();
    const { action, payload } = body;

    switch (action) {
      case 'transaction.create': {
        const data = createTransactionSchema.parse(payload);
        await requireTrackerAccess(db, user.id, data.trackerId);

        const id = crypto.randomUUID();
        const now = new Date();

        await db.insert(transactions).values({
          id,
          trackerId: data.trackerId,
          createdBy: user.id,
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
          updatedAt: now,
        });

        return new Response(JSON.stringify({ success: true, data: { id } }), {
          headers: { 'Content-Type': 'application/json' },
        });
      }

      case 'category.create': {
        const data = createCategorySchema.parse(payload);
        await requireTrackerAccess(db, user.id, data.trackerId);

        const id = crypto.randomUUID();
        const now = new Date();

        await db.insert(categories).values({
          id,
          trackerId: data.trackerId,
          name: data.name,
          type: data.type,
          color: data.color || null,
          icon: data.icon || null,
          createdAt: now,
          updatedAt: now,
        });

        return new Response(JSON.stringify({ success: true, data: { id } }), {
          headers: { 'Content-Type': 'application/json' },
        });
      }

      case 'budget.set': {
        const data = setBudgetSchema.parse(payload);
        await requireTrackerAccess(db, user.id, data.trackerId);

        const now = new Date();
        const [existing] = await db
          .select()
          .from(budgets)
          .where(
            and(
              eq(budgets.trackerId, data.trackerId),
              eq(budgets.categoryId, data.categoryId),
              eq(budgets.year, data.year),
              eq(budgets.month, data.month)
            )
          )
          .limit(1);

        if (existing) {
          await db
            .update(budgets)
            .set({
              amount: data.amount,
              updatedAt: now,
            })
            .where(eq(budgets.id, existing.id));

          return new Response(JSON.stringify({ success: true, data: { id: existing.id } }), {
            headers: { 'Content-Type': 'application/json' },
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
            updatedAt: now,
          });

          return new Response(JSON.stringify({ success: true, data: { id } }), {
            headers: { 'Content-Type': 'application/json' },
          });
        }
      }

      case 'transaction.delete': {
        const { id, trackerId } = payload;
        if (!id || !trackerId) {
          throw new Error('VALIDATION_ERROR: Missing id or trackerId');
        }
        await requireTrackerAccess(db, user.id, trackerId);

        const [existing] = await db
          .select()
          .from(transactions)
          .where(and(eq(transactions.id, id), eq(transactions.trackerId, trackerId)))
          .limit(1);

        if (!existing) {
          throw new Error('NOT_FOUND: Transaction not found');
        }

        await db.delete(transactions).where(eq(transactions.id, id));

        return new Response(JSON.stringify({ success: true, data: { id } }), {
          headers: { 'Content-Type': 'application/json' },
        });
      }

      case 'category.delete': {
        const { id, trackerId } = payload;
        if (!id || !trackerId) {
          throw new Error('VALIDATION_ERROR: Missing id or trackerId');
        }
        await requireTrackerAccess(db, user.id, trackerId);

        const [existing] = await db
          .select()
          .from(categories)
          .where(and(eq(categories.id, id), eq(categories.trackerId, trackerId)))
          .limit(1);

        if (!existing) {
          throw new Error('NOT_FOUND: Category not found');
        }

        const [txCount] = await db
          .select({ count: sql`count(*)` })
          .from(transactions)
          .where(eq(transactions.categoryId, id));

        if (txCount && Number(txCount.count) > 0) {
          throw new Error('CONFLICT: Cannot delete category with existing transactions');
        }

        await db.delete(categories).where(eq(categories.id, id));

        return new Response(JSON.stringify({ success: true, data: { id } }), {
          headers: { 'Content-Type': 'application/json' },
        });
      }

      case 'category.update': {
        const { id, trackerId, ...updates } = payload;
        if (!id || !trackerId) {
          throw new Error('VALIDATION_ERROR: Missing id or trackerId');
        }
        await requireTrackerAccess(db, user.id, trackerId);

        const [existing] = await db
          .select()
          .from(categories)
          .where(and(eq(categories.id, id), eq(categories.trackerId, trackerId)))
          .limit(1);

        if (!existing) {
          throw new Error('NOT_FOUND: Category not found');
        }

        const now = new Date();
        await db
          .update(categories)
          .set({ ...updates, updatedAt: now })
          .where(eq(categories.id, id));

        return new Response(JSON.stringify({ success: true, data: { id } }), {
          headers: { 'Content-Type': 'application/json' },
        });
      }

      case 'invitation.create': {
        const data = createInvitationSchema.parse(payload);
        await requireTrackerOwner(db, user.id, data.trackerId);

        const [existingMember] = await db
          .select()
          .from(trackerMembers)
          .innerJoin(userTable, eq(trackerMembers.userId, userTable.id))
          .where(
            and(
              eq(trackerMembers.trackerId, data.trackerId),
              eq(userTable.email, data.inviteeEmail)
            )
          )
          .limit(1);

        if (existingMember) {
          throw new Error('CONFLICT: User is already a member of this tracker');
        }

        const [existingInvitation] = await db
          .select()
          .from(trackerInvitations)
          .where(
            and(
              eq(trackerInvitations.trackerId, data.trackerId),
              eq(trackerInvitations.inviteeEmail, data.inviteeEmail),
              eq(trackerInvitations.status, 'pending')
            )
          )
          .limit(1);

        if (existingInvitation) {
          throw new Error('CONFLICT: Invitation already pending for this email');
        }

        const id = crypto.randomUUID();
        const now = new Date();
        const expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

        await db.insert(trackerInvitations).values({
          id,
          trackerId: data.trackerId,
          inviterId: user.id,
          inviteeEmail: data.inviteeEmail,
          role: data.role || 'member',
          status: 'pending',
          expiresAt,
          createdAt: now,
        });

        return new Response(JSON.stringify({ success: true, data: { id } }), {
          headers: { 'Content-Type': 'application/json' },
        });
      }

      case 'invitation.cancel': {
        const { id, trackerId } = payload;
        if (!id || !trackerId) {
          throw new Error('VALIDATION_ERROR: Missing id or trackerId');
        }
        await requireTrackerOwner(db, user.id, trackerId);

        const [existing] = await db
          .select()
          .from(trackerInvitations)
          .where(
            and(
              eq(trackerInvitations.id, id),
              eq(trackerInvitations.trackerId, trackerId),
              eq(trackerInvitations.status, 'pending')
            )
          )
          .limit(1);

        if (!existing) {
          throw new Error('NOT_FOUND: Invitation not found');
        }

        await db
          .update(trackerInvitations)
          .set({ status: 'cancelled' })
          .where(eq(trackerInvitations.id, id));

        return new Response(JSON.stringify({ success: true, data: { id } }), {
          headers: { 'Content-Type': 'application/json' },
        });
      }

      case 'recurring.create': {
        const data = createRecurringSchema.parse(payload);
        await requireTrackerAccess(db, user.id, data.trackerId);

        const id = crypto.randomUUID();
        const now = new Date();

        const nextOccurrence = calculateNextOccurrence(data.startDate, data.frequency);

        await db.insert(recurringTransactions).values({
          id,
          trackerId: data.trackerId,
          createdBy: user.id,
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
          updatedAt: now,
        });

        return new Response(JSON.stringify({ success: true, data: { id } }), {
          headers: { 'Content-Type': 'application/json' },
        });
      }

      case 'recurring.update': {
        const { id, trackerId, ...updates } = payload;
        if (!id || !trackerId) {
          throw new Error('VALIDATION_ERROR: Missing id or trackerId');
        }
        await requireTrackerAccess(db, user.id, trackerId);

        const [existing] = await db
          .select()
          .from(recurringTransactions)
          .where(and(eq(recurringTransactions.id, id), eq(recurringTransactions.trackerId, trackerId)))
          .limit(1);

        if (!existing) {
          throw new Error('NOT_FOUND: Recurring transaction not found');
        }

        const now = new Date();
        await db
          .update(recurringTransactions)
          .set({ ...updates, updatedAt: now })
          .where(eq(recurringTransactions.id, id));

        return new Response(JSON.stringify({ success: true, data: { id } }), {
          headers: { 'Content-Type': 'application/json' },
        });
      }

      case 'recurring.toggle': {
        const { id, trackerId, active } = payload;
        if (!id || !trackerId) {
          throw new Error('VALIDATION_ERROR: Missing id or trackerId');
        }
        await requireTrackerAccess(db, user.id, trackerId);

        const [existing] = await db
          .select()
          .from(recurringTransactions)
          .where(and(eq(recurringTransactions.id, id), eq(recurringTransactions.trackerId, trackerId)))
          .limit(1);

        if (!existing) {
          throw new Error('NOT_FOUND: Recurring transaction not found');
        }

        const now = new Date();
        await db
          .update(recurringTransactions)
          .set({ active: !!active, updatedAt: now })
          .where(eq(recurringTransactions.id, id));

        return new Response(JSON.stringify({ success: true, data: { id } }), {
          headers: { 'Content-Type': 'application/json' },
        });
      }

      case 'recurring.delete': {
        const { id, trackerId } = payload;
        if (!id || !trackerId) {
          throw new Error('VALIDATION_ERROR: Missing id or trackerId');
        }
        await requireTrackerAccess(db, user.id, trackerId);

        const [existing] = await db
          .select()
          .from(recurringTransactions)
          .where(and(eq(recurringTransactions.id, id), eq(recurringTransactions.trackerId, trackerId)))
          .limit(1);

        if (!existing) {
          throw new Error('NOT_FOUND: Recurring transaction not found');
        }

        await db.delete(recurringTransactions).where(eq(recurringTransactions.id, id));

        return new Response(JSON.stringify({ success: true, data: { id } }), {
          headers: { 'Content-Type': 'application/json' },
        });
      }

      case 'tracker.create': {
        const data = createTrackerSchema.parse(payload);
        const trackerId = crypto.randomUUID();
        const now = new Date();

        await db.transaction(async (tx) => {
          await tx.insert(trackers).values({
            id: trackerId,
            name: data.name,
            description: data.description || null,
            currency: data.currency || 'USD',
            ownerId: user.id,
            createdAt: now,
            updatedAt: now,
          });

          await tx.insert(trackerMembers).values({
            id: crypto.randomUUID(),
            trackerId,
            userId: user.id,
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

        return new Response(JSON.stringify({ success: true, data: { trackerId } }), {
          headers: { 'Content-Type': 'application/json' },
        });
      }

      case 'user.updateProfile': {
        const data = updateProfileSchema.parse(payload);
        const now = new Date();

        await db
          .update(userTable)
          .set({ name: data.name, updatedAt: now })
          .where(eq(userTable.id, user.id));

        return new Response(JSON.stringify({ success: true, data: { name: data.name } }), {
          headers: { 'Content-Type': 'application/json' },
        });
      }

      case 'user.changePassword': {
        const data = changePasswordSchema.parse(payload);

        const auth = context.locals.auth;
        await auth.api.changePassword({
          body: {
            newPassword: data.newPassword,
            currentPassword: data.currentPassword,
          },
          headers: context.request.headers,
        });

        return new Response(JSON.stringify({ success: true, data: { message: 'Password changed successfully' } }), {
          headers: { 'Content-Type': 'application/json' },
        });
      }

      case 'user.updatePreferences': {
        const data = updatePreferencesSchema.parse(payload);
        const now = new Date();

        const [existing] = await db
          .select()
          .from(userPreferences)
          .where(eq(userPreferences.userId, user.id))
          .limit(1);

        if (existing) {
          await db
            .update(userPreferences)
            .set({ defaultCurrency: data.defaultCurrency, updatedAt: now })
            .where(eq(userPreferences.userId, user.id));
        } else {
          await db.insert(userPreferences).values({
            id: crypto.randomUUID(),
            userId: user.id,
            defaultCurrency: data.defaultCurrency,
            createdAt: now,
            updatedAt: now,
          });
        }

        return new Response(JSON.stringify({ success: true, data: { defaultCurrency: data.defaultCurrency } }), {
          headers: { 'Content-Type': 'application/json' },
        });
      }

      default:
        return new Response(
          JSON.stringify({ success: false, error: { code: 'NOT_FOUND', message: 'Unknown RPC action' } }),
          { status: 404, headers: { 'Content-Type': 'application/json' } }
        );
    }
  } catch (err: any) {
    console.error('RPC Error:', err);
    const message = err.message || 'Internal error';
    let code = 'DATABASE_ERROR';
    if (message.startsWith('FORBIDDEN')) code = 'FORBIDDEN';
    else if (message.includes('validation') || err.name === 'ZodError') code = 'VALIDATION_ERROR';

    return new Response(
      JSON.stringify({ success: false, error: { code, message } }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
