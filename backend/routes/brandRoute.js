const express = require("express");
const router = express.Router();
const validate = require("../middleware/validate");

const {
  createBrandValidationSchema,
  updateBrandValidationSchema,
} = require("../validations/brand.validation");

const authMiddleware = require("../middleware/auth.middleware");
const adminMiddleware = require("../middleware/admin.middleware");

const {
  getAllBrands,
  getBrandById,
  createBrand,
  updateBrand,
  deleteBrand,
} = require("../controllers/brand.controller");

/**
 * @swagger
 * tags:
 *   name: Brands
 *   description: Brand management
 */

/**
 * @swagger
 * /api/brands:
 *   get:
 *     summary: Barcha brendlarni olish
 *     tags: [Brands]
 *     responses:
 *       200:
 *         description: Brendlar ro'yxati
 */

/**
 * @swagger
 * /api/brands/{id}:
 *   get:
 *     summary: Bitta brendni olish
 *     tags: [Brands]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Brend topildi
 *       404:
 *         description: Brend topilmadi
 */

/**
 * @swagger
 * /api/brands:
 *   post:
 *     summary: Yangi brend yaratish
 *     tags: [Brands]
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
 *                 example: Apple
 *               description:
 *                 type: string
 *                 example: Technology brand
 *               logo:
 *                 type: string
 *                 example: https://example.com/apple.png
 *     responses:
 *       201:
 *         description: Brend yaratildi
 */

/**
 * @swagger
 * /api/brands/{id}:
 *   put:
 *     summary: Brendni yangilash
 *     tags: [Brands]
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
 *               name:
 *                 type: string
 *                 example: Samsung
 *               description:
 *                 type: string
 *               logo:
 *                 type: string
 *     responses:
 *       200:
 *         description: Brend yangilandi
 */

/**
 * @swagger
 * /api/brands/{id}:
 *   delete:
 *     summary: Brendni o'chirish
 *     tags: [Brands]
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
 *         description: Brend o'chirildi
 */

router.get("/", getAllBrands);
router.get("/:id", getBrandById);

router.post("/", authMiddleware, adminMiddleware, validate(createBrandValidationSchema), createBrand);
router.put("/:id", authMiddleware, adminMiddleware, validate(updateBrandValidationSchema), updateBrand);
router.delete("/:id", authMiddleware, adminMiddleware, deleteBrand);

module.exports = router;