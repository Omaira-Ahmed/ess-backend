const db = require("../config/db");

const cancelLeave = async (application_id, reason) => {
    const result = await db.query(
        `UPDATE leave_registration
         SET status = 'CANCELLED',
             cancel_reason = $1,
             cancelled_at = NOW()
         WHERE application_id = $2
         RETURNING *`,
        [reason, application_id]
    );

    return result.rows[0];
};

module.exports = {
    cancelLeave
};