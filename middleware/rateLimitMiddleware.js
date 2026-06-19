const rateLimit = require("express-rate-limit");

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: {
        message: "Too many login attempts. Try again later."
    }
});

const leaveLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 20,
    message: {
        message: "Too many leave requests. Try again later."
    }
});

const cancelLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 10,
    message: {
        message: "Too many cancellation requests."
    }
});

const employeeLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 30,
    message: {
        message: "Too many employee operations."
    }
});

module.exports = {
    authLimiter,
    leaveLimiter,
    cancelLimiter,
    employeeLimiter
};