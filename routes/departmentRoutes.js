const express = require("express");

const router = express.Router();

const departmentController = require(
    "../controllers/departmentController"
);
const authMiddleware = require("../middleware/authMiddleware");

console.log("DEPARTMENT ROUTES LOADED");

router.post("/", authMiddleware, departmentController.createDepartment);



router.get(
    "/",
    departmentController.getDepartments
);

module.exports = router;