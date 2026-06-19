const db = require("../config/db");

// ================= GET APPLICATION =================

const getApplicationById = async (applicationId) => {

    const result = await db.query(
        `SELECT *
         FROM leave_application
         WHERE application_id = $1`,
        [applicationId]
    );

    return result.rows[0];
};

// ================= GET APPLICATION FOR UPDATE =================

const getApplicationForUpdate = async (client, applicationId) => {

    const result = await client.query(
        `SELECT *
         FROM leave_application
         WHERE application_id = $1
         FOR UPDATE`,
        [applicationId]
    );

    return result.rows[0];
};

// ================= GET NUMBER SERIES =================

const getNoSeries = async () => {

    const result = await db.query(
        `SELECT *
         FROM no_series
         WHERE code = 'LEAVE_REG'
         LIMIT 1`
    );

    return result.rows[0];
};

// ================= GET SERIES FOR UPDATE =================

const getSeriesForUpdate = async (client) => {

    const result = await client.query(
        `SELECT *
         FROM no_series
         WHERE code = 'LEAVE_REG'
         FOR UPDATE`
    );

    return result.rows[0];
};

// ================= INCREMENT SERIES =================

const incrementSeries = async (client, id) => {

    await client.query(
        `UPDATE no_series
         SET current_no = current_no + 1
         WHERE no_series_id = $1`,
        [id]
    );
};

// ================= CREATE REGISTRATION =================

const createRegistration = async (
    client,
    application,
    registrationNo,
    approverId,
    seriesId
) => {

    const result = await client.query(
        `INSERT INTO leave_registration
        (
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
        VALUES
        (
            $1,$2,$3,$4,$5,
            $6,$7,$8,$9,$10,
            $11,$12,NOW(),'APPROVED'
        )
        RETURNING *`,
        [
            application.application_id,
            registrationNo,
            seriesId,
            application.employee_id,
            application.leave_type_id,
            application.from_date,
            application.to_date,
            application.from_time,
            application.to_time,
            application.total_days,
            application.total_hours,
            approverId
        ]
    );

    return result.rows[0];
};

// ================= CREATE REQUEST =================

const createLeaveRequest = async (
    client,
    applicationId,
    approverId
) => {

    const result = await client.query(
        `INSERT INTO leave_requests
        (
            application_id,
            action,
            performed_by,
            remarks
        )
        VALUES
        ($1,$2,$3,$4)
        RETURNING request_id`,
        [
            applicationId,
            "REGISTERED",
            approverId,
            "Leave registered"
        ]
    );

    return result.rows[0];
};

// ================= INSERT LOG =================

const createLeaveLog = async (
    client,
    requestId,
    approverId
) => {

    await client.query(
        `INSERT INTO leave_request_logs
        (
            leave_request_id,
            action,
            performed_by,
            remarks
        )
        VALUES ($1,$2,$3,$4)`,
        [
            requestId,
            "REGISTERED",
            approverId,
            "Leave registered"
        ]
    );
};

// ================= GET EXISTING REGISTRATION =================

const getExistingRegistration = async (client, applicationId) => {

    const result = await client.query(
        `SELECT registration_id
         FROM leave_registration
         WHERE application_id = $1`,
        [applicationId]
    );

    return result.rows[0];
};

// ================= GET REGISTRATION =================

const getRegistrationByApplication = async (applicationId) => {

    const result = await db.query(
        `SELECT *
         FROM leave_registration
         WHERE application_id = $1`,
        [applicationId]
    );

    return result.rows[0];
};

// ================= GET REQUEST =================

const getLeaveRequestByApplication = async (applicationId) => {

    const result = await db.query(
        `SELECT request_id
         FROM leave_requests
         WHERE application_id = $1
         ORDER BY request_id DESC
         LIMIT 1`,
        [applicationId]
    );

    return result.rows[0];
};

// ================= EXPORTS =================

module.exports = {

    getApplicationById,
    getApplicationForUpdate,

    getNoSeries,
    getSeriesForUpdate,
    incrementSeries,

    createRegistration,
    createLeaveRequest,
    createLeaveLog,

    getExistingRegistration,

    getRegistrationByApplication,
    getLeaveRequestByApplication

};