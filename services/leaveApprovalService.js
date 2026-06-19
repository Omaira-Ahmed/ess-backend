const db = require("../config/db");
const audit = require("../models/auditModel");
const model = require("../models/leaveApprovalModel");
const RESPONSE =
require("../utils/responseMessages");

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
    if (!applicationId) {

        const error = new Error(
            RESPONSE.LEAVE_APPROVAL.INVALID_APPLICATION_ID
        );

        error.status = 400;

        throw error;
    }

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

            const error = new Error(
                RESPONSE.LEAVE_APPROVAL.NOT_FOUND
            );

            error.status = 404;

            throw error;

        }

        if (
            application.status !==
            "PENDING"
        ) {

            const error = new Error(
                RESPONSE.LEAVE_APPROVAL.ALREADY_PROCESSED
            );

            error.status = 400;

            throw error;

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

            const error = new Error(
                RESPONSE.LEAVE_APPROVAL.LEAVE_TYPE_NOT_FOUND
            );

            error.status = 404;

            throw error;

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

                const error = new Error(
                    RESPONSE.LEAVE_APPROVAL.BALANCE_NOT_FOUND
                );

                error.status = 404;

                throw error;

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

                const error = new Error(
                    RESPONSE.LEAVE_APPROVAL.INSUFFICIENT_BALANCE
                );

                error.status = 400;

                throw error;

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
    if (!applicationId) {

        const error = new Error(
            RESPONSE.LEAVE_APPROVAL.INVALID_APPLICATION_ID
        );

        error.status = 400;

        throw error;
    }

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

            const error = new Error(
                RESPONSE.LEAVE_APPROVAL.NOT_FOUND
            );

            error.status = 404;

            throw error;

        }

        if (
            application.status !==
            "PENDING"
        ) {

            const error = new Error(
                RESPONSE.LEAVE_APPROVAL.ALREADY_PROCESSED
            );

            error.status = 400;

            throw error;

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

    if (!applicationId) {

        const error = new Error(
            RESPONSE.LEAVE_APPROVAL.INVALID_APPLICATION_ID
        );

        error.status = 400;

        throw error;
    }

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