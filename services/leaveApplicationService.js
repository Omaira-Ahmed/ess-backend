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

throw new Error(
"End date cannot be before start date"
);

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

throw new Error(
"Invalid leave time range"
);

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

        throw new Error(
            "Missing required fields"
        );

    }

    // EMPLOYEE CHECK

    const employee =
    await model.getEmployee(
        employee_id
    );

    if (!employee) {

        throw new Error(
            "Employee not found"
        );

    }

    // OVERLAP CHECK

    const overlap =
    await model.checkOverlap(

        employee_id,

        from_date,

        to_date

    );

    if (overlap) {

        throw new Error(

            "Leave dates overlap with an existing application"

        );

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

        throw new Error(
            "Leave type not found"
        );

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

            throw new Error(
                "Leave balance not found"
            );

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

            throw new Error(

                `Insufficient leave balance. Remaining: ${remaining}`

            );

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

        message:
        "Leave application created successfully",

        data:
        application

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

        throw new Error(
            "Invalid status"
        );

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

        throw new Error(
            "Cancellation reason is required"
        );

    }

    const application =
    await model.getById(id);

    if (!application) {

        throw new Error(
            "Application not found"
        );

    }

    if (
        application.status ===
        "REJECTED"
    ) {

        throw new Error(
            "Rejected leave cannot be cancelled"
        );

    }

    if (
        application.cancel_requested
    ) {

        throw new Error(
            "Cancellation already requested"
        );

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