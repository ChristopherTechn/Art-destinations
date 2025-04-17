const bcrypt = require('bcrypt');
const crypto = require('crypto'); // Import crypto for generating random codes
const emailService = require('../services/emailService');
const userModel = require('../Models/userModel');
const { UserSchema } = require('../Middleware/validation'); // Use UserSchema for validation

exports.registerUser = async (req, res) => {
  try {
    // Validate the request body using the Joi schema
    const { error } = UserSchema.validate(req.body); // Validate using the correct schema
    if (error) return res.status(400).send(error.details[0].message);

    // Hash the password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // Generate a random confirmation code
    const confirmationCode = crypto.randomBytes(3).toString('hex'); // Generate a random 6-character hex code

    // Create user with pending status and confirmation code in the database
    await userModel.createPendingUser({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
      confirmationCode, // Save the confirmation code
    });

    // Send confirmation email with the code
    await emailService.sendConfirmationEmail(req.body.email, confirmationCode);

    res.status(201).send('User registered! Please check your email for the confirmation code.');
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal server error');
  }
};

exports.confirmUser = async (req, res) => {
  const { email, code } = req.body; // Retrieve email and code from the request body

  try {
    // Check if the email and code match a pending user
    const confirmed = await userModel.confirmUser(email, code);
    if (confirmed) {
      res.send('Email confirmed! You can now log in.');
    } else {
      res.status(400).send('Error confirming email or invalid/expired code.');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal server error');
  }
};
