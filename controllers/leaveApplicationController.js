const logger = require("../utils/logger");

const service =
require("../services/leaveApplicationService");

// ================= APPLY LEAVE =================

const applyLeave =
async (req, res) => {

    try {

        const application =
        await service.applyLeave(
            req.body
        );

        res.status(201).json(
            application
        );

    }

    catch (error) {

        logger.error(error);

        const status =

            error.message.includes("not found") ||
            error.message.includes("Missing") ||
            error.message.includes("Invalid") ||
            error.message.includes("Insufficient")

            ? 400
            : 500;

        res.status(status).json({

            message:
            error.message

        });

    }

};

// ================= GET ALL =================

const getAll =
async (req, res) => {

    try {

        const data =
        await service.getAll();

        res.status(200).json(
            data
        );

    }

    catch (error) {

        logger.error(error);

        res.status(500).json({

            message:
            "Server error"

        });

    }

};

// ================= GET BY EMPLOYEE =================

const getByEmployee =
async (req, res) => {

    try {

        const { employeeId } =
        req.params;

        const data =
        await service.getByEmployee(
            employeeId
        );

        res.status(200).json(
            data
        );

    }

    catch (error) {

        logger.error(error);

        res.status(500).json({

            message:
            "Server error"

        });

    }

};

// ================= APPROVE / REJECT =================

const updateStatus =
async (req, res) => {

    try {

        const { id } =
        req.params;

        const { status } =
        req.body;

        const updated =
        await service.updateStatus(
            id,
            status
        );

        res.status(200).json(
            updated
        );

    }

    catch (error) {

        logger.error(error);

        res.status(400).json({

            message:
            error.message

        });

    }

};

// ================= CANCEL LEAVE =================

const cancelLeave =
async (req, res) => {

    try {

        const { id } =
        req.params;

        const {
            cancel_reason
        } = req.body;

        const updated =
        await service.cancelLeave(

            id,

            cancel_reason

        );

        res.status(200).json(
            updated
        );

    }

    catch (error) {

        logger.error(error);

        res.status(400).json({

            message:
            error.message

        });

    }

};

module.exports = {

    applyLeave,

    getAll,

    getByEmployee,

    updateStatus,

    cancelLeave

};