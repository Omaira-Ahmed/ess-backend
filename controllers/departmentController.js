const departmentModel = require("../models/departmentModel");

// ================= CREATE DEPARTMENT =================
const createDepartment = async (req, res) => {
    try {
        console.log("CREATE DEPARTMENT HIT");
        console.log(req.body);

        const { code, department_name } = req.body;

        if (!code || !department_name) {
            return res.status(400).json({
                message: "Code and department name are required"
            });
        }

        const department = await departmentModel.createDepartment(
            code,
            department_name
        );

        res.status(201).json(department);

    } catch (error) {
        console.error("CREATE DEPARTMENT ERROR:", error);

        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

// ================= GET ALL DEPARTMENTS =================
const getDepartments = async (req, res) => {
    try {
        const departments = await departmentModel.getDepartments();

        res.status(200).json(departments);

    } catch (error) {
        console.error("GET DEPARTMENTS ERROR:", error);

        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

module.exports = {
    createDepartment,
    getDepartments
};