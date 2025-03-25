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

//NEW PRODUCT SCHEMA
const newProductSchema = joi.object({
  ProductName: joi.string().min(2).max(50).required(),
  Description: joi.string().min(2).max(250).required(),
  Price: joi.number().precision(2).positive().required(),
  StockQuantity: joi.number().integer().min(1).required(),  Category: joi.string().max(50).required(),
  ProductImage: joi.string().max(255),
  ProductDiscount: joi.number().integer().min(0)
});

module.exports = { newUserSchema, loginSchema, editUserRoleSchema, newProductSchema };