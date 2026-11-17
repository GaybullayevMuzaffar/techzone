const Joi = require("joi");

const createReviewValidationSchema = Joi.object({
  rating: Joi.number().integer().min(1).max(5).required(),
  comment: Joi.string().min(3).required(),
  productId: Joi.number().integer().positive().required(),
});

const updateReviewValidationSchema = Joi.object({
  rating: Joi.number().integer().min(1).max(5),
  comment: Joi.string().min(3),
}).min(1);

module.exports = {
  createReviewValidationSchema,
  updateReviewValidationSchema,
};