const service =
require("../services/auditService");
const auditLogger =
require("../utils/auditLogger");

// ================= EMPLOYEE LEAVES =================

const getMyLeaveHistory =
async (req,res,next) => {

    try {

        const employeeId =
        req.user.employee_id;

        const data =
        await service
        .getEmployeeLeaveHistory(
            employeeId
        );

        auditLogger.info({
            action: "VIEW_MY_LEAVES",
            employee_id: employeeId
        });

        res.status(200).json(data);

    }

    catch(error) {

        next(error);

    }

};

// ================= HR ALL LEAVES =================

const getAllLeaveHistory =
async (req,res,next) => {

    try {

        const data =
        await service
        .getAllLeaveHistory();

        auditLogger.info({
            action: "VIEW_ALL_LEAVE_HISTORY",
            viewed_by: req.user.employee_id
        });

        res.status(200).json(data);

    }

    catch(error) {

        next(error);

    }

};

// ================= LEAVE LOGS =================

const getLeaveLogs =
async (req,res,next) => {

    try {

        const data =
        await service
        .getLeaveLogs();

        auditLogger.info({
            action: "VIEW_LEAVE_LOGS",
            viewed_by: req.user.employee_id
        });

        res.status(200).json(data);

    }

    catch(error) {

        next(error);

    }

};

// ================= EMPLOYEE STATUS HISTORY =================

const getEmployeeHistory =
async (req,res,next) => {

    try {

        const employeeId =
        parseInt(
            req.params.employeeId
        );

        if (isNaN(employeeId)) {

            return res.status(400).json({
                message:
                RESPONSE.AUDIT.INVALID_EMPLOYEE_ID
            });

        }

        const data =
        await service
        .getEmployeeHistory(
            employeeId
        );

        auditLogger.info({
            action: "VIEW_EMPLOYEE_HISTORY",
            employee_id: employeeId,
            viewed_by: req.user.employee_id
        });

        res.status(200).json(data);

    }

    catch(error) {

        next(error);

    }

};

// ================= BALANCES =================

const getEmployeeBalances =
async (req,res,next) => {

    try {

        const employeeId =
        req.user.employee_id;


        const data =
        await service
        .getEmployeeBalances(
            employeeId
        );

        auditLogger.info({
            action: "VIEW_BALANCES",
            employee_id: employeeId
        });

        res.status(200).json(data);

    }

    catch(error) {

        next(error);

    }

};

module.exports = {

    getMyLeaveHistory,

    getAllLeaveHistory,

    getLeaveLogs,

    getEmployeeHistory,

    getEmployeeBalances

};