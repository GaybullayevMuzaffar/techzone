const { Brand } = require("../models");

// 1. Barcha brendlarni olish
const getAllBrands = async (req, res) => {
  try {
    const brands = await Brand.findAll();

    res.status(200).json({
      message: "Brendlar olindi",
      data: brands,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server xatoligi",
      error: error.message,
    });
  }
};

// 2. Bitta brendni olish
const getBrandById = async (req, res) => {
  try {
    const { id } = req.params;

    const brand = await Brand.findByPk(id);

    if (!brand) {
      return res.status(404).json({
        message: "Brend topilmadi",
      });
    }

    res.status(200).json({
      data: brand,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server xatoligi",
      error: error.message,
    });
  }
};

// 3. Brend yaratish
const createBrand = async (req, res) => {
  try {
    const { name, description, logo } = req.body;

    const brand = await Brand.create({
      name,
      description,
      logo,
    });

    res.status(201).json({
      message: "Brend yaratildi",
      data: brand,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server xatoligi",
      error: error.message,
    });
  }
};

// 4. Brendni yangilash
const updateBrand = async (req, res) => {
  try {
    const { id } = req.params;

    const brand = await Brand.findByPk(id);

    if (!brand) {
      return res.status(404).json({
        message: "Brend topilmadi",
      });
    }

    await brand.update(req.body);

    res.status(200).json({
      message: "Brend yangilandi",
      data: brand,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server xatoligi",
      error: error.message,
    });
  }
};

// 5. Brendni o'chirish
const deleteBrand = async (req, res) => {
  try {
    const { id } = req.params;

    const brand = await Brand.findByPk(id);

    if (!brand) {
      return res.status(404).json({
        message: "Brend topilmadi",
      });
    }

    await brand.destroy();

    res.status(200).json({
      message: "Brend o'chirildi",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server xatoligi",
      error: error.message,
    });
  }
};

module.exports = {
  getAllBrands,
  getBrandById,
  createBrand,
  updateBrand,
  deleteBrand,
};