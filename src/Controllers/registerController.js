const bcrypt = require('bcrypt');
const crypto = require('crypto');
const emailService = require('../services/emailService');
const userModel = require('../Models/userModel');
const { UserSchema } = require('../Middleware/validation');

exports.registerUser = async (req, res) => {
  try {
    // Validate request body with Joi schema
    const { error } = UserSchema.validate(req.body, { abortEarly: false });
    if (error) {
      const errorMessages = error.details.map(detail => detail.message);
      return res.status(400).json({ errors: errorMessages });
    }

    const { username, email, password } = req.body;

    // Check for existing username or email
    const existingUser = await userModel.findByUsernameOrEmail(username, email);
    if (existingUser) {
      if (existingUser.username === username) {
        return res.status(409).json({ message: 'Username already exists' });
      }
      if (existingUser.email === email) {
        return res.status(409).json({ message: 'Email already registered' });
      }
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate a random confirmation code
    const confirmationCode = crypto.randomBytes(3).toString('hex');

    // Create pending user
    const pendingUser = await userModel.createPendingUser({
      username: username.trim(),
      email: email.trim().toLowerCase(),
      password: hashedPassword,
      confirmationCode,
    });

    // Send confirmation email
    try {
      await emailService.sendConfirmationEmail(email, confirmationCode);
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      return res.status(502).json({ message: 'Failed to send confirmation email. Please try again.' });
    }

    res.status(201).json({
      message: 'User registered! Please check your email for the confirmation code.',
    });
  } catch (err) {
    console.error('Registration error:', err.message || err);
    res.status(500).json({ message: 'Internal server error', error: err.message });
  }
};

exports.confirmUser = async (req, res) => {
  const { email, code } = req.body;

  if (!email || !code) {
    return res.status(400).json({ message: 'Email and confirmation code are required' });
  }

  try {
    const user = await userModel.findPendingUser(email.trim().toLowerCase(), code);
    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired confirmation code' });
    }

    const updated = await userModel.confirmUser(email, code);
    if (!updated) {
      return res.status(400).json({ message: 'Failed to confirm email' });
    }

    res.status(200).json({ message: 'Email confirmed! You can now log in.' });
  } catch (err) {
    console.error('Confirmation error:', err.message || err);
    res.status(500).json({ message: 'Internal server error', error: err.message });
  }
};