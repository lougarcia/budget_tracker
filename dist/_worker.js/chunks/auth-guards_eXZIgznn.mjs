globalThis.process ??= {}; globalThis.process.env ??= {};
import { t as trackerMembers, a as and, e as eq } from './schema_D3bIJDv1.mjs';

async function verifyTrackerAccess(db, userId, trackerId) {
  const [member] = await db.select().from(trackerMembers).where(and(eq(trackerMembers.trackerId, trackerId), eq(trackerMembers.userId, userId))).limit(1);
  return member || null;
}
async function requireTrackerAccess(db, userId, trackerId) {
  const member = await verifyTrackerAccess(db, userId, trackerId);
  if (!member) {
    throw new Error("FORBIDDEN: You do not have access to this tracker");
  }
  return member;
}
async function requireTrackerOwner(db, userId, trackerId) {
  const member = await requireTrackerAccess(db, userId, trackerId);
  if (member.role !== "owner") {
    throw new Error("FORBIDDEN: Owner privileges required");
  }
  return member;
}

export { requireTrackerOwner as a, requireTrackerAccess as r };
