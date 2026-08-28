import { createClient } from '@libsql/client';
import * as schema from '../src/db/schema';
import { drizzle } from 'drizzle-orm/libsql';

const BASE_URL = process.env.BASE_URL || 'http://localhost:4321';
const EMAIL = process.env.SEED_EMAIL || 'demo@example.com';
const PASSWORD = process.env.SEED_PASSWORD || 'demo123';
const NAME = process.env.SEED_NAME || 'Demo User';

const client = createClient({
  url: process.env.DATABASE_URL || 'file:local.db',
  authToken: process.env.DATABASE_AUTH_TOKEN,
});

const db = drizzle(client, { schema });

async function seed() {
  console.log('Seeding database...');

  console.log(`Registering user: ${EMAIL}`);
  const res = await fetch(`${BASE_URL}/api/auth/sign-up/email`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: NAME, email: EMAIL, password: PASSWORD }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    if (res.status === 409 || (body.message && body.message.includes('already'))) {
      console.log('User already exists, fetching session...');
    } else {
      console.error('Registration failed:', res.status, body);
      console.error('Make sure the dev server is running: pnpm dev');
      process.exit(1);
    }
  } else {
    console.log('User registered successfully.');
  }

  const userResult = await client.execute({ sql: 'SELECT id FROM "user" WHERE email = ?', args: [EMAIL] });
  if (userResult.rows.length === 0) {
    console.error('Could not find registered user in database.');
    process.exit(1);
  }
  const userId = userResult.rows[0].id as string;

  const memberResult = await client.execute({ sql: 'SELECT COUNT(*) as count FROM "tracker_members" WHERE user_id = ?', args: [userId] });
  const existingTrackers = (memberResult.rows[0] as any).count as number;
  if (existingTrackers > 0) {
    console.log(`User already has ${existingTrackers} tracker(s). Skipping tracker creation.`);
    console.log('Seed complete!');
    return;
  }

  const trackerId = crypto.randomUUID();
  const now = new Date();

  await db.insert(schema.trackers).values({
    id: trackerId,
    name: 'Personal Budget',
    description: 'Demo personal budget tracker',
    currency: 'USD',
    ownerId: userId,
    createdAt: now,
    updatedAt: now,
  });

  await db.insert(schema.trackerMembers).values({
    id: crypto.randomUUID(),
    trackerId,
    userId,
    role: 'owner',
    createdAt: now,
    updatedAt: now,
  });

  console.log('Created tracker and membership');

  const incomeCategories = ['Salary', 'Freelance', 'Bonus', 'Investment'];
  const expenseCategories = ['Housing', 'Groceries', 'Dining', 'Transportation', 'Utilities', 'Entertainment', 'Shopping', 'Healthcare'];

  const categoryMap = new Map<string, string>();

  for (const name of incomeCategories) {
    const catId = crypto.randomUUID();
    categoryMap.set(name, catId);
    await db.insert(schema.categories).values({
      id: catId, trackerId, name, type: 'income', createdAt: now, updatedAt: now,
    });
  }

  for (const name of expenseCategories) {
    const catId = crypto.randomUUID();
    categoryMap.set(name, catId);
    await db.insert(schema.categories).values({
      id: catId, trackerId, name, type: 'expense', createdAt: now, updatedAt: now,
    });
  }

  console.log('Created categories');

  const nowDate = new Date();
  const currentYear = nowDate.getFullYear();
  const currentMonth = nowDate.getMonth() + 1;

  const sampleTransactions = [
    { merchant: 'Employer Inc', type: 'income', category: 'Salary', amount: 500000 },
    { merchant: 'Whole Foods', type: 'expense', category: 'Groceries', amount: 8500 },
    { merchant: 'Netflix', type: 'expense', category: 'Entertainment', amount: 1500 },
    { merchant: 'Shell Gas', type: 'expense', category: 'Transportation', amount: 4500 },
    { merchant: 'Local Restaurant', type: 'expense', category: 'Dining', amount: 6500 },
    { merchant: 'Electric Company', type: 'expense', category: 'Utilities', amount: 12000 },
    { merchant: 'Rent Payment', type: 'expense', category: 'Housing', amount: 150000 },
    { merchant: 'Amazon', type: 'expense', category: 'Shopping', amount: 4500 },
    { merchant: 'Freelance Client', type: 'income', category: 'Freelance', amount: 150000 },
    { merchant: 'Doctor Visit', type: 'expense', category: 'Healthcare', amount: 7500 },
  ];

  for (let i = 0; i < sampleTransactions.length; i++) {
    const tx = sampleTransactions[i];
    const day = Math.min(15 + i, 28);
    const dateStr = `${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

    await db.insert(schema.transactions).values({
      id: crypto.randomUUID(),
      trackerId,
      createdBy: userId,
      type: tx.type,
      amount: tx.amount,
      currency: 'USD',
      transactionDate: dateStr,
      merchant: tx.merchant,
      description: null,
      categoryId: categoryMap.get(tx.category)!,
      notes: null,
      paymentMethod: i % 2 === 0 ? 'credit_card' : 'debit_card',
      createdAt: now,
      updatedAt: now,
    });
  }

  console.log('Created sample transactions');

  const recurringItems = [
    { merchant: 'Netflix', type: 'expense', category: 'Entertainment', amount: 1500, frequency: 'monthly' as const },
    { merchant: 'Gym Membership', type: 'expense', category: 'Healthcare', amount: 5000, frequency: 'monthly' as const },
    { merchant: 'Rent', type: 'expense', category: 'Housing', amount: 150000, frequency: 'monthly' as const },
  ];

  for (const rec of recurringItems) {
    await db.insert(schema.recurringTransactions).values({
      id: crypto.randomUUID(),
      trackerId,
      createdBy: userId,
      type: rec.type,
      amount: rec.amount,
      categoryId: categoryMap.get(rec.category)!,
      merchant: rec.merchant,
      description: null,
      frequency: rec.frequency,
      startDate: `${currentYear}-${String(currentMonth).padStart(2, '0')}-01`,
      endDate: null,
      nextOccurrence: `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-01`,
      active: true,
      createdAt: now,
      updatedAt: now,
    });
  }

  console.log('Created recurring transactions');
  console.log('Seed completed successfully!');
  console.log(`Login with: ${EMAIL} / ${PASSWORD}`);
}

seed().catch(console.error);