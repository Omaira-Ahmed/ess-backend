const db = require("../config/db");

// ================= GET BALANCE =================
const getBalance = async (employee_id) => {

    const result = await db.query(

        `SELECT
            balance_id,
            employee_id,
            leave_type_id,
            year,
            allocated,
            used,
            carried_forward,
            remaining

         FROM leave_balance

         WHERE employee_id = $1

         ORDER BY year DESC`,

        [employee_id]

    );

    return result.rows;
};


// ================= UPDATE BALANCE =================
const updateBalance = async (
    employee_id,
    leave_days
) => {

    const days =
        parseFloat(leave_days);

    const result =
        await db.query(

        `UPDATE leave_balance

         SET used = used + $1

         WHERE employee_id = $2

         RETURNING *`,

        [
            days,
            employee_id
        ]

    );

    return result.rows[0];

};

module.exports = {

    getBalance,
    updateBalance

};