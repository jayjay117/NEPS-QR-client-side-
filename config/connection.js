const mysql = require('mysql2');
const dotenv = require('dotenv');
const { URL } = require('url');

dotenv.config();

if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL is missing. Check your .env file or environment settings.');
  process.exit(1); // Stop the app from continuing
}

const dbUrl = new URL(process.env.DATABASE_URL);

const connection = mysql.createConnection({
  host: dbUrl.hostname,
  port: dbUrl.port,
  user: dbUrl.username,
  password: dbUrl.password,
  database: dbUrl.pathname.replace('/', ''),
  ssl: {
    rejectUnauthorized: false,
  },
});

connection.connect((err) => {
  if (err) {
    console.error('❌ Error connecting to DB:', err.message);
    return;
  }
  console.log('✅ Connected to Railway DB');
});

module.exports = connection;
