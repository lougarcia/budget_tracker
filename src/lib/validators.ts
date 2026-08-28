import { z } from 'zod';

export const createTrackerSchema = z.object({
  name: z.string().min(1, 'Tracker name is required').max(100),
  description: z.string().max(255).optional(),
  currency: z.string().default('USD'),
});

export const updateTrackerSchema = createTrackerSchema.partial().extend({
  trackerId: z.string().min(1),
});

export const createTransactionSchema = z.object({
  trackerId: z.string().min(1),
  type: z.enum(['income', 'expense']),
  amount: z.number().int().positive('Amount must be positive'),
  currency: z.string().default('USD'),
  transactionDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD'),
  merchant: z.string().min(1, 'Merchant is required').max(100),
  description: z.string().max(255).optional(),
  categoryId: z.string().min(1, 'Category is required'),
  notes: z.string().max(500).optional(),
  paymentMethod: z.string().max(50).optional(),
});

export const updateTransactionSchema = createTransactionSchema.partial().extend({
  id: z.string().min(1),
});

export const createCategorySchema = z.object({
  trackerId: z.string().min(1),
  name: z.string().min(1, 'Category name is required').max(50),
  type: z.enum(['income', 'expense']),
  color: z.string().max(20).optional(),
  icon: z.string().max(50).optional(),
});

export const setBudgetSchema = z.object({
  trackerId: z.string().min(1),
  categoryId: z.string().min(1),
  year: z.number().int().min(2000).max(2100),
  month: z.number().int().min(1).max(12),
  amount: z.number().int().nonnegative('Budget amount cannot be negative'),
});

export const createInvitationSchema = z.object({
  trackerId: z.string().min(1),
  inviteeEmail: z.string().email('Invalid email address'),
  role: z.enum(['owner', 'member']).default('member'),
});

export const createRecurringSchema = z.object({
  trackerId: z.string().min(1),
  type: z.enum(['income', 'expense']),
  amount: z.number().int().positive('Amount must be positive'),
  categoryId: z.string().min(1, 'Category is required'),
  merchant: z.string().min(1, 'Merchant is required').max(100),
  description: z.string().max(255).optional(),
  frequency: z.enum(['weekly', 'biweekly', 'monthly', 'quarterly', 'yearly']),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD'),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().nullable(),
});

export const updateRecurringSchema = createRecurringSchema.partial().extend({
  id: z.string().min(1),
});

export const updateProfileSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(6, 'New password must be at least 6 characters'),
});

export const updatePreferencesSchema = z.object({
  defaultCurrency: z.string().min(1, 'Currency is required'),
});
