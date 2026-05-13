const db = require("../config/db");

const createSection = async (
    code,
    section_name,
    department_id
) => {

    const result = await db.query(
        `INSERT INTO sections
        (code, section_name, department_id)
        VALUES ($1, $2, $3)
        RETURNING *`,
        [code, section_name, department_id]
    );

    return result.rows[0];
};

const getSections = async () => {

    const result = await db.query(
        `SELECT s.*, d.department_name
         FROM sections s
         LEFT JOIN departments d
         ON s.department_id = d.department_id
         ORDER BY s.section_id ASC`
    );

    return result.rows;
};

module.exports = {
    createSection,
    getSections
};