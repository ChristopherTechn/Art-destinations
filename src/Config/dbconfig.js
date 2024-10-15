// src/Config/dbconfig.js
require('dotenv').config();
const mysql = require('mysql2/promise');

// Create a connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

// Optional: Test the connection when the app starts
const testConnection = async () => {
  try {
    const connection = await pool.getConnection(); // Get a connection from the pool
    console.log('Connected to MySQL database');
    connection.release(); // Release the connection back to the pool
  } catch (err) {
    console.error('Error connecting to MySQL:', err);
  }
};

// Test the connection when the module is loaded
testConnection();

module.exports = pool; 
