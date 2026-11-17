const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Order = sequelize.define("Order", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },

  totalPrice: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
  },

  status: {
    type: DataTypes.ENUM(
      "pending",
      "confirmed",
      "shipped",
      "delivered",
      "cancelled"
    ),
    defaultValue: "pending",
  },

  address: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  phone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Order;