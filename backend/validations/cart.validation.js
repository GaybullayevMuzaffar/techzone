const Joi = require("joi");

const createCartValidationSchema = Joi.object({
  quantity: Joi.number().integer().min(1).required(),
  productId: Joi.number().integer().positive().required()
});

const updateCartValidationSchema = Joi.object({
  quantity: Joi.number().integer().min(1).required(),
});

module.exports = {
  createCartValidationSchema,
  updateCartValidationSchema,
};