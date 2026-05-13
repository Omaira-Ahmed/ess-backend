const model = require("../models/leaveCancellationModel");

const cancelLeave = async (req, res) => {
    try {
        const { applicationId } = req.params;
        const { reason } = req.body;

        if (!applicationId) {
            return res.status(400).json({
                message: "applicationId is required"
            });
        }

        const result = await model.cancelLeave(
            applicationId,
            reason
        );

        return res.status(200).json({
            message: "Leave cancelled successfully",
            data: result
        });

    } catch (err) {
        console.error("CANCEL ERROR:", err);

        return res.status(500).json({
            message: "Server error",
            error: err.message
        });
    }
};

module.exports = { cancelLeave };