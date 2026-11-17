const adminMiddleware = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      message: "Bu amal faqat admin uchun!",
    });
  }

  next();
};

module.exports = adminMiddleware;