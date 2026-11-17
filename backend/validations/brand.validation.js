const Joi = require("joi");

// Brand yaratish
const createBrandValidationSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  description: Joi.string().allow("", null),
  logo: Joi.string().allow("", null),
});

// Brand yangilash
const updateBrandValidationSchema = Joi.object({
  name: Joi.string().min(2).max(100),
  description: Joi.string().allow("", null),
  logo: Joi.string().allow("", null),
}).min(1);

module.exports = {
  createBrandValidationSchema,
  updateBrandValidationSchema,
};