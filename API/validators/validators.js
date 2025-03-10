const joi = require("joi");

//sign-up schema
const newUserSchema = joi.object({
    FirstName: joi.string().min(2).max(50).required(),
    LastName: joi.string().min(2).max(50).required(),
    Email: joi.string().email().required(),
    PhoneNumber: joi.string().pattern(/^07\d{8}$/).required(),
    UserPassword: joi.string().min(6).required(),
});

//USER LOGIN SCHEMA
const loginSchema = joi.object({
    Email: joi.string().email().required(),
    UserPassword: joi.string().min(8).max(64).required(),
  });

//USER ROLE UPDATE SCHEMA
const editUserRoleSchema = joi.object({
  UserRole: joi.string()
      .valid('Admin', 'Customer')
      .required()
});

module.exports = { newUserSchema, loginSchema, editUserRoleSchema };