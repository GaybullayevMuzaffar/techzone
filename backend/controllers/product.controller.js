const { Product, Category, Brand } = require("../models");

// 1. Barcha mahsulotlarni olish
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      include: [
        { model: Category, as: "category" },
        { model: Brand, as: "brand" },
      ],
    });

    res.status(200).json({
      message: "Mahsulotlar olindi",
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server xatoligi",
      error: error.message,
    });
  }
};

// 2. Bitta mahsulotni olish
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByPk(id, {
      include: [
        { model: Category, as: "category" },
        { model: Brand, as: "brand" },
      ],
    });

    if (!product) {
      return res.status(404).json({
        message: "Mahsulot topilmadi",
      });
    }

    res.status(200).json({
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server xatoligi",
      error: error.message,
    });
  }
};

// 3. Mahsulot yaratish
const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      stock,
      image,
      specifications,
      categoryId,
      brandId,
    } = req.body;

    const product = await Product.create({
      name,
      description,
      price,
      stock,
      image,
      specifications,
      categoryId,
      brandId,
    });

    res.status(201).json({
      message: "Mahsulot yaratildi",
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server xatoligi",
      error: error.message,
    });
  }
};

// 4. Mahsulotni yangilash
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({
        message: "Mahsulot topilmadi",
      });
    }

    await product.update(req.body);

    res.status(200).json({
      message: "Mahsulot yangilandi",
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server xatoligi",
      error: error.message,
    });
  }
};

// 5. Mahsulotni o'chirish
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({
        message: "Mahsulot topilmadi",
      });
    }

    await product.destroy();

    res.status(200).json({
      message: "Mahsulot o'chirildi",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server xatoligi",
      error: error.message,
    });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};