const { Category } = require("../models");

// 1. Barcha kategoriyalarni olish
const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.findAll();

    res.status(200).json({
      message: "Kategoriyalar olindi",
      data: categories,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server xatoligi",
      error: error.message,
    });
  }
};

// 2. Bitta kategoriyani olish
const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findByPk(id);

    if (!category) {
      return res.status(404).json({
        message: "Kategoriya topilmadi",
      });
    }

    res.status(200).json({
      data: category,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server xatoligi",
      error: error.message,
    });
  }
};

// 3. Kategoriya yaratish
const createCategory = async (req, res) => {
  try {
    const { name, description, image } = req.body;

    const category = await Category.create({
      name,
      description,
      image,
    });

    res.status(201).json({
      message: "Kategoriya yaratildi",
      data: category,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server xatoligi",
      error: error.message,
    });
  }
};

// 4. Kategoriyani yangilash
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findByPk(id);

    if (!category) {
      return res.status(404).json({
        message: "Kategoriya topilmadi",
      });
    }

    await category.update(req.body);

    res.status(200).json({
      message: "Kategoriya yangilandi",
      data: category,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server xatoligi",
      error: error.message,
    });
  }
};

// 5. Kategoriyani o'chirish
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findByPk(id);

    if (!category) {
      return res.status(404).json({
        message: "Kategoriya topilmadi",
      });
    }

    await category.destroy();

    res.status(200).json({
      message: "Kategoriya o'chirildi",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server xatoligi",
      error: error.message,
    });
  }
};

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};