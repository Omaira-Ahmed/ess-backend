const express = require("express");
const router = express.Router();

const controller = require("../controllers/auditController");
const authMiddleware = require("../middleware/authMiddleware");

console.log("AUDIT ROUTES LOADED");

// ================= LEAVE LOGS =================
router.get(
    "/logs/leave",
    authMiddleware,
    controller.getLeaveLogs
);

// ================= EMPLOYEE HISTORY =================
router.get(
    "/employee-history/:id",
    authMiddleware,
    controller.getEmployeeHistory
);

module.exports = router;