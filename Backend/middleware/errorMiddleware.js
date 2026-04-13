// 🔴 Global Error Handler
exports.errorMiddleware = (err, req, res, next) => {
  console.error(err.stack);

  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // 🔹 Mongoose Bad ObjectId Error
  if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid ${err.path}`;
  }

  // 🔹 Mongoose Duplicate Key Error
  if (err.code === 11000) {
    statusCode = 400;
    message = `Duplicate field value entered`;
  }

  // 🔹 Mongoose Validation Error
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((val) => val.message)
      .join(", ");
  }

  // 🔹 JWT Errors
  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token";
  }

  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token expired";
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
};



// 🔴 Handle 404 Not Found Routes
exports.notFound = (req, res, next) => {
  const error = new Error(`Route not found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};