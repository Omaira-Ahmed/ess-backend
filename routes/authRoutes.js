const express = require("express");
const router = express.Router();

const rateLimit = require("express-rate-limit");

const {
    register,
    login
} = require("../controllers/authController");

// ================= RATE LIMITER =================

const authLimiter = rateLimit({

    windowMs: 15 * 60 * 1000, // 15 minutes

    max: 10,

    message: {
        message:
        "Too many login attempts. Try again later."
    }

});

// ================= AUTH ROUTES =================

// REGISTER
router.post(
    "/register",
    authLimiter,
    register
);

// LOGIN
router.post(
    "/login",
    authLimiter,
    login
);

module.exports = router;