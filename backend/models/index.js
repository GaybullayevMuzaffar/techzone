const sequelize = require("../config/database");

// Models
const User = require("./user.model");
const Category = require("./category.model");
const Brand = require("./brand.model");
const Product = require("./product.model");
const Cart = require("./cart.model");
const Order = require("./order.model");
const OrderItem = require("./orderItem.model");
const Review = require("./review.model");

// Category - Product
Category.hasMany(Product, { foreignKey: "categoryId", as: "products" });
Product.belongsTo(Category, { foreignKey: "categoryId", as: "category" });

// Brand - Product
Brand.hasMany(Product, { foreignKey: "brandId", as: "products" });
Product.belongsTo(Brand, { foreignKey: "brandId", as: "brand" });

// User - Cart
User.hasMany(Cart, { foreignKey: "userId", as: "cartItems" });
Cart.belongsTo(User, { foreignKey: "userId", as: "user" });

// Product - Cart
Product.hasMany(Cart, { foreignKey: "productId", as: "cartItems" });
Cart.belongsTo(Product, { foreignKey: "productId", as: "product" });

// User - Order
User.hasMany(Order, { foreignKey: "userId", as: "orders" });
Order.belongsTo(User, { foreignKey: "userId", as: "user" });

// Order - OrderItem
Order.hasMany(OrderItem, { foreignKey: "orderId", as: "items" });
OrderItem.belongsTo(Order, { foreignKey: "orderId", as: "order" });

// Product - OrderItem
Product.hasMany(OrderItem, { foreignKey: "productId", as: "orderItems" });
OrderItem.belongsTo(Product, { foreignKey: "productId", as: "product" });

// User - Review
User.hasMany(Review, { foreignKey: "userId", as: "reviews" });
Review.belongsTo(User, { foreignKey: "userId", as: "user" });

// Product - Review
Product.hasMany(Review, { foreignKey: "productId", as: "reviews" });
Review.belongsTo(Product, { foreignKey: "productId", as: "product" });

module.exports = {
  sequelize,
  User,
  Category,
  Brand,
  Product,
  Cart,
  Order,
  OrderItem,
  Review,
};