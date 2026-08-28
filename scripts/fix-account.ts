import { createClient } from '@libsql/client';

const client = createClient({ url: 'file:local.db' });

async function main() {
  const email = process.argv[2];
  const password = process.argv[3];

  if (!email || !password) {
    console.log('Usage: node scripts/fix-account.ts <email> <password>');
    console.log('Example: node scripts/fix-account.ts bizlougarcia@gmail.com "!23Qweasd"');
    process.exit(1);
  }

  console.log(`Checking account for: ${email}`);

  const users = await client.execute({ sql: 'SELECT id, name, email FROM "user" WHERE email = ?', args: [email] });
  if (users.rows.length === 0) {
    console.log('No user found with that email. Go to /register to create an account.');
    process.exit(1);
  }
  const user = users.rows[0];
  console.log(`Found user: ${user.id} (${user.name})`);

  const accounts = await client.execute({ sql: 'SELECT id, provider_id, password FROM "account" WHERE user_id = ?', args: [user.id] });

  if (accounts.rows.length === 0) {
    console.log('No account row exists. The password hash is missing.');
    console.log('This means the user was not created through the registration form.');
    console.log('');
    console.log('Fix: Delete this user from the DB and re-register via /register.');
    console.log(`Run: node scripts/fix-account.ts delete ${email}`);
    
    if (process.argv[4] === 'delete') {
      console.log('\nDeleting user and all related data...');
      await client.execute({ sql: 'DELETE FROM "account" WHERE user_id = ?', args: [user.id] });
      await client.execute({ sql: 'DELETE FROM "session" WHERE user_id = ?', args: [user.id] });
      await client.execute({ sql: 'DELETE FROM "tracker_members" WHERE user_id = ?', args: [user.id] });
      await client.execute({ sql: 'DELETE FROM "tracker_invitations" WHERE inviter_id = ?', args: [user.id] });
      await client.execute({ sql: 'DELETE FROM "recurring_transactions" WHERE created_by = ?', args: [user.id] });
      await client.execute({ sql: 'DELETE FROM "transactions" WHERE created_by = ?', args: [user.id] });
      await client.execute({ sql: 'DELETE FROM "user" WHERE id = ?', args: [user.id] });
      console.log('Deleted. Now go to /register and create a new account.');
    }
  } else {
    const acct = accounts.rows[0];
    console.log(`Account row exists: ${acct.id}`);
    console.log(`  provider_id: ${acct.provider_id}`);
    console.log(`  has_password_hash: ${!!acct.password}`);
    
    if (acct.password) {
      console.log('\nThe account has a password hash. Login should work.');
      console.log('If it still fails, the password may be wrong. Re-register to reset it.');
    } else {
      console.log('\nNo password hash! Re-register to fix this.');
    }
  }
}

main().catch(console.error);