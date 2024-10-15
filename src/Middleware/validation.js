const Joi = require('joi');

const UserSchema = Joi.object({
  username: Joi.string().min(6).max(15).required(),
  email: Joi.string().email().required(),
  confirmEmail: Joi.string().valid(Joi.ref('email')).required().messages({
    'any.only': 'Emails do not match',
  }),
  password: Joi.string().min(8).required(),
  confirmPassword: Joi.string().valid(Joi.ref('password')).required().messages({
    'any.only': 'Passwords do not match',
  }),
});

module.exports = {
  UserSchema,
};
