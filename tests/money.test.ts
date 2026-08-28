import { describe, it, expect } from 'vitest';
import { formatMoney, parseDollarsToCents, calculateSummary } from '../src/lib/money';

describe('Money Utilities', () => {
  describe('formatMoney', () => {
    it('should format cents to dollars with default currency', () => {
      expect(formatMoney(1099)).toBe('$10.99');
    });

    it('should format zero amount', () => {
      expect(formatMoney(0)).toBe('$0.00');
    });

    it('should format large amounts', () => {
      expect(formatMoney(1000000)).toBe('$10,000.00');
    });

    it('should format negative amounts', () => {
      expect(formatMoney(-500)).toBe('-$5.00');
    });

    it('should format with different currency', () => {
      expect(formatMoney(1099, 'EUR')).toBe('€10.99');
    });

    it('should format with GBP', () => {
      expect(formatMoney(1099, 'GBP')).toBe('£10.99');
    });
  });

  describe('parseDollarsToCents', () => {
    it('should parse dollar string to cents', () => {
      expect(parseDollarsToCents('10.99')).toBe(1099);
    });

    it('should parse zero', () => {
      expect(parseDollarsToCents('0')).toBe(0);
    });

    it('should parse integer amounts', () => {
      expect(parseDollarsToCents('100')).toBe(10000);
    });

    it('should handle invalid input', () => {
      expect(parseDollarsToCents('invalid')).toBe(0);
    });

    it('should handle empty string', () => {
      expect(parseDollarsToCents('')).toBe(0);
    });

    it('should round to nearest cent', () => {
      expect(parseDollarsToCents('10.999')).toBe(1100);
    });
  });

  describe('calculateSummary', () => {
    it('should calculate summary for positive income and expenses', () => {
      const result = calculateSummary(500000, 300000);
      expect(result.income).toBe(500000);
      expect(result.expenses).toBe(300000);
      expect(result.netIncome).toBe(200000);
      expect(result.savingsRate).toBe(0.4);
    });

    it('should calculate summary with zero income', () => {
      const result = calculateSummary(0, 100000);
      expect(result.income).toBe(0);
      expect(result.expenses).toBe(100000);
      expect(result.netIncome).toBe(-100000);
      expect(result.savingsRate).toBe(0);
    });

    it('should calculate summary with zero expenses', () => {
      const result = calculateSummary(500000, 0);
      expect(result.income).toBe(500000);
      expect(result.expenses).toBe(0);
      expect(result.netIncome).toBe(500000);
      expect(result.savingsRate).toBe(1);
    });

    it('should calculate summary with equal income and expenses', () => {
      const result = calculateSummary(500000, 500000);
      expect(result.income).toBe(500000);
      expect(result.expenses).toBe(500000);
      expect(result.netIncome).toBe(0);
      expect(result.savingsRate).toBe(0);
    });

    it('should calculate summary with expenses exceeding income', () => {
      const result = calculateSummary(300000, 500000);
      expect(result.income).toBe(300000);
      expect(result.expenses).toBe(500000);
      expect(result.netIncome).toBe(-200000);
      expect(result.savingsRate).toBe(0);
    });

    it('should calculate summary with zero values', () => {
      const result = calculateSummary(0, 0);
      expect(result.income).toBe(0);
      expect(result.expenses).toBe(0);
      expect(result.netIncome).toBe(0);
      expect(result.savingsRate).toBe(0);
    });
  });
});