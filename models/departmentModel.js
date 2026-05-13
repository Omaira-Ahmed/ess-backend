const db = require("../config/db");

const createDepartment = async (code, department_name) => {
    const result = await db.query(
        `INSERT INTO departments (code, department_name)
         VALUES ($1, $2)
         RETURNING *`,
        [code, department_name]
    );

    return result.rows[0];
};

const getDepartments = async () => {
    const result = await db.query(
        `SELECT * FROM departments
         ORDER BY department_id ASC`
    );

    return result.rows;
};

module.exports = {
    createDepartment,
    getDepartments
};