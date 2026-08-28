import { describe, it, expect } from 'vitest';
import {
  createTrackerSchema,
  createTransactionSchema,
  createCategorySchema,
  setBudgetSchema,
  createInvitationSchema,
  createRecurringSchema,
} from '../src/lib/validators';

describe('Validators', () => {
  describe('createTrackerSchema', () => {
    it('should validate a valid tracker', () => {
      const result = createTrackerSchema.safeParse({
        name: 'Personal Budget',
        description: 'My personal budget tracker',
        currency: 'USD',
      });
      expect(result.success).toBe(true);
    });

    it('should require a name', () => {
      const result = createTrackerSchema.safeParse({
        name: '',
        currency: 'USD',
      });
      expect(result.success).toBe(false);
    });

    it('should default currency to USD', () => {
      const result = createTrackerSchema.safeParse({
        name: 'Test Tracker',
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.currency).toBe('USD');
      }
    });
  });

  describe('createTransactionSchema', () => {
    it('should validate a valid expense transaction', () => {
      const result = createTransactionSchema.safeParse({
        trackerId: 'tracker-123',
        type: 'expense',
        amount: 5000,
        currency: 'USD',
        transactionDate: '2024-01-15',
        merchant: 'Whole Foods',
        categoryId: 'cat-123',
      });
      expect(result.success).toBe(true);
    });

    it('should validate a valid income transaction', () => {
      const result = createTransactionSchema.safeParse({
        trackerId: 'tracker-123',
        type: 'income',
        amount: 500000,
        currency: 'USD',
        transactionDate: '2024-01-15',
        merchant: 'Employer Inc',
        categoryId: 'cat-123',
      });
      expect(result.success).toBe(true);
    });

    it('should reject negative amounts', () => {
      const result = createTransactionSchema.safeParse({
        trackerId: 'tracker-123',
        type: 'expense',
        amount: -100,
        currency: 'USD',
        transactionDate: '2024-01-15',
        merchant: 'Store',
        categoryId: 'cat-123',
      });
      expect(result.success).toBe(false);
    });

    it('should reject invalid date format', () => {
      const result = createTransactionSchema.safeParse({
        trackerId: 'tracker-123',
        type: 'expense',
        amount: 100,
        currency: 'USD',
        transactionDate: '01-15-2024',
        merchant: 'Store',
        categoryId: 'cat-123',
      });
      expect(result.success).toBe(false);
    });

    it('should reject invalid type', () => {
      const result = createTransactionSchema.safeParse({
        trackerId: 'tracker-123',
        type: 'transfer',
        amount: 100,
        currency: 'USD',
        transactionDate: '2024-01-15',
        merchant: 'Store',
        categoryId: 'cat-123',
      });
      expect(result.success).toBe(false);
    });

    it('should require merchant', () => {
      const result = createTransactionSchema.safeParse({
        trackerId: 'tracker-123',
        type: 'expense',
        amount: 100,
        currency: 'USD',
        transactionDate: '2024-01-15',
        merchant: '',
        categoryId: 'cat-123',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('createCategorySchema', () => {
    it('should validate a valid category', () => {
      const result = createCategorySchema.safeParse({
        trackerId: 'tracker-123',
        name: 'Groceries',
        type: 'expense',
      });
      expect(result.success).toBe(true);
    });

    it('should validate with optional fields', () => {
      const result = createCategorySchema.safeParse({
        trackerId: 'tracker-123',
        name: 'Groceries',
        type: 'expense',
        color: '#FF5733',
        icon: '🛒',
      });
      expect(result.success).toBe(true);
    });

    it('should reject invalid type', () => {
      const result = createCategorySchema.safeParse({
        trackerId: 'tracker-123',
        name: 'Groceries',
        type: 'transfer',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('setBudgetSchema', () => {
    it('should validate a valid budget', () => {
      const result = setBudgetSchema.safeParse({
        trackerId: 'tracker-123',
        categoryId: 'cat-123',
        year: 2024,
        month: 1,
        amount: 50000,
      });
      expect(result.success).toBe(true);
    });

    it('should reject invalid month', () => {
      const result = setBudgetSchema.safeParse({
        trackerId: 'tracker-123',
        categoryId: 'cat-123',
        year: 2024,
        month: 13,
        amount: 50000,
      });
      expect(result.success).toBe(false);
    });

    it('should reject negative amount', () => {
      const result = setBudgetSchema.safeParse({
        trackerId: 'tracker-123',
        categoryId: 'cat-123',
        year: 2024,
        month: 1,
        amount: -100,
      });
      expect(result.success).toBe(false);
    });
  });

  describe('createInvitationSchema', () => {
    it('should validate a valid invitation', () => {
      const result = createInvitationSchema.safeParse({
        trackerId: 'tracker-123',
        inviteeEmail: 'friend@example.com',
        role: 'member',
      });
      expect(result.success).toBe(true);
    });

    it('should reject invalid email', () => {
      const result = createInvitationSchema.safeParse({
        trackerId: 'tracker-123',
        inviteeEmail: 'not-an-email',
        role: 'member',
      });
      expect(result.success).toBe(false);
    });

    it('should default role to member', () => {
      const result = createInvitationSchema.safeParse({
        trackerId: 'tracker-123',
        inviteeEmail: 'friend@example.com',
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.role).toBe('member');
      }
    });
  });

  describe('createRecurringSchema', () => {
    it('should validate a valid recurring transaction', () => {
      const result = createRecurringSchema.safeParse({
        trackerId: 'tracker-123',
        type: 'expense',
        amount: 1500,
        categoryId: 'cat-123',
        merchant: 'Netflix',
        frequency: 'monthly',
        startDate: '2024-01-01',
      });
      expect(result.success).toBe(true);
    });

    it('should validate with optional end date', () => {
      const result = createRecurringSchema.safeParse({
        trackerId: 'tracker-123',
        type: 'expense',
        amount: 1500,
        categoryId: 'cat-123',
        merchant: 'Netflix',
        frequency: 'monthly',
        startDate: '2024-01-01',
        endDate: '2024-12-31',
      });
      expect(result.success).toBe(true);
    });

    it('should reject invalid frequency', () => {
      const result = createRecurringSchema.safeParse({
        trackerId: 'tracker-123',
        type: 'expense',
        amount: 1500,
        categoryId: 'cat-123',
        merchant: 'Netflix',
        frequency: 'daily',
        startDate: '2024-01-01',
      });
      expect(result.success).toBe(false);
    });

    it('should reject invalid start date format', () => {
      const result = createRecurringSchema.safeParse({
        trackerId: 'tracker-123',
        type: 'expense',
        amount: 1500,
        categoryId: 'cat-123',
        merchant: 'Netflix',
        frequency: 'monthly',
        startDate: '01-01-2024',
      });
      expect(result.success).toBe(false);
    });
  });
});