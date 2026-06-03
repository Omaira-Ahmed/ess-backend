const logger = require("../utils/logger");

const service =
require(
    "../services/leaveRegistrationService"
);

// ================= REGISTER LEAVE =================

const registerLeave =
async (req, res) => {

    try {

        const applicationId =
        parseInt(
            req.params.applicationId
        );

        if (
            !applicationId ||
            isNaN(applicationId)
        ) {

            return res
            .status(400)
            .json({

                message:
                "Invalid application id"

            });

        }

        const approverId =
        req.user.user_id;

        const registration =
        await service.registerLeave(

            applicationId,

            approverId

        );

        res.status(201).json({

            message:
            "Leave registered successfully",

            data:
            registration

        });

    }

    catch (error) {

        logger.error(error);

        res.status(400).json({

            message:
            error.message

        });

    }

};

module.exports = {

    registerLeave

};