const { Cart, Product } = require("../models");

// 1. Savatdagi mahsulotlarni olish
const getAllCartItems = async (req, res) => {
  try {
    const cartItems = await Cart.findAll({
      where: { userId: req.user.id },
      include: [{ model: Product, as: "product" }],
    });

    res.status(200).json({
      message: "Savat olindi",
      data: cartItems,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server xatoligi",
      error: error.message,
    });
  }
};

// 2. Bitta savat yozuvini olish
const getCartItemById = async (req, res) => {
  try {
    const { id } = req.params;

    const cartItem = await Cart.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
      include: [{ model: Product, as: "product" }],
    });

    if (!cartItem) {
      return res.status(404).json({
        message: "Savat mahsuloti topilmadi",
      });
    }

    res.status(200).json({
      data: cartItem,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server xatoligi",
      error: error.message,
    });
  }
};

// 3. Savatga mahsulot qo'shish
const createCartItem = async (req, res) => {
  try {
    const { quantity, productId } = req.body;
    const userId = req.user.id;

    const product = await Product.findByPk(productId);

    if (!product) {
      return res.status(404).json({
        message: "Mahsulot topilmadi",
      });
    }

    // Mahsulot savatda borligini tekshiramiz
    const existingCartItem = await Cart.findOne({
      where: {
        userId,
        productId,
      },
    });

    // Yangi umumiy miqdorni hisoblaymiz
    const newQuantity = existingCartItem
      ? existingCartItem.quantity + quantity
      : quantity;

    // Omborda yetarli mahsulot bormi?
    if (newQuantity > product.stock) {
      return res.status(400).json({
        message: "Omborda yetarli mahsulot mavjud emas",
      });
    }

    let cartItem;

    if (existingCartItem) {
      // Bor mahsulot miqdorini oshiramiz
      await existingCartItem.update({
        quantity: newQuantity,
      });

      cartItem = existingCartItem;
    } else {
      // Yangi mahsulot yaratamiz
      cartItem = await Cart.create({
        quantity,
        productId,
        userId,
      });
    }

    res.status(200).json({
      message: "Mahsulot savatga qo'shildi",
      data: cartItem,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server xatoligi",
      error: error.message,
    });
  }
};

// 4. Savatdagi mahsulot miqdorini yangilash
const updateCartItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    const cartItem = await Cart.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
    });

    if (!cartItem) {
      return res.status(404).json({
        message: "Savat mahsuloti topilmadi",
      });
    }

    const product = await Product.findByPk(cartItem.productId);

    if (!product || quantity < 1 || quantity > product.stock) {
      return res.status(400).json({
        message: "Mahsulot miqdori noto'g'ri yoki omborda yetarli emas",
      });
    }

    await cartItem.update({ quantity });

    res.status(200).json({
      message: "Savat yangilandi",
      data: cartItem,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server xatoligi",
      error: error.message,
    });
  }
};

// 5. Savatdan mahsulotni o'chirish
const deleteCartItem = async (req, res) => {
  try {
    const { id } = req.params;

    const cartItem = await Cart.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
    });

    if (!cartItem) {
      return res.status(404).json({
        message: "Savat mahsuloti topilmadi",
      });
    }

    await cartItem.destroy();

    res.status(200).json({
      message: "Mahsulot savatdan o'chirildi",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server xatoligi",
      error: error.message,
    });
  }
};

module.exports = {
  getAllCartItems,
  getCartItemById,
  createCartItem,
  updateCartItem,
  deleteCartItem,
};