const db = require("../config/db");
const audit = require("../models/auditModel");
const model = require("../models/leaveApprovalModel");

// ================= GET PENDING =================

const getPendingRequests =
async (managerId) => {

    return await model.getPendingRequests(
        managerId
    );

};

// ================= APPROVE =================

const approveLeave =
async (

    applicationId,

    userId,

    remarks = ""

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
            "PENDING"
        ) {

            throw new Error(
                "Leave already processed"
            );

        }

        const typeRes =
        await client.query(

            `SELECT *
             FROM leave_types
             WHERE leave_type_id = $1`,

            [
                application.leave_type_id
            ]

        );

        const leaveType =
        typeRes.rows[0];

        if (!leaveType) {

            throw new Error(
                "Leave type not found"
            );

        }

        // NON EMERGENCY BALANCE CHECK

        if (
            leaveType.code !==
            "EMERGENCY"
        ) {

            const balanceRes =
            await client.query(

                `SELECT *
                 FROM leave_balance
                 WHERE employee_id = $1
                 AND leave_type_id = $2
                 AND year =
                 EXTRACT(
                    YEAR FROM CURRENT_DATE
                 )
                 FOR UPDATE`,

                [

                    application.employee_id,

                    application.leave_type_id

                ]

            );

            const balance =
            balanceRes.rows[0];

            if (!balance) {

                throw new Error(
                    "Leave balance not found"
                );

            }

            const remaining =

                Number(
                    balance.allocated || 0
                )

                +

                Number(
                    balance.carried_forward || 0
                )

                -

                Number(
                    balance.used || 0
                );

            if (

                remaining <

                Number(
                    application.total_days
                )

            ) {

                throw new Error(
                    "Insufficient leave balance"
                );

            }

            await client.query(

                `UPDATE leave_balance
                 SET used =
                 used + $1
                 WHERE balance_id = $2`,

                [

                    application.total_days,

                    balance.balance_id

                ]

            );

        }

        const updateRes =
        await client.query(

            `UPDATE leave_application
             SET status = 'APPROVED'
             WHERE application_id = $1
             RETURNING *`,

            [applicationId]

        );

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
                'APPROVED',
                $2,
                $3
            )`,

            [

                applicationId,

                userId,

                remarks

            ]

        );

        await audit.addLeaveLog(

            applicationId,

            "APPROVED",

            userId,

            remarks

        );

        await client.query(
            "COMMIT"
        );

        return updateRes.rows[0];

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

// ================= REJECT =================

const rejectLeave =
async (

    applicationId,

    userId,

    remarks = ""

) => {

    const client =
    await db.connect();

    try {

        await client.query(
            "BEGIN"
        );

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
            "PENDING"
        ) {

            throw new Error(
                "Leave already processed"
            );

        }

        const updateRes =
        await client.query(

            `UPDATE leave_application
             SET status = 'REJECTED'
             WHERE application_id = $1
             RETURNING *`,

            [applicationId]

        );

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
                'REJECTED',
                $2,
                $3
            )`,

            [

                applicationId,

                userId,

                remarks

            ]

        );

        await audit.addLeaveLog(

            applicationId,

            "REJECTED",

            userId,

            remarks

        );

        await client.query(
            "COMMIT"
        );

        return updateRes.rows[0];

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

// ================= HISTORY =================

const getApprovalHistory =
async (applicationId) => {

    return await model.getApprovalHistory(
        applicationId
    );

};

module.exports = {

    getPendingRequests,

    approveLeave,

    rejectLeave,

    getApprovalHistory

};