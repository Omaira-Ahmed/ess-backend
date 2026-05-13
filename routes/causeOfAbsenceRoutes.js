const express = require("express");
const router = express.Router();

const controller = require("../controllers/causeOfAbsenceController");

// CREATE
router.post("/", controller.createCause);

// GET ALL
router.get("/", controller.getCauses);

// GET BY ID
router.get("/:id", controller.getCauseById);

// UPDATE
router.put("/:id", controller.updateCause);

// DEACTIVATE
router.patch("/:id/deactivate", controller.deactivateCause);

module.exports = router;
