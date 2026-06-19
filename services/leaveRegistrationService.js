const db = require("../config/db");
const model = require("../models/leaveRegistrationModel");
const RESPONSE = require("../utils/responseMessages");

const registerLeave = async (applicationId, approverId) => {

    const client = await db.connect();

    try {

        await client.query("BEGIN");

        // 1. GET APPLICATION
        const application =
            await model.getApplicationForUpdate(client, applicationId);

        if (!application) {
            const error = new Error(RESPONSE.LEAVE_REGISTRATION.NOT_FOUND);
            error.status = 404;
            throw error;
        }

        // 2. CHECK STATUS
        if (application.status !== "APPROVED") {
            const error = new Error(RESPONSE.LEAVE_REGISTRATION.NOT_APPROVED);
            error.status = 400;
            throw error;
        }

        // 3. CHECK EXISTING
        const existing =
            await model.getExistingRegistration(client, applicationId);

        if (existing) {
            const error = new Error(RESPONSE.LEAVE_REGISTRATION.ALREADY_REGISTERED);
            error.status = 400;
            throw error;
        }

        // 4. GET SERIES
        const series =
            await model.getSeriesForUpdate(client);

        if (!series) {
            const error = new Error(RESPONSE.NO_SERIES.NOT_FOUND);
            error.status = 404;
            throw error;
        }

        // 5. GENERATE NUMBER
        const registrationNo =
            `${series.prefix}${String(series.current_no).padStart(5, "0")}`;

        // 6. INCREMENT SERIES
        await model.incrementSeries(client, series.no_series_id);

        // 7. CREATE REGISTRATION
        const registration =
            await model.createRegistration(
                client,
                application,
                registrationNo,
                approverId,
                series.no_series_id
            );

        // 8. CREATE REQUEST
        const request =
            await model.createLeaveRequest(
                client,
                applicationId,
                approverId
            );

        // 9. LOG
        await model.createLeaveLog(
            client,
            request.request_id,
            approverId
        );

        await client.query("COMMIT");

        return registration;

    } catch (error) {

        await client.query("ROLLBACK");
        throw error;

    } finally {

        client.release();
    }
};