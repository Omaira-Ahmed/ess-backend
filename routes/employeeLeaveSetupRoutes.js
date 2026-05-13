const express = require("express");
const router = express.Router();
const controller = require("../controllers/employeeLeaveSetupController");

// CREATE
router.post("/", controller.createSetup);

// GET ALL
router.get("/", controller.getAll);

// GET BY ID
router.get("/:id", controller.getById);

// GET BY EMPLOYEE
router.get("/employee/:employeeId", controller.getByEmployee);

// UPDATE
router.put("/:id", controller.updateSetup);

// DEACTIVATE
router.patch("/:id/deactivate", controller.deactivateSetup);

module.exports = router;