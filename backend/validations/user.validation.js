const Joi = require("joi");

const createUserValidationSchema = Joi.object({
  username: Joi.string().min(3).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
});

const updateUserValidationSchema = Joi.object({
  username: Joi.string().min(3).max(50),
  email: Joi.string().email(),
}).min(1);

module.exports = {
  createUserValidationSchema,
  updateUserValidationSchema,
};