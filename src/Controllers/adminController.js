// src/Controllers/userController.js
const { getAllUsers } = require('../Models/userModel'); // Ensure the path is correct

const fetchAllUsers = async (req, res) => {
  console.log('Fetching all users...');
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error retrieving users.');
  }
};

module.exports = {
  fetchAllUsers,
};
