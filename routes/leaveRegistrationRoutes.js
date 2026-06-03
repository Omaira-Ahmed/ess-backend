const express = require("express");
const router = express.Router();

const controller =
require("../controllers/leaveRegistrationController");

const authMiddleware =
require("../middleware/authMiddleware");

const roleMiddleware =
require("../middleware/roleMiddleware");

router.post(
"/:applicationId",
authMiddleware,
roleMiddleware(
["HR","Manager"]
),
controller.registerLeave
);

module.exports = router;