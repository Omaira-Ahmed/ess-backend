const express = require("express");
const router = express.Router();
const {
    authLimiter
} = require("../middleware/rateLimitMiddleware");

const {
    register,
    login
} = require("../controllers/authController");

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