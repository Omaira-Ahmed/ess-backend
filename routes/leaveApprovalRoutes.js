const express = require("express");

const router = express.Router();

const leaveApprovalController = require(
    "../controllers/leaveApprovalController"
);

console.log("LEAVE APPROVAL ROUTES LOADED");

// TEST ROUTE
router.get("/test", (req, res) => {
    res.send("Approval routes working");
});

// GET PENDING
router.get(
    "/pending/:managerId",
    leaveApprovalController.getPendingRequests
);

// APPROVE
router.patch(
    "/:applicationId/approve",
    leaveApprovalController.approveLeave
);

// REJECT
router.patch(
    "/:applicationId/reject",
    leaveApprovalController.rejectLeave
);

// HISTORY
router.get(
    "/history/:applicationId",
    leaveApprovalController.getApprovalHistory
);

module.exports = router;