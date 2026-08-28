import { eq, and } from 'drizzle-orm';
import { trackerMembers } from '../db/schema';
import type { DbClient } from '../db';

export async function verifyTrackerAccess(db: DbClient, userId: string, trackerId: string) {
  const [member] = await db
    .select()
    .from(trackerMembers)
    .where(and(eq(trackerMembers.trackerId, trackerId), eq(trackerMembers.userId, userId)))
    .limit(1);

  return member || null;
}

export async function requireTrackerAccess(db: DbClient, userId: string, trackerId: string) {
  const member = await verifyTrackerAccess(db, userId, trackerId);
  if (!member) {
    throw new Error('FORBIDDEN: You do not have access to this tracker');
  }
  return member;
}

export async function requireTrackerOwner(db: DbClient, userId: string, trackerId: string) {
  const member = await requireTrackerAccess(db, userId, trackerId);
  if (member.role !== 'owner') {
    throw new Error('FORBIDDEN: Owner privileges required');
  }
  return member;
}
