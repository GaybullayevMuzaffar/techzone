const { User } = require("../models");
const bcrypt = require("bcryptjs");

// Barcha userlarni olish
const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ["id", "username", "email", "role"],
    });

    res.status(200).json({
      message: "Userlar olindi",
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server xatoligi",
      error: error.message,
    });
  }
};

// Bitta userni olish
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user.role !== "admin" && Number(id) !== req.user.id) {
      return res.status(403).json({
        message: "Siz faqat o'z profilingizni ko'ra olasiz!",
      });
    }

    const user = await User.findByPk(id, {
      attributes: ["id", "username", "email", "role"],
    });

    if (!user) {
      return res.status(404).json({
        message: "User topilmadi",
      });
    }

    res.status(200).json({
      message: "User topildi",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server xatoligi",
      error: error.message,
    });
  }
};

// Yangi user yaratish
const createUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "User yaratildi",
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Server xatoligi",
      error: error.message,
    });
  }
};

// User ma'lumotlarini yangilash
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email } = req.body;

    if (req.user.role !== "admin" && Number(id) !== req.user.id) {
      return res.status(403).json({
        message: "Siz faqat o'z profilingizni yangilay olasiz!",
      });
    }

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({
        message: "User topilmadi",
      });
    }

    await user.update({
      username,
      email,
    });

    res.status(200).json({
      message: "User yangilandi",
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Server xatoligi",
      error: error.message,
    });
  }
};

// Userni o'chirish
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({
        message: "User topilmadi",
      });
    }

    await user.destroy();

    res.status(200).json({
      message: "User o'chirildi",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server xatoligi",
      error: error.message,
    });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
};