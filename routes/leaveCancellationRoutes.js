const express = require("express");
const router = express.Router();

const controller = require("../controllers/leaveCancellationController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

console.log("LEAVE CANCELLATION ROUTES LOADED");

// TEST
router.get("/test", (req, res) => {
    res.send("Leave cancellation working");
});

// CANCEL LEAVE
router.patch(
    "/:applicationId",
    authMiddleware,
    roleMiddleware(["HR", "Manager"]),
    controller.cancelLeave
);

module.exports = router;