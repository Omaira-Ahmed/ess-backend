const pool = require("../config/db");
const logger = require("../utils/logger");

const RESPONSE =
require("../utils/responseMessages");

const audit =
require("../utils/auditLogger");

exports.createLeaveType = async (req, res, next) => {
    try {
        if (!code || !description) {

            logger.warn(
                "Leave type creation attempted with missing fields"
            );

            return res.status(400).json({
                message:RESPONSE.LEAVE_TYPE.REQUIRED_FIELDS
            });

        }
        const { code, description } = req.body;

        const result = await pool.query(
            `INSERT INTO leave_types (code, description)
             VALUES ($1, $2)
             RETURNING *`,
            [code, description]
        );
        audit(
            `Leave type created: ${code}`
        );

        res.status(201).json({

            message:RESPONSE.LEAVE_TYPE.CREATED,

            data:
            result.rows[0]

        });
    } catch (err) {
        next(err);
    }
};