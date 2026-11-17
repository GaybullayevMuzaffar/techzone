const { Order, User, OrderItem, Cart, Product, sequelize } = require("../models");

// 1. Barcha buyurtmalarni olish
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { userId: req.user.id },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "username", "email"],
        },
        {
          model: OrderItem,
          as: "items",
          include: [
            {
              model: Product,
              as: "product",
            },
          ],
        },
      ],
    });

    res.status(200).json({
      message: "Buyurtmalar olindi",
      data: orders,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server xatoligi",
      error: error.message,
    });
  }
};

// 2. Bitta buyurtmani olish
const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "username", "email"],
        },
        {
          model: OrderItem,
          as: "items",
          include: [{ model: Product, as: "product" }],
        },
      ],
    });

    if (!order) {
      return res.status(404).json({
        message: "Buyurtma topilmadi",
      });
    }

    res.status(200).json({
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server xatoligi",
      error: error.message,
    });
  }
};

// 3. Buyurtma yaratish
const createOrder = async (req, res) => {
  let transaction;

  try {
    transaction = await sequelize.transaction();

    const { address, phone } = req.body;
    const userId = req.user.id;

    // Foydalanuvchining savatini olish
    const cartItems = await Cart.findAll({
      where: { userId },
      transaction,
    });

    if (cartItems.length === 0) {
      const error = new Error("Savat bo'sh!");
      error.statusCode = 400;
      throw error;
    }

    // Mahsulotlarni bir xil tartibda tekshirish
    cartItems.sort((a, b) => a.productId - b.productId);

    let totalPrice = 0;
    const orderProducts = [];

    // Mahsulotlarni lock bilan olish
    for (const item of cartItems) {
      const product = await Product.findByPk(item.productId, {
        transaction,
        lock: transaction.LOCK.UPDATE,
      });

      if (!product) {
        throw new Error("Mahsulot topilmadi");
      }

      if (item.quantity > product.stock) {
        throw new Error(
          `${product.name} mahsulotidan yetarli miqdor yo'q`
        );
      }

      totalPrice += Number(product.price) * item.quantity;

      orderProducts.push({
        item,
        product,
      });
    }

    // Buyurtma yaratish
    const order = await Order.create(
      {
        userId,
        totalPrice,
        address,
        phone,
      },
      { transaction }
    );

    // OrderItem yaratish va stock kamaytirish
    for (const { item, product } of orderProducts) {
      await OrderItem.create(
        {
          orderId: order.id,
          productId: product.id,
          quantity: item.quantity,
          unitPrice: product.price,
        },
        { transaction }
      );

      await product.decrement("stock", {
        by: item.quantity,
        transaction,
      });
    }

    // Savatni tozalash
    await Cart.destroy({
      where: { userId },
      transaction,
    });

    await transaction.commit();

    res.status(201).json({
      message: "Buyurtma muvaffaqiyatli yaratildi!",
      data: {
        orderId: order.id,
        totalPrice,
        itemsCount: cartItems.length,
      },
    });
  } catch (error) {
    if (transaction && !transaction.finished) {
      await transaction.rollback();
    }

    res.status(error.statusCode || 500).json({
      message: error.statusCode
        ? error.message
        : "Buyurtma yaratishda xatolik",
      error: error.message,
    });
  }
};

// 4. Buyurtmani yangilash
const updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { address, phone } = req.body;

    const order = await Order.findOne({
      where: {
        id,
        userId: req.user.id,
      },
    });

    if (!order) {
      return res.status(404).json({
        message: "Buyurtma topilmadi",
      });
    }

    if (order.status !== "pending") {
      return res.status(400).json({
        message: "Faqat pending buyurtmani yangilash mumkin",
      });
    }

    await order.update({ address, phone });

    res.status(200).json({
      message: "Buyurtma yangilandi",
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server xatoligi",
      error: error.message,
    });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await Order.findByPk(id);

    if (!order) {
      return res.status(404).json({
        message: "Buyurtma topilmadi",
      });
    }

    await order.update({ status });

    res.status(200).json({
      message: "Buyurtma statusi yangilandi",
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server xatoligi",
      error: error.message,
    });
  }
};

// 5. Buyurtmani o'chirish
const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findOne({
      where: {
        id,
        userId: req.user.id,
      },
    });

    if (!order) {
      return res.status(404).json({
        message: "Buyurtma topilmadi",
      });
    }

    if (order.status !== "pending") {
      return res.status(400).json({
        message: "Faqat pending holatidagi buyurtmani o'chirish mumkin",
      });
    }

    await order.destroy();

    res.status(200).json({
      message: "Buyurtma o'chirildi",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server xatoligi",
      error: error.message,
    });
  }
};

module.exports = {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  updateOrderStatus,
  deleteOrder,
};