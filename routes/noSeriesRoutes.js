const express = require("express");
const router = express.Router();

const controller = require("../controllers/noSeriesController");


const logger =
require("../utils/logger");

logger.info(
"NO SERIES ROUTES LOADED"
);

// CREATE
router.post("/", controller.createSeries);

// GET ALL
router.get("/", controller.getAllSeries);

// GET NEXT NUMBER
router.get("/next/:code", controller.getNextNumber);

module.exports = router;