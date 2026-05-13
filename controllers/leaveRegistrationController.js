const model = require("../models/leaveRegistrationModel");
const balanceModel = require("../models/leaveBalanceModel");
const audit = require("../models/auditModel");

// REGISTER LEAVE
const registerLeave = async (req, res) => {
    try {

        const applicationId = parseInt(req.params.applicationId);
        const approved_by = parseInt(req.body.approved_by);

        // VALIDATION
        if (!applicationId || isNaN(applicationId)) {
            return res.status(400).json({
                message: "Invalid applicationId"
            });
        }

        if (!approved_by || isNaN(approved_by)) {
            return res.status(400).json({
                message: "approved_by is required"
            });
        }

        // GET APPLICATION
        const application =
            await model.getApplicationById(applicationId);

        if (!application) {
            return res.status(404).json({
                message: "Leave application not found"
            });
        }

        // GET SERIES
        const series = await model.getNoSeries();

        if (!series) {
            return res.status(400).json({
                message: "No series not configured"
            });
        }

        // GENERATE NUMBER
        const registration_no =
            `${series.prefix}${series.current_no}`;

        // UPDATE SERIES
        await model.updateSeries(
            series.no_series_id,
            series.current_no + 1
        );

        // CREATE REGISTRATION
        
        const registration =
            await model.createRegistration(
            application,
            registration_no,
            approved_by
            );

        // BALANCE UPDATE
        await balanceModel.updateBalance(
            application.employee_id,
            application.total_days
        );

        // AUDIT LOG 👇 ADD HERE
        await audit.logAction(
            req.user.user_id,
            "REGISTER_LEAVE",
            "LEAVE_REGISTRATION"
        );

        // RESPONSE
        res.status(201).json({
            message: "Leave registered successfully",
            data: registration
        });

    } catch (error) {
        console.error("REGISTER ERROR:", error);

        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

module.exports = {
    registerLeave
};