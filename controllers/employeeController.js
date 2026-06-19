const employeeModel = require("../models/employeeModel");

const RESPONSE =
require("../utils/responseMessages");

const audit =
require("../utils/auditLogger");
const createEmployee = async (req, res, next) => {
    try {

        const employee = await employeeModel.createEmployee(req.body);

        audit(
            `Employee created: ${employee.employee_id}`
        );

        res.status(201).json({
            message: RESPONSE.EMPLOYEE.CREATED,
            employee
        });

    } catch (err) {

        next(err);
    }
};

const getEmployeeById = async (req, res, next) => {
    try {

        const employee = await employeeModel.getEmployeeById(
            req.params.id
        );


        if (!employee) {
            return res.status(404).json({
                message: RESPONSE.EMPLOYEE.NOT_FOUND
            });
        }

        res.status(200).json(employee);

    } catch (err) {

        next(err);
    }
};

module.exports = {
    createEmployee,
    getEmployeeById
};