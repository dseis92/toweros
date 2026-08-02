/**
 * Database Reset Script
 *
 * Drops all tables and re-runs migrations.
 * WARNING: This will delete ALL data in the database!
 */

import { drizzle } from 'drizzle-orm/postgres-js';
import { sql } from 'drizzle-orm';
import postgres from 'postgres';
import * as dotenv from 'dotenv';
import * as readline from 'readline';

// Load environment variables
dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL environment variable is required');
  process.exit(1);
}

async function askConfirmation(): Promise<boolean> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question('⚠️  This will DELETE ALL DATA. Are you sure? (yes/no): ', (answer) => {
      rl.close();
      resolve(answer.toLowerCase() === 'yes');
    });
  });
}

async function resetDatabase() {
  console.log('🔴 Database Reset\n');
  console.log(`Database: ${DATABASE_URL.split('@')[1]}\n`);

  // Check if production
  if (process.env.NODE_ENV === 'production') {
    console.error('❌ Cannot reset database in production!');
    process.exit(1);
  }

  const confirmed = await askConfirmation();

  if (!confirmed) {
    console.log('✋ Reset cancelled\n');
    process.exit(0);
  }

  const client = postgres(DATABASE_URL);
  const db = drizzle(client);

  try {
    console.log('\n🗑️  Dropping all tables...');

    // Drop tables in reverse order of dependencies
    await db.execute(sql`DROP TABLE IF EXISTS events CASCADE`);
    await db.execute(sql`DROP TABLE IF EXISTS sync_queue CASCADE`);
    await db.execute(sql`DROP TABLE IF EXISTS photos CASCADE`);
    await db.execute(sql`DROP TABLE IF EXISTS documents CASCADE`);
    await db.execute(sql`DROP TABLE IF EXISTS tasks CASCADE`);
    await db.execute(sql`DROP TABLE IF EXISTS work_orders CASCADE`);
    await db.execute(sql`DROP TABLE IF EXISTS projects CASCADE`);
    await db.execute(sql`DROP TABLE IF EXISTS test_results CASCADE`);
    await db.execute(sql`DROP TABLE IF EXISTS equipment_connections CASCADE`);
    await db.execute(sql`DROP TABLE IF EXISTS equipment CASCADE`);
    await db.execute(sql`DROP TABLE IF EXISTS sectors CASCADE`);
    await db.execute(sql`DROP TABLE IF EXISTS sites CASCADE`);
    await db.execute(sql`DROP TABLE IF EXISTS account_lockouts CASCADE`);
    await db.execute(sql`DROP TABLE IF EXISTS login_attempts CASCADE`);
    await db.execute(sql`DROP TABLE IF EXISTS password_reset_tokens CASCADE`);
    await db.execute(sql`DROP TABLE IF EXISTS refresh_tokens CASCADE`);
    await db.execute(sql`DROP TABLE IF EXISTS devices CASCADE`);
    await db.execute(sql`DROP TABLE IF EXISTS sessions CASCADE`);
    await db.execute(sql`DROP TABLE IF EXISTS crews CASCADE`);
    await db.execute(sql`DROP TABLE IF EXISTS teams CASCADE`);
    await db.execute(sql`DROP TABLE IF EXISTS users CASCADE`);
    await db.execute(sql`DROP TABLE IF EXISTS companies CASCADE`);

    // Drop enums
    await db.execute(sql`DROP TYPE IF EXISTS user_role CASCADE`);
    await db.execute(sql`DROP TYPE IF EXISTS carrier CASCADE`);
    await db.execute(sql`DROP TYPE IF EXISTS site_status CASCADE`);
    await db.execute(sql`DROP TYPE IF EXISTS equipment_type CASCADE`);
    await db.execute(sql`DROP TYPE IF EXISTS equipment_status CASCADE`);
    await db.execute(sql`DROP TYPE IF EXISTS connection_type CASCADE`);
    await db.execute(sql`DROP TYPE IF EXISTS project_status CASCADE`);
    await db.execute(sql`DROP TYPE IF EXISTS work_order_type CASCADE`);
    await db.execute(sql`DROP TYPE IF EXISTS work_order_status CASCADE`);
    await db.execute(sql`DROP TYPE IF EXISTS priority_level CASCADE`);
    await db.execute(sql`DROP TYPE IF EXISTS task_status CASCADE`);

    console.log('✅ All tables dropped\n');

    console.log('🔄 Database reset complete!');
    console.log('Run `pnpm migrate` to recreate tables\n');
  } catch (error) {
    console.error('❌ Reset failed:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

resetDatabase();
