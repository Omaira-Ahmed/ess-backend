const express = require("express");
const router = express.Router();
const employeeController = require("../controllers/employeeController");
const authMiddleware = require("../middleware/authMiddleware");

// Protected route
router.post("/", authMiddleware, employeeController.createEmployee);

module.exports = router;