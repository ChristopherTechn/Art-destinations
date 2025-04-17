const db = require('../Config/dbconfig'); // Ensure correct DB config import
const bcrypt = require('bcrypt');

// Register a user with pending status and confirmation code
const createPendingUser = async (userData) => {
  const checkQuery = `SELECT user_id FROM Users WHERE email = ?`;
  const insertQuery = `INSERT INTO Users (username, email, password, confirmation_code, code_expires, status) VALUES (?, ?, ?, ?, ?, ?)`;
  
  const values = [
    userData.username,
    userData.email,
    userData.password,
    userData.confirmationCode,
    new Date(Date.now() + 15 * 60 * 1000), // Code expires in 15 minutes
    'pending',
  ];

  try {
    const [existingUser] = await db.query(checkQuery, [userData.email]);
    if (existingUser.length > 0) {
      throw new Error('Email already registered. Please login or reset password.');
    }

    const [result] = await db.query(insertQuery, values);
    return { user_id: result.insertId, email: userData.email };
  } catch (error) {
    throw new Error('Error registering user: ' + error.message);
  }
};

// Confirm the user with the code and activate the account
const confirmUser = async (email, code) => {
  const updateQuery = `
    UPDATE Users 
    SET status = 'active', confirmation_code = NULL 
    WHERE email = ? AND confirmation_code = ? AND code_expires > NOW()
  `;
  
  try {
    const [result] = await db.query(updateQuery, [email, code]);
    if (result.affectedRows === 0) {
      throw new Error('Invalid or expired confirmation code.');
    }
    return true;
  } catch (error) {
    throw new Error('Error confirming user: ' + error.message);
  }
};

// Find user by username
const findUserByUsername = async (username) => {
  const query = `SELECT * FROM Users WHERE username = ?`;
  
  try {
    const [rows] = await db.query(query, [username]);
    return rows.length > 0 ? rows[0] : null;
  } catch (error) {
    throw new Error('Error fetching user: ' + error.message);
  }
};

// Validate user credentials (Login)
const validateUser = async (username, password) => {
  const user = await findUserByUsername(username);
  if (!user) return false;

  const isValidPassword = await bcrypt.compare(password, user.password);
  return isValidPassword ? user : false;
};

// Find pending user by email and confirmation code
const findPendingUser = async (email, code) => {
  const query = `SELECT * FROM Users WHERE email = ? AND confirmation_code = ? AND status = 'pending' AND code_expires > NOW()`;
  
  try {
    const [rows] = await db.query(query, [email, code]);
    return rows.length > 0 ? rows[0] : null;
  } catch (error) {
    throw new Error('Error finding pending user: ' + error.message);
  }
};

// NEW: Find user by username or email to check duplicates
const findByUsernameOrEmail = async (username, email) => {
  const query = `SELECT * FROM Users WHERE username = ? OR email = ?`;
  
  try {
    const [rows] = await db.query(query, [username, email]);
    return rows.length > 0 ? rows[0] : null;
  } catch (error) {
    throw new Error('Error checking for existing user: ' + error.message);
  }
};

// Export functions
module.exports = {
  createPendingUser,
  confirmUser,
  findUserByUsername,
  validateUser,
  findPendingUser,
  findByUsernameOrEmail, // Added this
};