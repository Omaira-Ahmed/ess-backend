const express = require("express");
const router = express.Router();

const controller = require("../controllers/leaveBalanceController");
const authMiddleware = require("../middleware/authMiddleware");

// GET BALANCE
router.get(
    "/:employee_id",
    authMiddleware,
    controller.getBalance
);

// UPDATE BALANCE
router.put(
    "/update/:employee_id",
    authMiddleware,
    controller.updateBalance
);

module.exports = router;