const db = require("../config/db");

// ================= APPLY LEAVE =================

const createApplication =
async (

employee_id,
leave_type_id,

from_date,
to_date,

from_time,
to_time,

reason,

total_days,
total_hours

)=>{

const result =
await db.query(

`INSERT INTO leave_application
(
employee_id,
leave_type_id,

from_date,
to_date,

from_time,
to_time,

total_days,
total_hours,

reason,
status
)

VALUES
(
$1,$2,
$3,$4,
$5,$6,
$7,$8,
$9,
'PENDING'
)

RETURNING *`,

[
employee_id,
leave_type_id,

from_date,
to_date,

from_time,
to_time,

total_days,
total_hours,

reason
]

);

return result.rows[0];

};

// ================= GET EMPLOYEE =================

const getEmployee = async (
    employee_id
) => {

    const result = await db.query(
        `SELECT *
         FROM employees
         WHERE employee_id = $1`,
        [employee_id]
    );

    return result.rows[0];

};

// ================= GET ALL =================

const getAll = async () => {

    const result = await db.query(
        `SELECT *
         FROM leave_application
         ORDER BY application_id DESC`
    );

    return result.rows;

};

// ================= GET BY EMPLOYEE =================

const getByEmployee = async (
    employee_id
) => {

    const result = await db.query(
        `SELECT *
         FROM leave_application
         WHERE employee_id = $1
         ORDER BY application_id DESC`,
        [employee_id]
    );

    return result.rows;

};

// ================= GET BY ID =================

const getById = async (
    application_id
) => {

    const result = await db.query(
        `SELECT *
         FROM leave_application
         WHERE application_id = $1`,
        [application_id]
    );

    return result.rows[0];

};

// ================= UPDATE STATUS =================

const updateStatus = async (
    id,
    status
) => {

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

const cancelLeave = async (
    id,
    reason
) => {

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

// ================= GET LEAVE TYPE =================

const getLeaveType = async (
    leave_type_id
) => {

    const result = await db.query(
        `SELECT *
         FROM leave_types
         WHERE leave_type_id = $1`,
        [leave_type_id]
    );

    return result.rows[0];

};

// ================= GET BALANCE =================

const getBalance = async (
    employee_id,
    leave_type_id
) => {

    const result = await db.query(
        `SELECT *
         FROM leave_balance
         WHERE employee_id = $1
         AND leave_type_id = $2
         AND year = EXTRACT(YEAR FROM CURRENT_DATE)`,
        [
            employee_id,
            leave_type_id
        ]
    );

    return result.rows[0];

};

// ================= CHECK OVERLAP =================

const checkOverlap = async (
    employee_id,
    from_date,
    to_date
) => {

    const result = await db.query(
        `SELECT *
         FROM leave_application
         WHERE employee_id = $1
         AND status IN ('PENDING','APPROVED')
         AND (
                from_date <= $3
                AND to_date >= $2
             )`,
        [
            employee_id,
            from_date,
            to_date
        ]
    );

    return result.rows[0];

};

module.exports = {

    createApplication,
    getEmployee,
    getAll,
    getByEmployee,
    getById,
    updateStatus,
    cancelLeave,
    getLeaveType,
    getBalance,
    checkOverlap

};