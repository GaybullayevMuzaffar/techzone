const Joi = require("joi");

// Category yaratish
const createCategoryValidationSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  description: Joi.string().allow("", null),
  image: Joi.string().allow("", null),
});

// Category yangilash
const updateCategoryValidationSchema = Joi.object({
  name: Joi.string().min(2).max(100),
  description: Joi.string().allow("", null),
  image: Joi.string().allow("", null),
}).min(1);

module.exports = {
  createCategoryValidationSchema,
  updateCategoryValidationSchema,
};