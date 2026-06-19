const express =
require("express");

const router =
express.Router();

const controller =
require("../controllers/auditController");

const authMiddleware =
require("../middleware/authMiddleware");

const roleMiddleware =
require("../middleware/roleMiddleware");

// ================= EMPLOYEE =================

router.get(
"/my-leaves",
authMiddleware,
controller.getMyLeaveHistory
);

router.get(
"/balances",
authMiddleware,
controller.getEmployeeBalances
);

// ================= HR =================

router.get(

"/leave-history",

authMiddleware,

roleMiddleware(
["HR"]
),

controller.getAllLeaveHistory

);

router.get(

"/leave-logs",

authMiddleware,

roleMiddleware(
["HR"]
),

controller.getLeaveLogs

);

router.get(

"/employee-history/:employeeId",

authMiddleware,

roleMiddleware(
["HR"]
),

controller.getEmployeeHistory

);

module.exports =
router;