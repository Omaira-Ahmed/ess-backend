const express = require("express");
const router = express.Router();

const controller = require("../controllers/noSeriesController");

console.log("NO SERIES ROUTES LOADED");

// CREATE
router.post("/", controller.createSeries);

// GET ALL
router.get("/", controller.getAllSeries);

// GET NEXT NUMBER
router.get("/next/:code", controller.getNextNumber);

module.exports = router;