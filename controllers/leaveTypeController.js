const pool = require("../config/db");

exports.createLeaveType = async (req, res) => {
    try {
        const { code, description } = req.body;

        const result = await pool.query(
            `INSERT INTO leave_types (code, description)
             VALUES ($1, $2)
             RETURNING *`,
            [code, description]
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error creating leave type" });
    }
};