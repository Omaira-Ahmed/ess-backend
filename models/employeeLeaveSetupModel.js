const db = require("../config/db");

// ================= CREATE =================
const createSetup = async (
    employee_id,
    leave_type_id,
    year,
    allocated_days,
    buffer_days,
    paid_days,
    half_paid_days,
    is_eligible
) => {
    const result = await db.query(
        `INSERT INTO employee_leave_setup
        (employee_id, leave_type_id, year, allocated_days, buffer_days, paid_days, half_paid_days, is_eligible)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
        RETURNING *`,
        [
            employee_id,
            leave_type_id,
            year,
            allocated_days,
            buffer_days,
            paid_days,
            half_paid_days,
            is_eligible
        ]
    );

    return result.rows[0];
};

// ================= GET ALL =================
const getAll = async () => {
    const result = await db.query(
        `SELECT * FROM employee_leave_setup ORDER BY setup_id ASC`
    );

    return result.rows;
};

// ================= GET BY ID =================
const getById = async (id) => {
    const result = await db.query(
        `SELECT * FROM employee_leave_setup WHERE setup_id = $1`,
        [id]
    );

    return result.rows[0];
};

// ================= GET BY EMPLOYEE =================
const getByEmployee = async (employee_id) => {
    const result = await db.query(
        `SELECT * FROM employee_leave_setup 
         WHERE employee_id = $1
         ORDER BY year DESC`,
        [employee_id]
    );

    return result.rows;
};

// ================= UPDATE =================
const updateSetup = async (id, allocated_days, buffer_days, is_eligible) => {
    const result = await db.query(
        `UPDATE employee_leave_setup
         SET allocated_days = COALESCE($2, allocated_days),
             buffer_days = COALESCE($3, buffer_days),
             is_eligible = COALESCE($4, is_eligible)
         WHERE setup_id = $1
         RETURNING *`,
        [id, allocated_days, buffer_days, is_eligible]
    );

    return result.rows[0];
};

// ================= DELETE (SOFT) =================
const deactivateSetup = async (id) => {
    const result = await db.query(
        `UPDATE employee_leave_setup
         SET is_eligible = false
         WHERE setup_id = $1
         RETURNING *`,
        [id]
    );

    return result.rows[0];
};

module.exports = {
    createSetup,
    getAll,
    getById,
    getByEmployee,
    updateSetup,
    deactivateSetup
};