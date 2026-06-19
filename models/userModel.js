const pool = require("../config/db");

// ================= REGISTER =================
const createUser = async (
    email,
    password
) => {

    const result =
    await pool.query(

        `INSERT INTO users
        (
            email,
            password_hash
        )

        VALUES
        ($1,$2)

        RETURNING
        user_id,
        email,
        created_at`,

        [
            email,
            password
        ]
    );

    return result.rows[0];
};

// ================= LOGIN =================
const findUserByEmail =
async (email) => {

    const result =
    await pool.query(

        `SELECT

        u.user_id,
        u.email,
        u.password_hash,
        r.role_name AS role,
        e.employee_id

        FROM users u

        LEFT JOIN user_roles ur
        ON u.user_id = ur.user_id

        LEFT JOIN roles r
        ON ur.role_id = r.id

        LEFT JOIN employees e
        ON u.user_id = e.user_id

        WHERE u.email = $1`,

        [email]
    );

    return result.rows[0];
};

module.exports = {

    createUser,

    findUserByEmail

};