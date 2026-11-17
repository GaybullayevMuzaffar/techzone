const express = require("express");
const router = express.Router();
const validate = require("../middleware/validate");

const authMiddleware = require("../middleware/auth.middleware");
const adminMiddleware = require("../middleware/admin.middleware");

const {
  createOrderValidationSchema,
  updateOrderValidationSchema,
  updateOrderStatusValidationSchema
} = require("../validations/order.validation");

const {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  updateOrderStatus,
  deleteOrder,
} = require("../controllers/order.controller");

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order management
 */

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Foydalanuvchining buyurtmalarini olish
 *     tags: [Orders]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Buyurtmalar ro'yxati
 */

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Bitta buyurtmani olish
 *     tags: [Orders]
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
 *         description: Buyurtma topildi
 *       404:
 *         description: Buyurtma topilmadi
 */

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Savat asosida buyurtma yaratish
 *     tags: [Orders]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - address
 *               - phone
 *             properties:
 *               address:
 *                 type: string
 *                 example: Namangan, Bobur ko'chasi 12
 *               phone:
 *                 type: string
 *                 example: "+998901234567"
 *     responses:
 *       201:
 *         description: Buyurtma yaratildi
 *       400:
 *         description: Savat bo'sh yoki mahsulot yetarli emas
 */

/**
 * @swagger
 * /api/orders/{id}:
 *   put:
 *     summary: Buyurtma ma'lumotlarini yangilash
 *     tags: [Orders]
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
 *               address:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       200:
 *         description: Buyurtma yangilandi
 */

/**
 * @swagger
 * /api/orders/{id}/status:
 *   patch:
 *     summary: Buyurtma statusini admin tomonidan yangilash
 *     tags: [Orders]
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
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, confirmed, shipped, delivered, cancelled]
 *                 example: confirmed
 *     responses:
 *       200:
 *         description: Buyurtma statusi yangilandi
 *       403:
 *         description: Faqat admin ruxsatiga ega
 *       404:
 *         description: Buyurtma topilmadi
 */

/**
 * @swagger
 * /api/orders/{id}:
 *   delete:
 *     summary: Buyurtmani o'chirish
 *     tags: [Orders]
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
 *         description: Buyurtma o'chirildi
 */

router.get("/", authMiddleware, getAllOrders);
router.get("/:id", authMiddleware, getOrderById);

router.post(
  "/",
  authMiddleware,
  validate(createOrderValidationSchema),
  createOrder
);

router.put(
  "/:id",
  authMiddleware,
  validate(updateOrderValidationSchema),
  updateOrder
);

router.patch(
  "/:id/status",
  authMiddleware,
  adminMiddleware,
  validate(updateOrderStatusValidationSchema),
  updateOrderStatus
);

router.delete("/:id", authMiddleware, deleteOrder);

module.exports = router;