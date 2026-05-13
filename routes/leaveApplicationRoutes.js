const express = require("express");
const router = express.Router();

const controller = require("../controllers/leaveApplicationController");

// APPLY LEAVE
router.post("/", controller.applyLeave);

// GET ALL
router.get("/", controller.getAll);

// GET BY EMPLOYEE
router.get("/employee/:employeeId", controller.getByEmployee);

// APPROVE / REJECT
router.patch("/:id/status", controller.updateStatus);

// CANCEL
router.patch("/:id/cancel", controller.cancelLeave);

module.exports = router;
