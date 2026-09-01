const fs = require('fs');
const path = require('path');
const { Client } = require('pg');
require('dotenv').config();

async function ensureDatabaseExists() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error('❌ DATABASE_URL is not set in environment.');
    process.exit(1);
  }

  // Parse target DB name and construct default DB URL
  const dbUrl = new URL(databaseUrl);
  const targetDbName = dbUrl.pathname.slice(1);
  
  if (!targetDbName) {
    console.error('❌ Could not parse database name from DATABASE_URL.');
    process.exit(1);
  }

  // Point connection to 'postgres' default database to check/create the target database
  dbUrl.pathname = '/postgres';
  const defaultDbUrl = dbUrl.toString();

  const client = new Client({ connectionString: defaultDbUrl });

  try {
    await client.connect();
    
    // Check if target database exists
    const res = await client.query(
      'SELECT 1 FROM pg_database WHERE datname = $1',
      [targetDbName]
    );

    if (res.rows.length === 0) {
      console.log(`⚠️ Database "${targetDbName}" does not exist. Creating...`);
      // CREATE DATABASE cannot run inside a transaction block or with parameters, so we do query interpolation.
      // since targetDbName is parsed from env and clean, this is safe.
      await client.query(`CREATE DATABASE "${targetDbName.replace(/"/g, '""')}"`);
      console.log(`✅ Database "${targetDbName}" created successfully.`);
    } else {
      console.log(`✅ Database "${targetDbName}" already exists.`);
    }
  } catch (err) {
    console.error('💥 Failed to ensure database exists:', err.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

async function runMigrations() {
  await ensureDatabaseExists();

  // Require the main DB pool after ensuring the database exists, so that the automatic test connection doesn't crash the script
  const pool = require('../src/config/db');
  console.log('🔄 Starting migration runner...');
  const client = await pool.connect();

  try {
    // 1. Ensure the schema_migrations table exists
    await client.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        version    VARCHAR(255) PRIMARY KEY,
        applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    // 2. Read migration files
    const migrationsDir = path.join(__dirname, '../migrations');
    const files = fs.readdirSync(migrationsDir)
      .filter(f => f.endsWith('.sql'))
      .sort();

    console.log(`Found ${files.length} migration file(s) in migrations directory.`);

    // 3. Run each pending migration
    for (const file of files) {
      const { rows } = await client.query(
        'SELECT 1 FROM schema_migrations WHERE version = $1',
        [file]
      );

      if (rows.length > 0) {
        console.log(`⏭️  Skipping: ${file} (already applied)`);
        continue;
      }

      console.log(`🚀 Applying migration: ${file}`);
      const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');

      // Execute migration inside transaction
      await client.query('BEGIN');
      try {
        await client.query(sql);
        await client.query(
          'INSERT INTO schema_migrations (version) VALUES ($1)',
          [file]
        );
        await client.query('COMMIT');
        console.log(`✅ Applied: ${file}`);
      } catch (err) {
        await client.query('ROLLBACK');
        console.error(`❌ Failed applying migration: ${file}`);
        throw err;
      }
    }

    console.log('✨ All migrations applied successfully!');
  } catch (err) {
    console.error('💥 Migration process failed:', err);
    process.exit(1);
  } finally {
    client.release();
    // End the pool so the process exits cleanly
    await pool.end();
  }
}

if (require.main === module) {
  runMigrations();
}

module.exports = {
  ensureDatabaseExists,
  runMigrations
};
