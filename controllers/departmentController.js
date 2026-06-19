const departmentModel = require("../models/departmentModel");
const logger = require("../utils/logger");
const RESPONSE =
require("../utils/responseMessages");

const audit =
require("../utils/auditLogger");
// ================= CREATE DEPARTMENT =================
const createDepartment = async (req, res, next) => {
    try {
        
        const { code, department_name } = req.body;

        if (!code || !department_name) {

            logger.warn(
                "Department creation attempted with missing fields"
            );

            return res.status(400).json({
                message: RESPONSE.DEPARTMENT.REQUIRED_FIELDS
            });
        }

        const department = await departmentModel.createDepartment(
            code,
            department_name
        );

        audit(
            `Department created: ${code}`
        );

        res.status(201).json(department);

    } catch (error) {
        
        next(error);
    }
};

// ================= GET ALL DEPARTMENTS =================
const getDepartments = async (req, res, next) => {
    try {
        const departments = await departmentModel.getDepartments();

        res.status(200).json(departments);

    } catch (error) {
        
        next(error);
    }
};

module.exports = {
    createDepartment,
    getDepartments
};