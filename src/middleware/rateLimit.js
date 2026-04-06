const rateLimit = require('express-rate-limit');

// 🔒 Global limiter (basic protection)
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per window
  standardHeaders: true, // return rate limit info in headers
  legacyHeaders: false, // disable X-RateLimit headers
  message: {
    success: false,
    message: 'Too many requests, please try again later',
  },
});

// 🔐 Auth limiter (stricter for login/register)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10, // only 10 attempts
  message: {
    success: false,
    message: 'Too many login attempts, please try again later',
  },
});

// 🚀 Heavy API limiter (for expensive routes)
const apiLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 50,
  message: {
    success: false,
    message: 'Too many requests to this endpoint',
  },
});

module.exports = {
  globalLimiter,
  authLimiter,
  apiLimiter,
};
