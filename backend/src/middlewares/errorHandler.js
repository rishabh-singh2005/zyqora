// ==================== GLOBAL ERROR HANDLER ====================
export const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // Handle Prisma unique constraint violation (P2002)
  if (err.code === "P2002") {
    statusCode = 409;
    const target = Array.isArray(err.meta?.target) ? err.meta.target.join(", ") : "field";
    message = `A record with this ${target} already exists.`;
  }

  // Handle Prisma record not found (P2025)
  if (err.code === "P2025") {
    statusCode = 404;
    message = "Requested record was not found.";
  }

  // Handle JSON parsing errors in express.json()
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    statusCode = 400;
    message = "Invalid JSON payload in request body.";
  }

  // Handle JWT errors
  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid authentication token.";
  } else if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Authentication token has expired.";
  }

  console.error(`[Error] ${req.method} ${req.originalUrl} - ${statusCode}: ${message}`);
  if (process.env.NODE_ENV !== "production" && err.stack) {
    console.error(err.stack);
  }

  return res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV !== "production" ? { stack: err.stack } : {}),
  });
};
