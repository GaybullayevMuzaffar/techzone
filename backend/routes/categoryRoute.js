const express = require("express");
const router = express.Router();
const validate = require("../middleware/validate");

const {
  createCategoryValidationSchema,
  updateCategoryValidationSchema,
} = require("../validations/category.validation");

const authMiddleware = require("../middleware/auth.middleware");
const adminMiddleware = require("../middleware/admin.middleware");

const {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/category.controller");

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Category management
 */

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Barcha kategoriyalarni olish
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: Kategoriyalar ro'yxati
 */

/**
 * @swagger
 * /api/categories/{id}:
 *   get:
 *     summary: Bitta kategoriyani olish
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Kategoriya topildi
 *       404:
 *         description: Kategoriya topilmadi
 */

/**
 * @swagger
 * /api/categories:
 *   post:
 *     summary: Yangi kategoriya yaratish
 *     tags: [Categories]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: Smartphones
 *               description:
 *                 type: string
 *                 example: Smartfonlar kategoriyasi
 *               image:
 *                 type: string
 *                 example: https://example.com/image.jpg
 *     responses:
 *       201:
 *         description: Kategoriya yaratildi
 *       400:
 *         description: Validation xatoligi
 *       403:
 *         description: Faqat admin uchun
 */

/**
 * @swagger
 * /api/categories/{id}:
 *   put:
 *     summary: Kategoriyani yangilash
 *     tags: [Categories]
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
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: Laptops
 *               description:
 *                 type: string
 *                 example: Noutbuklar kategoriyasi
 *               image:
 *                 type: string
 *     responses:
 *       200:
 *         description: Kategoriya yangilandi
 *       404:
 *         description: Kategoriya topilmadi
 */

/**
 * @swagger
 * /api/categories/{id}:
 *   delete:
 *     summary: Kategoriyani o'chirish
 *     tags: [Categories]
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
 *         description: Kategoriya o'chirildi
 *       404:
 *         description: Kategoriya topilmadi
 *       403:
 *         description: Faqat admin uchun
 */

// User \\
router.get("/", getAllCategories);
router.get("/:id", getCategoryById);

// Admin \\
router.post("/", authMiddleware, adminMiddleware, validate(createCategoryValidationSchema), createCategory);
router.put("/:id", authMiddleware, adminMiddleware, validate(updateCategoryValidationSchema), updateCategory);
router.delete("/:id", authMiddleware, adminMiddleware, deleteCategory);

module.exports = router;