const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Crash early if DB connection is broken
pool.on('error', (err) => {
  console.error('❌ Unexpected PostgreSQL error:', err.message);
  process.exit(-1);
});

// Optional: test connection at startup
pool.connect((err, client, release) => {
  if (err) {
    console.error('❌ Failed to connect to PostgreSQL:', err.message);
    console.error('   Check your DATABASE_URL in .env');
    process.exit(-1);
  }
  release();
  console.log('✅ PostgreSQL connected');
});

module.exports = pool;
