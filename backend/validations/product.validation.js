const Joi = require("joi");

// Mahsulot yaratish
const createProductValidationSchema = Joi.object({
  name: Joi.string().min(2).max(150).required(),
  description: Joi.string().allow("", null),
  price: Joi.number().positive().required(),
  stock: Joi.number().integer().min(0).default(0),
  image: Joi.string().allow("", null),
  specifications: Joi.object().default({}),
  categoryId: Joi.number().integer().positive().required(),
  brandId: Joi.number().integer().positive().required(),
});

// Mahsulotni yangilash
const updateProductValidationSchema = Joi.object({
  name: Joi.string().min(2).max(150),
  description: Joi.string().allow("", null),
  price: Joi.number().positive(),
  stock: Joi.number().integer().min(0),
  image: Joi.string().allow("", null),
  specifications: Joi.object(),
  categoryId: Joi.number().integer().positive(),
  brandId: Joi.number().integer().positive(),
}).min(1);

module.exports = {
  createProductValidationSchema,
  updateProductValidationSchema,
};