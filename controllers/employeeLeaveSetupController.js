const model = require("../models/employeeLeaveSetupModel");

// ================= CREATE =================
const createSetup = async (req, res) => {
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
            return res.status(400).json({
                message: "employee_id, leave_type_id, year are required"
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

        res.status(201).json(setup);

    } catch (error) {
        console.error("CREATE SETUP ERROR:", error);
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

// ================= GET ALL =================
const getAll = async (req, res) => {
    try {
        const data = await model.getAll();
        res.status(200).json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// ================= GET BY ID =================
const getById = async (req, res) => {
    try {
        const { id } = req.params;

        const data = await model.getById(id);

        if (!data) {
            return res.status(404).json({ message: "Not found" });
        }

        res.status(200).json(data);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// ================= GET BY EMPLOYEE =================
const getByEmployee = async (req, res) => {
    try {
        const { employeeId } = req.params;

        const data = await model.getByEmployee(employeeId);

        res.status(200).json(data);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// ================= UPDATE =================
const updateSetup = async (req, res) => {
    try {
        const { id } = req.params;
        const { allocated_days, buffer_days, is_eligible } = req.body;

        const updated = await model.updateSetup(
            id,
            allocated_days,
            buffer_days,
            is_eligible
        );

        res.status(200).json(updated);

    } catch (error) {
        console.error("UPDATE ERROR:", error);
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

// ================= DEACTIVATE =================
const deactivateSetup = async (req, res) => {
    try {
        const { id } = req.params;

        const updated = await model.deactivateSetup(id);

        res.status(200).json({
            message: "Deactivated successfully",
            data: updated
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
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