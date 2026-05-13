const db = require("../config/db");

// ================= GET PENDING REQUESTS =================
const getPendingRequests = async (managerId) => {
    const result = await db.query(
        `
        SELECT la.*
        FROM leave_application la
        JOIN employees e
        ON la.employee_id = e.employee_id
        WHERE e.line_manager_id = $1
        AND la.status = 'PENDING'
        ORDER BY la.application_id DESC
        `,
        [managerId]
    );

    return result.rows;
};

// ================= APPROVE / REJECT =================
const updateLeaveStatus = async (applicationId, status) => {
    const result = await db.query(
        `
        UPDATE leave_application
        SET status = $2
        WHERE application_id = $1
        RETURNING *
        `,
        [applicationId, status]
    );

    return result.rows[0];
};

// ================= INSERT ACTION LOG =================
const insertActionLog = async (
    application_id,
    action,
    performed_by,
    remarks
) => {
    const result = await db.query(
        `
        INSERT INTO leave_requests
        (application_id, action, performed_by, remarks)
        VALUES ($1, $2, $3, $4)
        RETURNING *
        `,
        [
            application_id,
            action,
            performed_by,
            remarks
        ]
    );

    return result.rows[0];
};

// ================= GET HISTORY =================
const getApprovalHistory = async (applicationId) => {
    const result = await db.query(
        `
        SELECT *
        FROM leave_requests
        WHERE application_id = $1
        ORDER BY action_time DESC
        `,
        [applicationId]
    );

    return result.rows;
};

module.exports = {
    getPendingRequests,
    updateLeaveStatus,
    insertActionLog,
    getApprovalHistory
};