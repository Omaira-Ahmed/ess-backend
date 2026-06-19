const express =
require(
"express"
);

const router =
express.Router();

const leaveApprovalController =
require(
"../controllers/leaveApprovalController"
);

const authMiddleware =
require(
"../middleware/authMiddleware"
);

const roleMiddleware =
require(
"../middleware/roleMiddleware"
);

const logger =
require("../utils/logger");

logger.info(
"LEAVE APPROVAL ROUTES LOADED"
);

// TEST

router.get(
"/test",
(req,res)=>{

res.send(
"Approval routes working"
);

}
);

// GET PENDING

router.get(

"/pending/:managerId",

authMiddleware,

roleMiddleware(
["HR","Manager"]
),

leaveApprovalController
.getPendingRequests

);

// APPROVE

router.patch(

"/:applicationId/approve",

authMiddleware,

roleMiddleware(
["HR","Manager"]
),

leaveApprovalController
.approveLeave

);

// REJECT

router.patch(

"/:applicationId/reject",

authMiddleware,

roleMiddleware(
["HR","Manager"]
),

leaveApprovalController
.rejectLeave

);

// HISTORY

router.get(

"/history/:applicationId",

authMiddleware,

roleMiddleware(
["HR","Manager"]
),

leaveApprovalController
.getApprovalHistory

);

module.exports =
router;