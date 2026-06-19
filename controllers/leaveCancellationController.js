const model = require("../models/leaveCancellationModel");
const logger = require("../utils/logger");
const RESPONSE =
require("../utils/responseMessages");

const audit =
require("../utils/auditLogger");
const cancelLeave = async (req, res, next) => {
    try {
        const { applicationId } = req.params;
        const { reason } = req.body;

        if (!applicationId) {

            logger.warn(
                "Leave cancellation attempted without applicationId"
            );

            return res.status(400).json({
                message: RESPONSE.LEAVE_CANCELLATION.APPLICATION_ID_REQUIRED
            });
        }

        const result = await model.cancelLeave(
            applicationId,
            reason
        );

        audit(
            `Leave cancelled: Application ${applicationId}`
        );

        return res.status(200).json({
            message: RESPONSE.LEAVE_CANCELLATION.CANCELLED,
            data: result
        });

    } catch (err) {
        next(err);

    }
};

module.exports = { cancelLeave };