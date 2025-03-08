const joi = require("joi");

//sign-up schema
const newUserSchema = joi.object({
    FirstName: joi.string().min(2).max(50).required(),
    LastName: joi.string().min(2).max(50).required(),
    Email: joi.string().email().required(),
    PhoneNumber: joi.string().pattern(/^(?:\+254\d{9}|\d{10})$/).required(),
    UserRole: joi.string().valid('Admin', 'Customer').required(),
    UserPassword: joi.string().min(6).required(),
    UserStatus: joi.string().valid('Active', 'Inactive').
    default('Active')
});

//USER LOGIN SCHEMA
const loginSchema = joi.object({
    Email: joi.string().email().required(),
    UserPassword: joi.string().min(8).max(64).required(),
  });

module.exports = { newUserSchema, loginSchema };