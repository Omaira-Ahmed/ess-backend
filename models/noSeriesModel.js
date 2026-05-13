const db = require("../config/db");

// CREATE SERIES
const createSeries = async (data) => {
    const {
        code,
        description,
        prefix,
        starting_no
    } = data;

    const result = await db.query(
        `INSERT INTO no_series 
        (code, description, prefix, starting_no, current_no)
        VALUES ($1, $2, $3, $4, $4)
        RETURNING *`,
        [code, description, prefix, starting_no]
    );

    return result.rows[0];
};

// GET ALL
const getAllSeries = async () => {
    const result = await db.query(
        `SELECT * FROM no_series ORDER BY no_series_id DESC`
    );

    return result.rows;
};

// GET BY CODE
const getByCode = async (code) => {
    const result = await db.query(
        `SELECT * FROM no_series WHERE code = $1`,
        [code]
    );

    return result.rows[0];
};

// GET NEXT NUMBER (IMPORTANT)
const getNextNumber = async (code) => {
    const result = await db.query(
        `SELECT * FROM no_series WHERE code = $1`,
        [code]
    );

    const series = result.rows[0];

    if (!series) return null;

    return `${series.prefix}${series.current_no}`;
};

// INCREMENT SERIES
const incrementSeries = async (code) => {
    const result = await db.query(
        `UPDATE no_series
         SET current_no = current_no + 1
         WHERE code = $1
         RETURNING *`,
        [code]
    );

    return result.rows[0];
};

module.exports = {
    createSeries,
    getAllSeries,
    getByCode,
    getNextNumber,
    incrementSeries
};