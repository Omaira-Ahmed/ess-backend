const db = require("../config/db");

// ================= LEAVE LOGS =================
const getLeaveLogs = async () => {
    const result = await db.query(
        `SELECT * FROM leave_request_logs
         ORDER BY action_time DESC`
    );
    return result.rows;
};

// ================= EMPLOYEE HISTORY =================
const getEmployeeHistory = async (employee_id) => {
    const result = await db.query(
        `SELECT * FROM employee_status_history
         WHERE employee_id = $1
         ORDER BY changed_at DESC`,
        [employee_id]
    );
    return result.rows;
};

// ================= INSERT STATUS HISTORY =================
const addEmployeeHistory = async (employee_id, status, reason) => {
    const result = await db.query(
        `INSERT INTO employee_status_history
         (employee_id, status, reason)
         VALUES ($1, $2, $3)
         RETURNING *`,
        [employee_id, status, reason]
    );
    return result.rows[0];
};

// ================= INSERT LEAVE LOG =================
const addLeaveLog = async (leave_request_id, action, performed_by, remarks) => {
    const result = await db.query(
        `INSERT INTO leave_request_logs
         (leave_request_id, action, performed_by, remarks)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [leave_request_id, action, performed_by, remarks]
    );
    return result.rows[0];
};

module.exports = {
    getLeaveLogs,
    getEmployeeHistory,
    addEmployeeHistory,
    addLeaveLog
};