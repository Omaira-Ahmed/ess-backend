const sectionModel = require("../models/sectionModel");
const logger = require("../utils/logger");
const RESPONSE =
require("../utils/responseMessages");

const audit =
require("../utils/auditLogger");
const createSection = async (req, res, next) => {

    try {

        const {
            code,
            section_name,
            department_id
        } = req.body;

        if (!code ||!section_name ||!department_id) {

            logger.warn(
                "Section creation attempted with missing fields"
            );

            return res.status(400).json({
                message:RESPONSE.SECTION.REQUIRED_FIELDS
            });

        }

        const section =
            await sectionModel.createSection(
                code,
                section_name,
                department_id
            );

        audit(
            `Section created: ${code}`
        );

        res.status(201).json(section);

    } catch (error) {

        next(error);
    }
};

const getSections = async (req, res, next) => {

    try {

        const sections =
            await sectionModel.getSections();

        res.status(200).json(sections);

    } catch (error) {

        next(error);
    }
};

module.exports = {
    createSection,
    getSections
};