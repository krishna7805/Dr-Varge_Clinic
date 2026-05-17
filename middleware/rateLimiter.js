const rateLimit = require('express-rate-limit');

// Rate limiter for the contact form endpoint
// Allows 5 submissions per 15 minutes per IP address
const contactRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5,                    // max 5 requests per window per IP
    standardHeaders: true,     // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false,      // Disable the `X-RateLimit-*` headers
    message: {
        success: false,
        message: 'Too many appointment requests from this IP address. Please try again after 15 minutes.',
    },
});

module.exports = contactRateLimiter;
