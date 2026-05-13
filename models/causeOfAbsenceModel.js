const db = require("../config/db");

// ================= CREATE =================
const createCause = async (
    code,
    description,
    leave_type_id,
    is_paid,
    requires_document,
    max_days_per_year,
    status
) => {
    const result = await db.query(
        `INSERT INTO cause_of_absence 
        (code, description, leave_type_id, is_paid, requires_document, max_days_per_year, status)
        VALUES ($1,$2,$3,$4,$5,$6,$7)
        RETURNING *`,
        [code, description, leave_type_id, is_paid, requires_document, max_days_per_year, status]
    );

    return result.rows[0];
};

// ================= GET ALL =================
const getCauses = async () => {
    const result = await db.query(
        `SELECT * FROM cause_of_absence ORDER BY cause_id ASC`
    );

    return result.rows;
};

// ================= GET BY ID =================
const getCauseById = async (id) => {
    const result = await db.query(
        `SELECT * FROM cause_of_absence WHERE cause_id = $1`,
        [id]
    );

    return result.rows[0];
};

// ================= UPDATE =================
const updateCause = async (id, description, max_days_per_year, status) => {
    const result = await db.query(
        `UPDATE cause_of_absence
         SET description = COALESCE($2, description),
             max_days_per_year = COALESCE($3, max_days_per_year),
             status = COALESCE($4, status)
         WHERE cause_id = $1
         RETURNING *`,
        [id, description, max_days_per_year, status]
    );

    return result.rows[0];
};

// ================= SOFT DELETE =================
const deactivateCause = async (id) => {
    const result = await db.query(
        `UPDATE cause_of_absence
         SET status = false
         WHERE cause_id = $1
         RETURNING *`,
        [id]
    );

    return result.rows[0];
};

module.exports = {
    createCause,
    getCauses,
    getCauseById,
    updateCause,
    deactivateCause
};