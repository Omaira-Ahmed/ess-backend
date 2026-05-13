const sectionModel = require("../models/sectionModel");

const createSection = async (req, res) => {

    try {

        const {
            code,
            section_name,
            department_id
        } = req.body;

        if (
            !code ||
            !section_name ||
            !department_id
        ) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        const section =
            await sectionModel.createSection(
                code,
                section_name,
                department_id
            );

        res.status(201).json(section);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

const getSections = async (req, res) => {

    try {

        const sections =
            await sectionModel.getSections();

        res.status(200).json(sections);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

module.exports = {
    createSection,
    getSections
};