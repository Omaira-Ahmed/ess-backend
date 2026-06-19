const causeModel = require("../models/causeOfAbsenceModel");
const logger = require("../utils/logger");
const RESPONSE =
require("../utils/responseMessages");

const audit =
require("../utils/auditLogger");
// ================= CREATE =================
const createCause = async (req, res, next) => {
    try {
        const {
            code,
            description,
            leave_type_id,
            is_paid,
            requires_document,
            max_days_per_year,
            status
        } = req.body;

        if (!code || !description || !leave_type_id) {
            logger.warn(
                "Cause creation attempted with missing fields"
            );
            return res.status(400).json({
                message:RESPONSE.CAUSE.REQUIRED_FIELDS
            });
        }

        const cause = await causeModel.createCause(
            code,
            description,
            leave_type_id,
            is_paid,
            requires_document,
            max_days_per_year,
            status ?? true
        );
        audit(`Cause created: ${code}`);
        res.status(201).json(cause);

    } catch (error) {
        
        next(error);
    }
};

// ================= GET ALL =================
const getCauses = async (req, res, next) => {
    try {
        const causes = await causeModel.getCauses();
        res.status(200).json(causes);
    } catch (error) {
        
        next(error);
    }
};

// ================= GET BY ID =================
const getCauseById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const cause = await causeModel.getCauseById(id);

        if (!cause) {
            return res.status(404).json({ message: RESPONSE.CAUSE.NOT_FOUND });
        }

        res.status(200).json(cause);

    } catch (error) {
        
        next(error);
    }
};

// ================= UPDATE =================
const updateCause = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { description, max_days_per_year, status } = req.body;

        const updated = await causeModel.updateCause(
            id,
            description,
            max_days_per_year,
            status
        );
        audit(`Cause updated: ${id}`);
        res.status(200).json(updated);

    } catch (error) {
        
        next(error);
    }
};

// ================= DEACTIVATE =================
const deactivateCause = async (req, res, next) => {
    try {
        const { id } = req.params;

        const updated = await causeModel.deactivateCause(id);
        audit(`Cause deactivated: ${id}`);
        res.status(200).json({
            message: RESPONSE.CAUSE.DEACTIVATED,
            data: updated
        });
        

    } catch (error) {
        
        next(error);
    }
};

module.exports = {
    createCause,
    getCauses,
    getCauseById,
    updateCause,
    deactivateCause
};