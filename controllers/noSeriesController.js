const model = require("../models/noSeriesModel");

// CREATE
const createSeries = async (req, res) => {
    try {
        const data = req.body;

        const result = await model.createSeries(data);

        res.status(201).json(result);

    } catch (err) {
        res.status(500).json({
            message: "Server error",
            error: err.message
        });
    }
};

// GET ALL
const getAllSeries = async (req, res) => {
    try {
        const result = await model.getAllSeries();

        res.status(200).json(result);

    } catch (err) {
        res.status(500).json({
            message: "Server error",
            error: err.message
        });
    }
};

// GET NEXT NUMBER
const getNextNumber = async (req, res) => {
    try {
        const { code } = req.params;

        const result = await model.getNextNumber(code);

        if (!result) {
            return res.status(404).json({
                message: "Series not found"
            });
        }

        res.status(200).json({
            next_number: result
        });

    } catch (err) {
        res.status(500).json({
            message: "Server error",
            error: err.message
        });
    }
};

module.exports = {
    createSeries,
    getAllSeries,
    getNextNumber
};