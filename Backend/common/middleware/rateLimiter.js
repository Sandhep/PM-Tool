import rateLimit from 'express-rate-limit';

const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,                 // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    error: 'Too many requests, please try again later.',
  },
  standardHeaders: true,   // return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false,    // disable `X-RateLimit-*` headers
});

export default apiRateLimiter;
