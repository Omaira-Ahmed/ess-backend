console.log("Auth routes loaded");

const express = require("express");
const router = express.Router();

const rateLimit = require("express-rate-limit");

const {
    register,
    login
} = require("../controllers/authController");

// ================= LOGIN RATE LIMITER =================

const loginLimiter = rateLimit({

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
    register
);

// LOGIN
router.post(
    "/login",
    loginLimiter,
    login
);

module.exports = router;