const model = require("../models/employeeLeaveSetupModel");
const RESPONSE =
require("../utils/responseMessages");

const audit =
require("../utils/auditLogger");
// ================= CREATE =================
const createSetup = async (req, res, next) => {
    try {
        const {
            employee_id,
            leave_type_id,
            year,
            allocated_days,
            buffer_days,
            paid_days,
            half_paid_days,
            is_eligible
        } = req.body;

        if (!employee_id || !leave_type_id || !year) {

            logger.warn(
                "Employee leave setup creation attempted with missing fields"
            );

            return res.status(400).json({
                message:
                    RESPONSE.EMPLOYEE_LEAVE_SETUP.REQUIRED_FIELDS
            });
        }

        const setup = await model.createSetup(
            employee_id,
            leave_type_id,
            year,
            allocated_days || 0,
            buffer_days || 0,
            paid_days || 0,
            half_paid_days || 0,
            is_eligible ?? true
        );

        audit(
            `Employee leave setup created: ${employee_id}`
        );

        res.status(201).json({
            message:
                RESPONSE.EMPLOYEE_LEAVE_SETUP.CREATED,
            data: setup
        });

    } catch (error) {
        
        next(error);
    }
};

// ================= GET ALL =================
const getAll = async (req, res, next) => {
    try {
        const data = await model.getAll();
        res.status(200).json(data);
    } catch (error) {
        next(error);
    }
};

// ================= GET BY ID =================
const getById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const data = await model.getById(id);

        if (!data) {
            return res.status(404).json({ message: RESPONSE.EMPLOYEE_LEAVE_SETUP.NOT_FOUND });
        }

        res.status(200).json(data);

    } catch (error) {
        next(error);
    }
};

// ================= GET BY EMPLOYEE =================
const getByEmployee = async (req, res, next) => {
    try {
        const { employeeId } = req.params;

        const data = await model.getByEmployee(employeeId);

        res.status(200).json(data);

    } catch (error) {
        next(error);
    }
};

// ================= UPDATE =================
const updateSetup = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { allocated_days, buffer_days, is_eligible } = req.body;

        const updated = await model.updateSetup(
            id,
            allocated_days,
            buffer_days,
            is_eligible
        );

        audit(
            `Employee leave setup updated: ${id}`
        );

        res.status(200).json(updated);

    } catch (error) {
        
        next(error);
    }
};

// ================= DEACTIVATE =================
const deactivateSetup = async (req, res, next) => {
    try {
        const { id } = req.params;

        const updated = await model.deactivateSetup(id);

        audit(
            `Employee leave setup deactivated: ${id}`
        );

        res.status(200).json({
            message:
                RESPONSE.EMPLOYEE_LEAVE_SETUP.DEACTIVATED,
            data: updated
        });

    } catch (error) {
        next(error);
    }
};

module.exports = {
    createSetup,
    getAll,
    getById,
    getByEmployee,
    updateSetup,
    deactivateSetup
};