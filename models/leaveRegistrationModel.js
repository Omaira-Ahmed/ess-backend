const db = require("../config/db");

// GET APPLICATION
const getApplicationById = async (applicationId) => {
    const result = await db.query(
        `SELECT * FROM leave_application WHERE application_id = $1`,
        [applicationId]
    );
    return result.rows[0];
};

// GET SERIES
const getNoSeries = async () => {
    const result = await db.query(
        `SELECT * FROM no_series WHERE code = 'LEAVE_REG' LIMIT 1`
    );
    return result.rows[0];
};

// UPDATE SERIES
const updateSeries = async (id, current_no) => {
    await db.query(
        `UPDATE no_series SET current_no = $1 WHERE no_series_id = $2`,
        [current_no, id]
    );
};

// CREATE REGISTRATION
const createRegistration = async (
    application,
    registration_no,
    approved_by
) => {
    const result = await db.query(
        `INSERT INTO leave_registration (
            application_id,
            registration_no,
            no_series_id,
            employee_id,
            leave_type_id,
            from_date,
            to_date,
            from_time,
            to_time,
            total_days,
            total_hours,
            approved_by,
            approved_at,
            status
        )
        VALUES (
            $1,$2,$3,$4,$5,
            $6,$7,$8,$9,$10,
            $11,$12,NOW(),'APPROVED'
        )
        RETURNING *`,
        [
            application.application_id,
            registration_no,
            application.no_series_id,
            application.employee_id,
            application.leave_type_id,
            application.from_date,
            application.to_date,
            application.from_time,
            application.to_time,
            application.total_days,
            application.total_hours,
            approved_by
        ]
    );

    return result.rows[0];
};

module.exports = {
    getApplicationById,
    getNoSeries,
    updateSeries,
    createRegistration
};