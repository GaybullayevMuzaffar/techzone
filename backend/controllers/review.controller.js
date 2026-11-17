const { Review, User, Product } = require("../models");

// 1. Barcha reviewlarni olish
const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.findAll({
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "username"],
        },
        {
          model: Product,
          as: "product",
        },
      ],
    });

    res.status(200).json({
      message: "Reviewlar olindi",
      data: reviews,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server xatoligi",
      error: error.message,
    });
  }
};

// 2. Bitta reviewni olish
const getReviewById = async (req, res) => {
  try {
    const { id } = req.params;

    const review = await Review.findByPk(id, {
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "username"],
        },
        {
          model: Product,
          as: "product",
        },
      ],
    });

    if (!review) {
      return res.status(404).json({
        message: "Review topilmadi",
      });
    }

    res.status(200).json({
      data: review,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server xatoligi",
      error: error.message,
    });
  }
};

// 3. Review yaratish
const createReview = async (req, res) => {
  try {
    const { rating, comment, productId } = req.body;

    const userId = req.user.id;

    const review = await Review.create({
      rating,
      comment,
      userId,
      productId,
    });

    res.status(201).json({
      message: "Review yaratildi",
      data: review,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server xatoligi",
      error: error.message,
    });
  }
};

// 4. Review yangilash
const updateReview = async (req, res) => {
  try {
    const { id } = req.params;

    const review = await Review.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
    });

    if (!review) {
      return res.status(404).json({
        message: "Review topilmadi",
      });
    }

    await review.update(req.body);

    res.status(200).json({
      message: "Review yangilandi",
      data: review,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server xatoligi",
      error: error.message,
    });
  }
};

// 5. Review o'chirish
const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;

    const review = await Review.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
    });

    if (!review) {
      return res.status(404).json({
        message: "Review topilmadi",
      });
    }

    await review.destroy();

    res.status(200).json({
      message: "Review o'chirildi",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server xatoligi",
      error: error.message,
    });
  }
};

module.exports = {
  getAllReviews,
  getReviewById,
  createReview,
  updateReview,
  deleteReview,
};