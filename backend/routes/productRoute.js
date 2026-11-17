const express = require("express");
const router = express.Router();
const validate = require("../middleware/validate");

const {
  createProductValidationSchema,
  updateProductValidationSchema,
} = require("../validations/product.validation");

const authMiddleware = require("../middleware/auth.middleware");
const adminMiddleware = require("../middleware/admin.middleware");

const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/product.controller");

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product management
 */

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Barcha mahsulotlarni olish
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Mahsulotlar ro'yxati
 */

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Bitta mahsulotni olish
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Mahsulot topildi
 *       404:
 *         description: Mahsulot topilmadi
 */

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Yangi mahsulot yaratish
 *     tags: [Products]
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
 *               - price
 *               - categoryId
 *               - brandId
 *             properties:
 *               name:
 *                 type: string
 *                 example: iPhone 17 Pro
 *               description:
 *                 type: string
 *                 example: Apple smartphone
 *               price:
 *                 type: number
 *                 example: 15000000
 *               stock:
 *                 type: integer
 *                 example: 10
 *               image:
 *                 type: string
 *               categoryId:
 *                 type: integer
 *                 example: 1
 *               brandId:
 *                 type: integer
 *                 example: 1
 *               specifications:
 *                 type: object
 *                 example:
 *                   ram: 12GB
 *                   storage: 256GB
 *                   battery: 5000mAh
 *     responses:
 *       201:
 *         description: Mahsulot yaratildi
 *       400:
 *         description: Validation xatoligi
 *       403:
 *         description: Faqat admin uchun
 */

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Mahsulotni yangilash
 *     tags: [Products]
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
 *               price:
 *                 type: number
 *               stock:
 *                 type: integer
 *               description:
 *                 type: string
 *               image:
 *                 type: string
 *               categoryId:
 *                 type: integer
 *               brandId:
 *                 type: integer
 *               specifications:
 *                 type: object
 *     responses:
 *       200:
 *         description: Mahsulot yangilandi
 */

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Mahsulotni o'chirish
 *     tags: [Products]
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
 *         description: Mahsulot o'chirildi
 */

router.get("/", getAllProducts);
router.get("/:id", getProductById);

router.post("/", authMiddleware, adminMiddleware, validate(createProductValidationSchema), createProduct);
router.put("/:id", authMiddleware, adminMiddleware, validate(updateProductValidationSchema), updateProduct);
router.delete("/:id", authMiddleware, adminMiddleware, deleteProduct);

module.exports = router;