const designationModel = require("../models/designationModel");

const createDesignation = async (req, res) => {
    try {
        const { code, designation_name } = req.body;

        if (!code || !designation_name) {
            return res.status(400).json({
                message: "Code and designation name are required"
            });
        }

        const designation = await designationModel.createDesignation(
            code,
            designation_name
        );

        res.status(201).json({
            message: "Designation created successfully",
            designation
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

const getAllDesignations = async (req, res) => {
    try {
        const designations = await designationModel.getAllDesignations();

        res.status(200).json(designations);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

module.exports = {
    createDesignation,
    getAllDesignations
};