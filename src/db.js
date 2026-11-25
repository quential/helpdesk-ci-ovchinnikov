const { Pool } = require('pg');

function createPool() {
  return new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 5432),
    database: process.env.DB_NAME || 'helpdesk',
    user: process.env.DB_USER || 'student',
    password: process.env.DB_PASSWORD || 'local_training_only'
  });
}

async function initDb(pool) {
  await pool.query(`CREATE TABLE IF NOT EXISTS tickets (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    priority TEXT NOT NULL,
    response_minutes INTEGER NOT NULL
  )`);
}

module.exports = { createPool, initDb };
