const RESPONSE =
require("../utils/responseMessages");

const audit =
require("../utils/auditLogger");

const service =
require("../services/leaveApplicationService");

// ================= APPLY LEAVE =================

const applyLeave =
async (req, res, next) => {

    try {

        const result =
        await service.applyLeave(
            req.body
        );

        audit(
            `Leave application created: ${result.data.application_id}`
        );

        res.status(201).json({
            message:
                RESPONSE.LEAVE_APPLICATION.CREATED,
            data:
                result.data
        });

    }

    catch (error) {

        next(error);

    }

};

// ================= GET ALL =================

const getAll =
async (req, res, next) => {

    try {

        const data =
        await service.getAll();

        res.status(200).json(
            data
        );

    }

    catch (error) {

        next(error);

    }

};

// ================= GET BY EMPLOYEE =================

const getByEmployee =
async (req, res, next) => {

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

        next(error);
    }

};

// ================= APPROVE / REJECT =================

const updateStatus =
async (req, res, next) => {

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

        audit(
            `Leave application status changed: ${id} -> ${status}`
        );

        res.status(200).json(
            updated
        );

    }

    catch (error) {

        next(error);

    }

};

// ================= CANCEL LEAVE =================

const cancelLeave =
async (req, res, next) => {

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

        audit(
            `Leave application cancelled: ${id}`
        );

        res.status(200).json(
            updated
        );

    }

    catch (error) {

        next(error);

    }

};

module.exports = {

    applyLeave,

    getAll,

    getByEmployee,

    updateStatus,

    cancelLeave

};