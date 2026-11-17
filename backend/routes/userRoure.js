const express = require("express");
const router = express.Router();
const validate = require("../middleware/validate");

const authMiddleware = require("../middleware/auth.middleware");
const adminMiddleware = require("../middleware/admin.middleware");

const {
  createUserValidationSchema,
  updateUserValidationSchema,
} = require("../validations/user.validation");

const { 
  getAllUsers,
  getUserById, 
  createUser,
  updateUser,
  deleteUser
 } = require("../controllers/user.controller");

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Barcha foydalanuvchilarni olish
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Foydalanuvchilar ro'yxati
 */

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Bitta foydalanuvchini olish
 *     tags: [Users]
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
 *         description: Foydalanuvchi topildi
 *       404:
 *         description: Foydalanuvchi topilmadi
 */

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Yangi foydalanuvchi yaratish
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: techuser
 *               email:
 *                 type: string
 *                 example: user@gmail.com
 *               password:
 *                 type: string
 *                 example: tech123456
 *     responses:
 *       201:
 *         description: Foydalanuvchi yaratildi
 */

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Foydalanuvchini yangilash
 *     tags: [Users]
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
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Foydalanuvchi yangilandi
 */

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Foydalanuvchini o'chirish
 *     tags: [Users]
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
 *         description: Foydalanuvchi o'chirildi
 */

// Admin uchun
router.get("/", authMiddleware, adminMiddleware, getAllUsers);
router.post("/", authMiddleware, adminMiddleware, validate(createUserValidationSchema), createUser);
router.delete("/:id", authMiddleware, adminMiddleware, deleteUser);

// User uchun
router.get("/:id", authMiddleware, getUserById);
router.put("/:id", authMiddleware, validate(updateUserValidationSchema), updateUser);

module.exports = router;