import rateLimit from 'express-rate-limit';
import AppError from '../utils/AppError.js';

const MINUTE = 60 * 1000;

const tooManyRequests = (req, res, next) => {
    next(
        new AppError(429, "Too many attempts, please try again later" , "TOO_MANY_REQUESTS",

        ),
    );
} 

const createLimiter = (options) => 
    rateLimit({
        standardHeaders: "draft-8",
        legacyHeaders: false,
        handler: tooManyRequests,
        ...options,
    });

// Rate limiters for different routes
export const loginLimiter = createLimiter({
    windowMs: 15 * MINUTE,
    limit: 10,
    skipSuccessfulRequests: true,
});

// Rate limiter for signup route
export const signupLimiter = createLimiter({
    windowMs: 60 * MINUTE,
    limit: 20,
});

// Rate limiter for API routes
export const apiLimiter = createLimiter({
    windowMs: 15 * MINUTE,
    limit: 300,
});