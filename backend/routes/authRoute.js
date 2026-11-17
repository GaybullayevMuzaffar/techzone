const express = require("express");
const router = express.Router();

const { register, login } = require("../controllers/auth.controller");

const validate = require("../middleware/validate");

const {
  registerValidationSchema,
  loginValidationSchema,
} = require("../validations/auth.validation");

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Ro'yxatdan o'tish va tizimga kirish
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Ro'yxatdan o'tish
 *     tags: [Auth]
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
 *         description: Ro'yxatdan o'tish muvaffaqiyatli
 *       400:
 *         description: Ma'lumotlar noto'g'ri yoki email band
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Tizimga kirish
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@gmail.com
 *               password:
 *                 type: string
 *                 example: tech123456
 *     responses:
 *       200:
 *         description: Login muvaffaqiyatli, JWT token qaytariladi
 *       401:
 *         description: Email yoki parol noto'g'ri
 */

router.post("/register", validate(registerValidationSchema), register);
router.post("/login", validate(loginValidationSchema), login);

module.exports = router;