const causeModel = require("../models/causeOfAbsenceModel");

// ================= CREATE =================
const createCause = async (req, res) => {
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
            return res.status(400).json({
                message: "code, description and leave_type_id are required"
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

        res.status(201).json(cause);

    } catch (error) {
        console.error("CREATE CAUSE ERROR:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// ================= GET ALL =================
const getCauses = async (req, res) => {
    try {
        const causes = await causeModel.getCauses();
        res.status(200).json(causes);
    } catch (error) {
        console.error("GET CAUSES ERROR:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// ================= GET BY ID =================
const getCauseById = async (req, res) => {
    try {
        const { id } = req.params;

        const cause = await causeModel.getCauseById(id);

        if (!cause) {
            return res.status(404).json({ message: "Cause not found" });
        }

        res.status(200).json(cause);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// ================= UPDATE =================
const updateCause = async (req, res) => {
    try {
        const { id } = req.params;
        const { description, max_days_per_year, status } = req.body;

        const updated = await causeModel.updateCause(
            id,
            description,
            max_days_per_year,
            status
        );

        res.status(200).json(updated);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// ================= DEACTIVATE =================
const deactivateCause = async (req, res) => {
    try {
        const { id } = req.params;

        const updated = await causeModel.deactivateCause(id);

        res.status(200).json({
            message: "Cause deactivated",
            data: updated
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = {
    createCause,
    getCauses,
    getCauseById,
    updateCause,
    deactivateCause
};