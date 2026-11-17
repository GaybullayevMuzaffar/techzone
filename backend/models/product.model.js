const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Product = sequelize.define("Product", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },

  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  description: {
    type: DataTypes.TEXT,
  },

  price: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
  },

  stock: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },

  image: {
    type: DataTypes.STRING,
  },

  specifications: {
    type: DataTypes.JSONB,
    defaultValue: {},
  },
});

module.exports = Product;