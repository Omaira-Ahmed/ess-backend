const model = require("../models/leaveApplicationModel");

// ================= HELPER: CALCULATE DAYS =================
const calculateDays = (from, to) => {
    const start = new Date(from);
    const end = new Date(to);

    const diff = end - start;
    return Math.floor(diff / (1000 * 60 * 60 * 24)) + 1;
};

// ================= APPLY LEAVE =================
const applyLeave = async (req, res) => {
    try {
        const {
            employee_id,
            leave_type_id,
            from_date,
            to_date,
            reason
        } = req.body;

        if (!employee_id || !leave_type_id || !from_date || !to_date) {
            return res.status(400).json({
                message: "Missing required fields"
            });
        }

        const total_days = calculateDays(from_date, to_date);

        const application = await model.createApplication(
            employee_id,
            leave_type_id,
            from_date,
            to_date,
            reason,
            total_days
        );

        res.status(201).json(application);

    } catch (error) {
        console.error("APPLY LEAVE ERROR:", error);
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

// ================= APPROVE / REJECT =================
const updateStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!["APPROVED", "REJECTED"].includes(status)) {
            return res.status(400).json({
                message: "Invalid status"
            });
        }

        const updated = await model.updateStatus(id, status);

        res.status(200).json(updated);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// ================= CANCEL LEAVE =================
const cancelLeave = async (req, res) => {
    try {
        const { id } = req.params;
        const { cancel_reason } = req.body;

        const updated = await model.cancelLeave(id, cancel_reason);

        res.status(200).json(updated);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = {
    applyLeave,
    getAll,
    getByEmployee,
    updateStatus,
    cancelLeave
};