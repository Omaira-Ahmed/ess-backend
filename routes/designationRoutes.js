const express = require("express");

const router = express.Router();

const {
    createDesignation,
    getAllDesignations
} = require("../controllers/designationController");

router.post("/", createDesignation);

router.get("/", getAllDesignations);

module.exports = router;