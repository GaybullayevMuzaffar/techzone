const Joi = require("joi");

const createOrderValidationSchema = Joi.object({
  address: Joi.string().min(5).required(),
  phone: Joi.string().min(9).required(),
});

const updateOrderValidationSchema = Joi.object({
  address: Joi.string().min(5),
  phone: Joi.string().min(9),
}).min(1);

const updateOrderStatusValidationSchema = Joi.object({
  status: Joi.string()
    .valid("pending", "confirmed", "shipped", "delivered", "cancelled")
    .required(),
});

module.exports = {
  createOrderValidationSchema,
  updateOrderValidationSchema,
  updateOrderStatusValidationSchema,
};