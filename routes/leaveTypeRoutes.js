const express = require("express");
const router = express.Router();
const leaveTypeController = require("../controllers/leaveTypeController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, leaveTypeController.createLeaveType);

module.exports = router;