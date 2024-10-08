// lib/db.js
import { Pool } from 'pg';

const pool = new Pool({
  user: 'postgres',   // Ganti dengan username PostgreSQL Anda
  host: 'localhost',
  database: 'inventory_management',      // Nama database Anda
  password: 'postgres',  // Password PostgreSQL Anda
  port: 5432,                   // Port default PostgreSQL
});

export default pool;
