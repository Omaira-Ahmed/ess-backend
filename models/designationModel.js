const db = require("../config/db");

const createDesignation = async (code, designation_name) => {
    const result = await db.query(
        `INSERT INTO designations (code, designation_name)
         VALUES ($1, $2)
         RETURNING *`,
        [code, designation_name]
    );

    return result.rows[0];
};

const getAllDesignations = async () => {
    const result = await db.query(
        `SELECT * FROM designations ORDER BY designation_id ASC`
    );

    return result.rows;
};

module.exports = {
    createDesignation,
    getAllDesignations
};