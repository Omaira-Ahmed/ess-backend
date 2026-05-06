const pool = require("../config/db");

exports.createEmployee = async (req, res) => {
    try {
        const {
            user_id,
            first_name,
            last_name,
            email
        } = req.body;

        const result = await pool.query(
            `INSERT INTO employees (user_id, first_name, last_name, email)
             VALUES ($1, $2, $3, $4)
             RETURNING *`,
            [user_id, first_name, last_name, email]
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error creating employee" });
    }
};