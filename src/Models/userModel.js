// src/Models/userModel.js
const db = require('../Config/dbconfig'); // Assuming you have a db connection
const bcrypt = require('bcrypt'); // Import bcrypt for password hashing

// Function to register a user with pending status and confirmation code
const createPendingUser = async (userData) => {
  const query = `INSERT INTO Users (username, email, password, confirmation_code, code_expires, status) VALUES (?, ?, ?, ?, ?, ?)`;
  const values = [
    userData.username,
    userData.email,
    userData.password,
    userData.confirmationCode,
    new Date(Date.now() + 15 * 60 * 1000), // Code expires in 15 minutes
    'pending',
  ];

  try {
    const [result] = await db.execute(query, values);
    return { id: result.insertId, email: userData.email };
  } catch (error) {
    throw new Error('Error registering user: ' + error.message);
  }
};

// Function to confirm the user with the code
const confirmUser = async (email, code) => {
  const query = `UPDATE Users SET status = 'active' WHERE email = ? AND confirmation_code = ? AND code_expires > NOW()`;
  const values = [email, code];

  try {
    const [result] = await db.execute(query, values);
    return result.affectedRows > 0; // Return true if user was confirmed
  } catch (error) {
    throw new Error('Error confirming user: ' + error.message);
  }
};

// Function to find user by username
const findUserByUsername = async (username) => {
  const query = `SELECT * FROM Users WHERE username = ?`;
  const values = [username];

  try {
    const [rows] = await db.execute(query, values);
    return rows[0]; // Return the user object if found
  } catch (error) {
    throw new Error('Error fetching user: ' + error.message);
  }
};

// Function to validate user credentials
const validateUser = async (username, password) => {
  const user = await findUserByUsername(username);
  if (!user) return false; // If no user found, return false

  const isValidPassword = await bcrypt.compare(password, user.password);
  return isValidPassword ? user : false; // Return user if password is valid, else return false
};

// Export functions
module.exports = {
  createPendingUser,
  confirmUser,
  findUserByUsername,
  validateUser,
};
