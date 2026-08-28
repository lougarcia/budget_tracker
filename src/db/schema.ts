import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';

// Better Auth Tables
export const user = sqliteTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: integer('email_verified', { mode: 'boolean' }).notNull(),
  image: text('image'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});

export const session = sqliteTable('session', {
  id: text('id').primaryKey(),
  expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
  token: text('token').notNull().unique(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
});

export const account = sqliteTable('account', {
  id: text('id').primaryKey(),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  accessTokenExpiresAt: integer('access_token_expires_at', { mode: 'timestamp' }),
  refreshTokenExpiresAt: integer('refresh_token_expires_at', { mode: 'timestamp' }),
  scope: text('scope'),
  issuer: text('issuer'),
  password: text('password'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});

export const verification = sqliteTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }),
  updatedAt: integer('updated_at', { mode: 'timestamp' }),
});

export const userPreferences = sqliteTable('user_preferences', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  defaultCurrency: text('default_currency').notNull().default('USD'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});

// Budget Tracker Application Tables
export const trackers = sqliteTable('trackers', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  currency: text('currency').notNull().default('USD'),
  ownerId: text('owner_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  archivedAt: integer('archived_at', { mode: 'timestamp' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});

export const trackerMembers = sqliteTable('tracker_members', {
  id: text('id').primaryKey(),
  trackerId: text('tracker_id').notNull().references(() => trackers.id, { onDelete: 'cascade' }),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  role: text('role').notNull().default('member'), // 'owner' | 'member'
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
}, (table) => ({
  trackerUserIdx: index('tracker_user_idx').on(table.trackerId, table.userId),
  userIdx: index('member_user_idx').on(table.userId),
}));

export const trackerInvitations = sqliteTable('tracker_invitations', {
  id: text('id').primaryKey(),
  trackerId: text('tracker_id').notNull().references(() => trackers.id, { onDelete: 'cascade' }),
  inviterId: text('inviter_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  inviteeEmail: text('invitee_email').notNull(),
  role: text('role').notNull().default('member'),
  status: text('status').notNull().default('pending'), // 'pending' | 'accepted' | 'declined' | 'expired' | 'cancelled'
  expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  acceptedAt: integer('accepted_at', { mode: 'timestamp' }),
}, (table) => ({
  trackerStatusIdx: index('invitation_tracker_status_idx').on(table.trackerId, table.status),
  emailStatusIdx: index('invitation_email_status_idx').on(table.inviteeEmail, table.status),
}));

export const categories = sqliteTable('categories', {
  id: text('id').primaryKey(),
  trackerId: text('tracker_id').notNull().references(() => trackers.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  type: text('type').notNull(), // 'income' | 'expense'
  parentId: text('parent_id'),
  icon: text('icon'),
  color: text('color'),
  sortOrder: integer('sort_order').default(0),
  archivedAt: integer('archived_at', { mode: 'timestamp' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
}, (table) => ({
  trackerTypeIdx: index('category_tracker_type_idx').on(table.trackerId, table.type),
}));

export const budgets = sqliteTable('budgets', {
  id: text('id').primaryKey(),
  trackerId: text('tracker_id').notNull().references(() => trackers.id, { onDelete: 'cascade' }),
  categoryId: text('category_id').notNull().references(() => categories.id, { onDelete: 'cascade' }),
  year: integer('year').notNull(),
  month: integer('month').notNull(), // 1 - 12
  amount: integer('amount').notNull(), // minor units (cents)
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
}, (table) => ({
  trackerYearMonthCatIdx: index('budget_tracker_ym_cat_idx').on(table.trackerId, table.year, table.month, table.categoryId),
}));

export const transactions = sqliteTable('transactions', {
  id: text('id').primaryKey(),
  trackerId: text('tracker_id').notNull().references(() => trackers.id, { onDelete: 'cascade' }),
  createdBy: text('created_by').notNull().references(() => user.id, { onDelete: 'set null' }),
  type: text('type').notNull(), // 'income' | 'expense'
  amount: integer('amount').notNull(), // minor units (cents, positive integer)
  currency: text('currency').notNull().default('USD'),
  transactionDate: text('transaction_date').notNull(), // YYYY-MM-DD
  merchant: text('merchant').notNull(),
  description: text('description'),
  categoryId: text('category_id').notNull().references(() => categories.id, { onDelete: 'cascade' }),
  notes: text('notes'),
  paymentMethod: text('payment_method'), // e.g., 'cash', 'credit_card', 'debit_card', 'bank_transfer', etc.
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
}, (table) => ({
  trackerDateIdx: index('transaction_tracker_date_idx').on(table.trackerId, table.transactionDate),
  trackerCategoryIdx: index('transaction_tracker_cat_idx').on(table.trackerId, table.categoryId),
  trackerTypeIdx: index('transaction_tracker_type_idx').on(table.trackerId, table.type),
  trackerMerchantIdx: index('transaction_tracker_merchant_idx').on(table.trackerId, table.merchant),
}));

export const recurringTransactions = sqliteTable('recurring_transactions', {
  id: text('id').primaryKey(),
  trackerId: text('tracker_id').notNull().references(() => trackers.id, { onDelete: 'cascade' }),
  createdBy: text('created_by').notNull().references(() => user.id, { onDelete: 'set null' }),
  type: text('type').notNull(), // 'income' | 'expense'
  amount: integer('amount').notNull(), // minor units
  categoryId: text('category_id').notNull().references(() => categories.id, { onDelete: 'cascade' }),
  merchant: text('merchant').notNull(),
  description: text('description'),
  frequency: text('frequency').notNull(), // 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'yearly'
  startDate: text('start_date').notNull(), // YYYY-MM-DD
  endDate: text('end_date'), // YYYY-MM-DD
  nextOccurrence: text('next_occurrence').notNull(), // YYYY-MM-DD
  active: integer('active', { mode: 'boolean' }).notNull().default(true),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
}, (table) => ({
  trackerActiveIdx: index('recurring_tracker_active_idx').on(table.trackerId, table.active),
}));
