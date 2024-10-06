import dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config();

// Destructure required environment variables for PostgreSQL connection
const {
  DB_HOST_PROD,
  DB_NAME_PROD,
  DB_USER_PROD,
  DB_PASS_PROD,
  DB_PORT_PROD,
  DB_HOST_DEV,
  DB_NAME_DEV,
  DB_USER_DEV,
  DB_PASS_DEV,
  DB_PORT_DEV,
  DB_HOST_TEST,
  DB_NAME_TEST,
  DB_USER_TEST,
  DB_PASS_TEST,
  DB_PORT_TEST,
  ENV
} = process.env;

// Create a new Pool instance for managing PostgreSQL connections
// Default configuration is empty and will be overwritten based on environment
export let sqlClient = new Pool({
  host: '',
  port: 5432,
  database: '',
  user: '',
  password: ''
});

// Configure the Pool based on the environment
// Development environment
if (ENV == 'dev') {
  sqlClient = new Pool({
    host: DB_HOST_DEV,
    port: Number(DB_PORT_DEV) | 5432,
    database: DB_NAME_DEV,
    user: DB_USER_DEV,
    password: DB_PASS_DEV
  });
}

// Test environment
if (ENV == 'test') {
  sqlClient = new Pool({
    host: DB_HOST_TEST,
    port: Number(DB_PORT_TEST) | 5432,
    database: DB_NAME_TEST,
    user: DB_USER_TEST,
    password: DB_PASS_TEST
  });
}

// Production environment
if (ENV == 'production') {
  sqlClient = new Pool({
    host: DB_HOST_PROD,
    port: Number(DB_PORT_PROD),
    database: DB_NAME_PROD,
    user: DB_USER_PROD,
    password: DB_PASS_PROD
  });
}
