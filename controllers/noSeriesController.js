const model = require("../models/noSeriesModel");
const logger = require("../utils/logger");

const RESPONSE =
require("../utils/responseMessages");

const audit =
require("../utils/auditLogger");

// CREATE
const createSeries = async (req, res, next) => {
    try {
        const data = req.body;
        if (!data.code || !data.code.trim()) {

            logger.warn(
                "Series creation attempted without code"
            );

            return res.status(400).json({
                message: RESPONSE.NO_SERIES.CODE_REQUIRED
            });
        }
        const result = await model.createSeries(data);

        audit(
            `No series created: ${data.code}`
        );

        res.status(201).json(result);

    } catch (err) {
        next(err);
    }
};

// GET ALL
const getAllSeries = async (req, res, next) => {
    try {
        const result = await model.getAllSeries();

        res.status(200).json(result);

    } catch (err) {
        next(err);
    }
};

// GET NEXT NUMBER
const getNextNumber = async (req, res, next) => {
    try {
        const { code } = req.params;

        const result = await model.getNextNumber(code);

        if (!result) {

            logger.warn(
                `Series not found: ${code}`
            );

            return res.status(404).json({
                message: RESPONSE.NO_SERIES.NOT_FOUND
            });
        }
        audit(
            `Next number generated for series: ${code}`
        );
        res.status(200).json({
            next_number: result
        });

    } catch (err) {
        next(err);
    }
};

module.exports = {
    createSeries,
    getAllSeries,
    getNextNumber
};