import { describe, it, expect, beforeEach } from 'vitest';
import { verifyTrackerAccess, requireTrackerAccess, requireTrackerOwner } from '../src/lib/auth-guards';

describe('Auth Guards', () => {
  describe('verifyTrackerAccess', () => {
    it('should return null for non-existent access', async () => {
      const mockDb = {
        select: () => ({
          from: () => ({
            where: () => ({
              limit: () => Promise.resolve([null]),
            }),
          }),
        }),
      };

      const result = await verifyTrackerAccess(mockDb as any, 'user-123', 'tracker-123');
      expect(result).toBeNull();
    });

    it('should return member for valid access', async () => {
      const mockMember = { id: 'member-123', role: 'member' };
      const mockDb = {
        select: () => ({
          from: () => ({
            where: () => ({
              limit: () => Promise.resolve([mockMember]),
            }),
          }),
        }),
      };

      const result = await verifyTrackerAccess(mockDb as any, 'user-123', 'tracker-123');
      expect(result).toEqual(mockMember);
    });
  });

  describe('requireTrackerAccess', () => {
    it('should throw error for non-existent access', async () => {
      const mockDb = {
        select: () => ({
          from: () => ({
            where: () => ({
              limit: () => Promise.resolve([null]),
            }),
          }),
        }),
      };

      await expect(
        requireTrackerAccess(mockDb as any, 'user-123', 'tracker-123')
      ).rejects.toThrow('FORBIDDEN: You do not have access to this tracker');
    });

    it('should return member for valid access', async () => {
      const mockMember = { id: 'member-123', role: 'member' };
      const mockDb = {
        select: () => ({
          from: () => ({
            where: () => ({
              limit: () => Promise.resolve([mockMember]),
            }),
          }),
        }),
      };

      const result = await requireTrackerAccess(mockDb as any, 'user-123', 'tracker-123');
      expect(result).toEqual(mockMember);
    });
  });

  describe('requireTrackerOwner', () => {
    it('should throw error for non-owner', async () => {
      const mockMember = { id: 'member-123', role: 'member' };
      const mockDb = {
        select: () => ({
          from: () => ({
            where: () => ({
              limit: () => Promise.resolve([mockMember]),
            }),
          }),
        }),
      };

      await expect(
        requireTrackerOwner(mockDb as any, 'user-123', 'tracker-123')
      ).rejects.toThrow('FORBIDDEN: Owner privileges required');
    });

    it('should return member for owner', async () => {
      const mockMember = { id: 'member-123', role: 'owner' };
      const mockDb = {
        select: () => ({
          from: () => ({
            where: () => ({
              limit: () => Promise.resolve([mockMember]),
            }),
          }),
        }),
      };

      const result = await requireTrackerOwner(mockDb as any, 'user-123', 'tracker-123');
      expect(result).toEqual(mockMember);
    });

    it('should throw error for non-existent access', async () => {
      const mockDb = {
        select: () => ({
          from: () => ({
            where: () => ({
              limit: () => Promise.resolve([null]),
            }),
          }),
        }),
      };

      await expect(
        requireTrackerOwner(mockDb as any, 'user-123', 'tracker-123')
      ).rejects.toThrow('FORBIDDEN: You do not have access to this tracker');
    });
  });
});