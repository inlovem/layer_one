// src/db/postgresPool.ts

import pkg from 'pg';
const { Pool } = pkg;

const isProduction = process.env.NODE_ENV === 'production';

const sslCert = process.env.PROD_SSL_CERT; 


const pool = new Pool({
  connectionString: process.env.LOCAL_DATABASE_URL,

  ssl: isProduction
    ? {
        rejectUnauthorized: true,
    
        ca: sslCert?.replace(/\\n/g, '\n'),
      }
    : false,
});

console.log('Creating Postgres Pool...');

export async function connectToDb() {
  try {

    const client = await pool.connect();
    console.log('PostgreSQL pool connection successful');
    client.release();
  } catch (err) {
    console.error('Failed to connect to PostgreSQL via pg Pool:', err);
    process.exit(1);
  }
}


export { pool };
