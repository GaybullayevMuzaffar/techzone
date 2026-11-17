const express = require("express");
const router = express.Router();
const validate = require("../middleware/validate");
const authMiddleware = require("../middleware/auth.middleware");

const {
  createReviewValidationSchema,
  updateReviewValidationSchema,
} = require("../validations/review.validation");

const {
  getAllReviews,
  getReviewById,
  createReview,
  updateReview,
  deleteReview,
} = require("../controllers/review.controller");

/**
 * @swagger
 * tags:
 *   name: Reviews
 *   description: Product reviews management
 */

/**
 * @swagger
 * /api/reviews:
 *   get:
 *     summary: Foydalanuvchining reviewlarini olish
 *     tags: [Reviews]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Reviewlar ro'yxati
 */

/**
 * @swagger
 * /api/reviews/{id}:
 *   get:
 *     summary: Bitta reviewni olish
 *     tags: [Reviews]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Review topildi
 *       404:
 *         description: Review topilmadi
 */

/**
 * @swagger
 * /api/reviews:
 *   post:
 *     summary: Mahsulotga review yozish
 *     tags: [Reviews]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - rating
 *               - comment
 *               - productId
 *             properties:
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 example: 5
 *               comment:
 *                 type: string
 *                 example: Juda yaxshi mahsulot!
 *               productId:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Review yaratildi
 */

/**
 * @swagger
 * /api/reviews/{id}:
 *   put:
 *     summary: Reviewni yangilash
 *     tags: [Reviews]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *               comment:
 *                 type: string
 *     responses:
 *       200:
 *         description: Review yangilandi
 */

/**
 * @swagger
 * /api/reviews/{id}:
 *   delete:
 *     summary: Reviewni o'chirish
 *     tags: [Reviews]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Review o'chirildi
 */

router.get("/", getAllReviews);
router.get("/:id", getReviewById);

router.post("/", authMiddleware, validate(createReviewValidationSchema), createReview);
router.put("/:id", authMiddleware, validate(updateReviewValidationSchema), updateReview);
router.delete("/:id", authMiddleware, deleteReview);

module.exports = router;