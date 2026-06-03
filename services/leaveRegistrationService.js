const db = require("../config/db");
const audit = require("../models/auditModel");

const registerLeave = async (
    applicationId,
    approverId
) => {

    const client =
    await db.connect();

    try {

        await client.query("BEGIN");

        const appRes =
        await client.query(

            `SELECT *
             FROM leave_application
             WHERE application_id = $1
             FOR UPDATE`,

            [applicationId]

        );

        const application =
        appRes.rows[0];

        if (!application) {

            throw new Error(
                "Application not found"
            );

        }

        if (
            application.status !==
            "APPROVED"
        ) {

            throw new Error(
                "Only approved leaves can be registered"
            );

        }

        const existing =
        await client.query(

            `SELECT registration_id
             FROM leave_registration
             WHERE application_id = $1`,

            [applicationId]

        );

        if (
            existing.rows.length > 0
        ) {

            throw new Error(
                "Leave already registered"
            );

        }

        const seriesRes =
        await client.query(

            `SELECT *
             FROM no_series
             WHERE code = 'LEAVE_REG'
             FOR UPDATE`

        );

        const series =
        seriesRes.rows[0];

        if (!series) {

            throw new Error(
                "Leave registration series not found"
            );

        }

        const registrationNo =

        `${series.prefix}${String(
            series.current_no
        ).padStart(5,"0")}`;

        await client.query(

            `UPDATE no_series
             SET current_no =
             current_no + 1
             WHERE no_series_id = $1`,

            [series.no_series_id]

        );

        const regRes =
        await client.query(

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
                $11,$12,NOW(),
                'APPROVED'
            )
            RETURNING *`,

            [

                application.application_id,

                registrationNo,

                series.no_series_id,

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

        const requestRes =
        await client.query(

            `INSERT INTO leave_requests
            (
                application_id,
                action,
                performed_by,
                remarks
            )
            VALUES
            (
                $1,
                'REGISTERED',
                $2,
                $3
            )
            RETURNING request_id`,

            [

                applicationId,

                approverId,

                'Leave registered'

            ]

        );

        const requestId =
        requestRes.rows[0].request_id;

        await audit.addLeaveLog(

            requestId,

            "REGISTERED",

            approverId,

            "Leave registered"

        );

        await client.query(
            "COMMIT"
        );

        return regRes.rows[0];

    }

    catch (error) {

        await client.query(
            "ROLLBACK"
        );

        throw error;

    }

    finally {

        client.release();

    }

};

module.exports = {
    registerLeave
};