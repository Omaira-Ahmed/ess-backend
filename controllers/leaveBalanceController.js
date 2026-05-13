const model = require("../models/leaveBalanceModel");

// GET BALANCE
const getBalance = async (req, res) => {
    try {
        const { employee_id } = req.params;

        const data = await model.getBalance(employee_id);

        return res.json({
            message: "Leave balance fetched",
            data
        });

    } catch (error) {
        return res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

// UPDATE BALANCE (used when leave is approved)
const updateBalance = async (req, res) => {
    try {
        const { employee_id } = req.params;
        const { used_days } = req.body;

        const updated = await model.updateBalance(
            employee_id,
            used_days
        );

        return res.json({
            message: "Balance updated",
            data: updated
        });

    } catch (error) {
        return res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

module.exports = {
    getBalance,
    updateBalance
};