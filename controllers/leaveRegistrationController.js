const logger = require("../utils/logger");

const service =
require(
    "../services/leaveRegistrationService"
);

const RESPONSE =
require("../utils/responseMessages");

const audit =
require("../utils/auditLogger");

// ================= REGISTER LEAVE =================

const registerLeave =
async (req, res, next) => {

    try {

        const applicationId =
        parseInt(
            req.params.applicationId
        );

        if (
            !applicationId ||
            isNaN(applicationId)
        ) {

            logger.warn(
                `Invalid application id: ${req.params.applicationId}`
            );

            return res
            .status(400)
            .json({

                message:RESPONSE.LEAVE_REGISTRATION.INVALID_APPLICATION_ID

            });

        }

        const approverId =
        req.user.employee_id;

        const registration =
        await service.registerLeave(

            applicationId,

            approverId

        );

        audit(
            `Leave registered: Application ${applicationId} by Employee ${approverId}`
        );

        res.status(201).json({

            message:
            RESPONSE.LEAVE_REGISTRATION.REGISTERED,

            data:
            registration

        });

    }

    catch (error) {

        next(error);

    }

};

module.exports = {

    registerLeave

};