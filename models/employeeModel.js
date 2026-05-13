const db = require("../config/db");

const createEmployee = async (employeeData) => {
    const {
        user_id,
        first_name,
        last_name,
        dob,
        nationality,
        contact_number,
        email,
        address,
        company_name,
        date_of_joining,
        designation_id,
        department_id,
        section_id,
        line_manager_id
    } = employeeData;

    const result = await db.query(
        `INSERT INTO employees (
            user_id,
            first_name,
            last_name,
            dob,
            nationality,
            contact_number,
            email,
            address,
            company_name,
            date_of_joining,
            designation_id,
            department_id,
            section_id,
            line_manager_id
        )
        VALUES (
            $1,$2,$3,$4,$5,$6,$7,$8,$9,
            $10,$11,$12,$13,$14
        )
        RETURNING *`,
        [
            user_id,
            first_name,
            last_name,
            dob,
            nationality,
            contact_number,
            email,
            address,
            company_name,
            date_of_joining,
            designation_id,
            department_id,
            section_id,
            line_manager_id
        ]
    );

    return result.rows[0];
};

const getEmployeeById = async (id) => {
    const result = await db.query(
        `SELECT * FROM employees
         WHERE employee_id = $1`,
        [id]
    );

    return result.rows[0];
};

module.exports = {
    createEmployee,
    getEmployeeById
};