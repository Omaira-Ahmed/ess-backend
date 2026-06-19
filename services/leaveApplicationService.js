const RESPONSE =
require("../utils/responseMessages");

const model =
require(
    "../models/leaveApplicationModel"
);

// ================= CALCULATE DAYS =================

const calculateLeaveDuration =
(
from_date,
to_date,
from_time,
to_time
)=>{

const startDate =
new Date(from_date);

const endDate =
new Date(to_date);

if(endDate < startDate){

    const error = new Error(
        RESPONSE.LEAVE_APPLICATION.INVALID_DATE_RANGE
    );

    error.status = 400;

    throw error;

}

if(
from_time &&
to_time &&
from_date === to_date
){

const start =
new Date(
`${from_date}T${from_time}`
);

const end =
new Date(
`${to_date}T${to_time}`
);

const hours =
(
end - start
) /
(1000 * 60 * 60);

if(hours <= 0){

    const error = new Error(
        RESPONSE.LEAVE_APPLICATION.INVALID_TIME_RANGE
    );

    error.status = 400;

    throw error;
}

return {

total_days:
Number(
(hours / 8.5)
.toFixed(2)
),

total_hours:
Number(
hours.toFixed(2)
)

};

}

const days =
Math.floor(
(
endDate -
startDate
)
/
(1000 * 60 * 60 * 24)
) + 1;

return {

total_days:
days,

total_hours:
null

};

};

// ================= APPLY LEAVE =================

const applyLeave =
async (data) => {

    const {

        employee_id,
        leave_type_id,
        from_date,
        to_date,
        reason

    } = data;

    if (

        !employee_id ||
        !leave_type_id ||
        !from_date ||
        !to_date

    ) {

        const error = new Error(
            RESPONSE.LEAVE_APPLICATION.REQUIRED_FIELDS
        );

        error.status = 400;

        throw error;

    }

    // EMPLOYEE CHECK

    const employee =
    await model.getEmployee(
        employee_id
    );

    if (!employee) {

        const error = new Error(
            RESPONSE.EMPLOYEE.NOT_FOUND
        );

        error.status = 404;

        throw error;

    }

    // OVERLAP CHECK

    const overlap =
    await model.checkOverlap(

        employee_id,

        from_date,

        to_date

    );

    if (overlap) {

        const error = new Error(
            RESPONSE.LEAVE_APPLICATION.OVERLAP
        );

        error.status = 400;

        throw error;

    }

    // DAYS

    const duration =
    calculateLeaveDuration(

    from_date,
    to_date,

    data.from_time,

    data.to_time

    );

    const total_days =
    duration.total_days;

    const total_hours =
    duration.total_hours;

    // LEAVE TYPE

    const leaveType =
    await model.getLeaveType(
        leave_type_id
    );

    if (!leaveType) {

        const error = new Error(
            RESPONSE.LEAVE_APPLICATION.LEAVE_TYPE_NOT_FOUND
        );

        error.status = 404;

        throw error;

    }

    // BALANCE CHECK

    if (
        leaveType.code !==
        "EMERGENCY"
    ) {

        const balance =
        await model.getBalance(

            employee_id,

            leave_type_id

        );

        if (!balance) {

            const error = new Error(
                RESPONSE.LEAVE_APPLICATION.BALANCE_NOT_FOUND
            );

            error.status = 404;

            throw error;

        }

        const allocated =
        Number(
            balance.allocated || 0
        );

        const used =
        Number(
            balance.used || 0
        );

        const carried =
        Number(
            balance.carried_forward || 0
        );

        const remaining =

            allocated +
            carried -
            used;

        if (
            remaining <
            total_days
        ) {

            const error = new Error(
                RESPONSE.LEAVE_APPLICATION.INSUFFICIENT_BALANCE
            );

            error.status = 400;

            throw error;

        }

    }

    const application =
    await model.createApplication(

    employee_id,
    leave_type_id,

    from_date,
    to_date,

    data.from_time,
    data.to_time,

    reason,

    total_days,
    total_hours

    );

    return {
        data: application
    };

};

// ================= GET ALL =================

const getAll =
async () => {

    return await model.getAll();

};

// ================= GET BY EMPLOYEE =================

const getByEmployee =
async (employeeId) => {

    return await model.getByEmployee(
        employeeId
    );

};

// ================= UPDATE STATUS =================

const updateStatus =
async (id, status) => {

    const allowed = [

        "APPROVED",

        "REJECTED"

    ];

    if (
        !allowed.includes(status)
    ) {

        const error = new Error(
            RESPONSE.LEAVE_APPLICATION.INVALID_STATUS
        );

        error.status = 400;

        throw error;

    }

    return await model.updateStatus(
        id,
        status
    );

};

// ================= CANCEL LEAVE =================

const cancelLeave =
async (
    id,
    reason
) => {

    if (!reason) {

        const error = new Error(
            RESPONSE.LEAVE_APPLICATION.CANCELLATION_REASON_REQUIRED
        );

        error.status = 400;

        throw error;

    }

    const application =
    await model.getById(id);

    if (!application) {

        const error = new Error(
            RESPONSE.LEAVE_APPLICATION.NOT_FOUND
        );

        error.status = 404;

        throw error;

    }

    if (
        application.status ===
        "REJECTED"
    ) {

        const error = new Error(
            RESPONSE.LEAVE_APPLICATION.REJECTED_CANNOT_CANCEL
        );

        error.status = 400;

        throw error;

    }

    if (
        application.cancel_requested
    ) {

        const error = new Error(
            RESPONSE.LEAVE_APPLICATION.ALREADY_CANCELLED
        );

        error.status = 400;

        throw error;

    }

    return await model.cancelLeave(
        id,
        reason
    );

};

module.exports = {

    applyLeave,

    getAll,

    getByEmployee,

    updateStatus,

    cancelLeave

};