const db = require("../config/db");

// GET BALANCE
const getBalance = async (employee_id) => {
    const result = await db.query(
        `SELECT * FROM leave_balance
         WHERE employee_id = $1`,
        [employee_id]
    );

    return result.rows;
};

// UPDATE BALANCE (SAFE VERSION)
const updateBalance = async (employee_id, used_days) => {
    const result = await db.query(
        `UPDATE leave_balance
         SET used = used + $1
         WHERE employee_id = $2
         RETURNING *`,
        [used_days, employee_id]
    );

    return result.rows[0];
};

module.exports = {
    getBalance,
    updateBalance
};