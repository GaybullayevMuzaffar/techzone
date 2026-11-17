const express = require("express");
const router = express.Router();
const validate = require("../middleware/validate");
const authMiddleware = require("../middleware/auth.middleware");

const {
  createCartValidationSchema,
  updateCartValidationSchema,
} = require("../validations/cart.validation");

const {
  getAllCartItems,
  getCartItemById,
  createCartItem,
  updateCartItem,
  deleteCartItem,
} = require("../controllers/cart.controller");

/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: Shopping cart management
 */

/**
 * @swagger
 * /api/cart:
 *   get:
 *     summary: Foydalanuvchining savatini olish
 *     tags: [Cart]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Savat ro'yxati
 */

/**
 * @swagger
 * /api/cart/{id}:
 *   get:
 *     summary: Savatdagi bitta mahsulotni olish
 *     tags: [Cart]
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
 *         description: Savat mahsuloti topildi
 *       404:
 *         description: Mahsulot topilmadi
 */

/**
 * @swagger
 * /api/cart:
 *   post:
 *     summary: Savatga mahsulot qo'shish
 *     tags: [Cart]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - quantity
 *               - productId
 *             properties:
 *               quantity:
 *                 type: integer
 *                 example: 2
 *               productId:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Mahsulot savatga qo'shildi
 *       401:
 *         description: Token talab qilinadi
 */

/**
 * @swagger
 * /api/cart/{id}:
 *   put:
 *     summary: Savatdagi mahsulot miqdorini o'zgartirish
 *     tags: [Cart]
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
 *             required:
 *               - quantity
 *             properties:
 *               quantity:
 *                 type: integer
 *                 example: 3
 *     responses:
 *       200:
 *         description: Savat yangilandi
 */

/**
 * @swagger
 * /api/cart/{id}:
 *   delete:
 *     summary: Savatdan mahsulotni o'chirish
 *     tags: [Cart]
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
 *         description: Mahsulot savatdan o'chirildi
 */

router.get("/", authMiddleware, getAllCartItems);
router.get("/:id", authMiddleware, getCartItemById);
router.post("/", authMiddleware, validate(createCartValidationSchema), createCartItem);
router.put("/:id", authMiddleware, validate(updateCartValidationSchema), updateCartItem);
router.delete("/:id", authMiddleware, deleteCartItem);

module.exports = router;