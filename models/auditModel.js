const db = require("../config/db");

// ================= EMPLOYEE EXISTS =================

const employeeExists =
async (employeeId) => {

    const result =
    await db.query(

    `SELECT employee_id
     FROM employees
     WHERE employee_id = $1`,

    [employeeId]

    );

    return result.rows[0];

};

// ================= GET LEAVE LOGS =================
const getLeaveLogs = async () => {

    const result =
    await db.query(

`SELECT

lrl.log_id,

lrl.action,

lrl.action_time,

lrl.remarks,

emp.first_name ||
' ' ||
emp.last_name
AS performed_by,

reqEmp.first_name ||
' ' ||
reqEmp.last_name
AS employee_name,

lt.description AS leave_type,

la.from_date,

la.to_date

FROM leave_request_logs lrl

LEFT JOIN leave_requests lr
ON lrl.leave_request_id = lr.request_id

LEFT JOIN leave_application la
ON lr.application_id = la.application_id

LEFT JOIN employees emp
ON lrl.performed_by = emp.employee_id

LEFT JOIN employees reqEmp
ON la.employee_id = reqEmp.employee_id

LEFT JOIN leave_types lt
ON la.leave_type_id = lt.leave_type_id

ORDER BY lrl.action_time DESC;`

    );

    return result.rows;

};

// ================= GET EMPLOYEE HISTORY =================
const getEmployeeHistory =
async (employee_id) => {

    const result =
    await db.query(

`SELECT *
FROM employee_status_history
WHERE employee_id=$1
ORDER BY changed_at DESC`,

[employee_id]

    );

    return result.rows;

};

// ================= INSERT EMPLOYEE HISTORY =================
const addEmployeeHistory =
async (
employee_id,
status,
reason
) => {

    const result =
    await db.query(

`INSERT INTO employee_status_history
(employee_id,status,reason)

VALUES ($1,$2,$3)

RETURNING *`,

[
employee_id,
status,
reason
]

    );

    return result.rows[0];

};

// ================= INSERT LEAVE LOG =================
const addLeaveLog =
async (
leave_request_id,
action,
performed_by,
remarks
) => {

    const result =
    await db.query(

`INSERT INTO leave_request_logs

(
leave_request_id,
action,
performed_by,
remarks
)

VALUES
($1,$2,$3,$4)

RETURNING *`,

[
leave_request_id,
action,
performed_by,
remarks
]

    );

    return result.rows[0];

};

// ================= EMPLOYEE LEAVE HISTORY =================

const getEmployeeLeaveHistory =
async (employeeId) => {

    const result =
    await db.query(

`SELECT

la.application_id,

lt.description AS leave_type,

la.from_date,

la.to_date,

la.total_days,

la.status,

la.applied_at,

lr.action,

lr.action_time,

approver.first_name ||
' ' ||
approver.last_name
AS action_by,

lr.remarks

FROM leave_application la

LEFT JOIN leave_types lt
ON la.leave_type_id = lt.leave_type_id

LEFT JOIN leave_requests lr
ON la.application_id = lr.application_id

LEFT JOIN employees approver
ON lr.performed_by = approver.employee_id

WHERE la.employee_id = $1

ORDER BY la.applied_at DESC;`,

[employeeId]

    );

    return result.rows;

};

// ================= HR LEAVE HISTORY =================

const getAllLeaveHistory =
async () => {

    const result =
    await db.query(

`SELECT

la.application_id,

emp.first_name ||
' ' ||
emp.last_name
AS employee_name,

lt.description AS leave_type,

la.from_date,

la.to_date,

la.total_days,

la.status,

la.applied_at,

lr.action,

lr.action_time,

approver.first_name ||
' ' ||
approver.last_name
AS action_by,

lr.remarks

FROM leave_application la

LEFT JOIN employees emp
ON la.employee_id = emp.employee_id

LEFT JOIN leave_types lt
ON la.leave_type_id = lt.leave_type_id

LEFT JOIN leave_requests lr
ON la.application_id = lr.application_id

LEFT JOIN employees approver
ON lr.performed_by = approver.employee_id

ORDER BY la.applied_at DESC;`

    );

    return result.rows;

};

// ================= EMPLOYEE LEAVE BALANCES =================

const getEmployeeBalances =
async (employeeId) => {

    const result =
    await db.query(

`SELECT

lb.balance_id,

lt.description AS leave_type,

lb.year,

lb.allocated,

lb.used,

lb.carried_forward,

lb.remaining

FROM leave_balance lb

LEFT JOIN leave_types lt
ON lb.leave_type_id = lt.leave_type_id

WHERE lb.employee_id = $1

ORDER BY lb.year DESC`,

[employeeId]

    );

    return result.rows;

};

module.exports = {
employeeExists,

getLeaveLogs,

getEmployeeHistory,

addEmployeeHistory,

addLeaveLog,

getEmployeeLeaveHistory,
getAllLeaveHistory,
getEmployeeBalances

};