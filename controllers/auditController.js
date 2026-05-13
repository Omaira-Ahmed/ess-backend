const model = require("../models/auditModel");

// ================= GET LEAVE LOGS =================
const getLeaveLogs = async (req, res) => {
    try {
        const logs = await model.getLeaveLogs();

        res.status(200).json({
            message: "Leave logs fetched",
            data: logs
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

// ================= EMPLOYEE HISTORY =================
const getEmployeeHistory = async (req, res) => {
    try {
        const { id } = req.params;

        const history = await model.getEmployeeHistory(id);

        res.status(200).json({
            message: "Employee history fetched",
            data: history
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

module.exports = {
    getLeaveLogs,
    getEmployeeHistory
};