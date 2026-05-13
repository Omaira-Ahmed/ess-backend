const employeeModel = require("../models/employeeModel");

const createEmployee = async (req, res) => {
    try {

        const employee = await employeeModel.createEmployee(req.body);

        res.status(201).json({
            message: "Employee created successfully",
            employee
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            message: "Error creating employee"
        });
    }
};

const getEmployeeById = async (req, res) => {
    try {

        const employee = await employeeModel.getEmployeeById(
            req.params.id
        );

        if (!employee) {
            return res.status(404).json({
                message: "Employee not found"
            });
        }

        res.status(200).json(employee);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            message: "Error fetching employee"
        });
    }
};

module.exports = {
    createEmployee,
    getEmployeeById
};