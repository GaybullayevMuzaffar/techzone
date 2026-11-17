const express = require("express");
const cors = require("cors");
require("dotenv").config();

// SWAGGER \\
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");

const { sequelize } = require("./models");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ROUTES \\
const categoryRoutes = require("./routes/categoryRoute");
app.use("/api/categories", categoryRoutes);

const brandRoutes = require("./routes/brandRoute");
app.use("/api/brands", brandRoutes);

const productRoutes = require("./routes/productRoute");
app.use("/api/products", productRoutes);

const cartRoutes = require("./routes/cartRoute");
app.use("/api/cart", cartRoutes);

const orderRoutes = require("./routes/orderRoute");
app.use("/api/orders", orderRoutes);

const reviewRoutes = require("./routes/reviewRoute");
app.use("/api/reviews", reviewRoutes);

const userRoutes = require("./routes/userRoure");
app.use("/api/users", userRoutes);

const authRoutes = require("./routes/authRoute");
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("TECHZONE backend ishlayapti!");
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await sequelize.authenticate();

    console.log("PostgreSQL database connected!");

    await sequelize.sync();

    console.log("All tables created successfully!");

    app.listen(PORT, () => {
      console.log(`TECHZONE server ${PORT}-portda ishlayapti`);
    });
  } catch (error) {
    console.log("Server error:", error.message);
  }
};

startServer();