const designationModel = require("../models/designationModel");
const logger = require("../utils/logger");
const RESPONSE =
require("../utils/responseMessages");

const audit =
require("../utils/auditLogger");
const createDesignation = async (req, res, next) => {
    try {
        const { code, designation_name } = req.body;

        if (!code || !designation_name) {

            logger.warn(
                "Designation creation attempted with missing fields"
            );

            return res.status(400).json({
                message:
                    RESPONSE.DESIGNATION.REQUIRED_FIELDS
            });
        }

        const designation = await designationModel.createDesignation(
            code,
            designation_name
        );
        audit(
            `Designation created: ${code}`
        );

        res.status(201).json({
            message: 
                RESPONSE.DESIGNATION.CREATED,
            designation
        });

    } catch (error) {
        next(error);
    }
};

const getAllDesignations = async (req, res, next) => {
    try {
        const designations = await designationModel.getAllDesignations();

        res.status(200).json(designations);

    } catch (error) {
        next(error);
    }
};

module.exports = {
    createDesignation,
    getAllDesignations
};