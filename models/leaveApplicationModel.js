const db = require("../config/db");

// ================= APPLY LEAVE =================
const createApplication = async (
    employee_id,
    leave_type_id,
    from_date,
    to_date,
    reason,
    total_days
) => {
    const result = await db.query(
        `INSERT INTO leave_application
        (employee_id, leave_type_id, from_date, to_date, reason, total_days, status)
        VALUES ($1,$2,$3,$4,$5,$6,'PENDING')
        RETURNING *`,
        [
            employee_id,
            leave_type_id,
            from_date,
            to_date,
            reason,
            total_days
        ]
    );

    return result.rows[0];
};

// ================= GET ALL =================
const getAll = async () => {
    const result = await db.query(
        `SELECT * FROM leave_application ORDER BY application_id DESC`
    );

    return result.rows;
};

// ================= GET BY EMPLOYEE =================
const getByEmployee = async (employee_id) => {
    const result = await db.query(
        `SELECT * FROM leave_application
         WHERE employee_id = $1
         ORDER BY application_id DESC`,
        [employee_id]
    );

    return result.rows;
};

// ================= UPDATE STATUS (APPROVE / REJECT) =================
const updateStatus = async (id, status, remarks) => {
    const result = await db.query(
        `UPDATE leave_application
         SET status = $2
         WHERE application_id = $1
         RETURNING *`,
        [id, status]
    );

    return result.rows[0];
};

// ================= CANCEL LEAVE =================
const cancelLeave = async (id, reason) => {
    const result = await db.query(
        `UPDATE leave_application
         SET cancel_requested = true,
             cancel_request_date = NOW(),
             cancel_reason = $2,
             cancel_status = 'PENDING'
         WHERE application_id = $1
         RETURNING *`,
        [id, reason]
    );

    return result.rows[0];
};

module.exports = {
    createApplication,
    getAll,
    getByEmployee,
    updateStatus,
    cancelLeave
};