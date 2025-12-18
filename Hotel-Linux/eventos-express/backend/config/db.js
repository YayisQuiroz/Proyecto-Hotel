const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_SERVER,   // ej: localhost o IP
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
  ssl: false // true solo si usas SSL
});

// Test opcional al iniciar
pool.on('connect', () => {
  console.log('Conectado a PostgreSQL');
});

pool.on('error', (err) => {
  console.error('Error inesperado en PostgreSQL', err);
  process.exit(1);
});

async function getPool() {
  return pool; // pg maneja el pool internamente
}

module.exports = { pool, getPool };
