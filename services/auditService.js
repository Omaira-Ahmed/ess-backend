const RESPONSE =
require("../utils/responseMessages");

const model =
require("../models/auditModel");

// ================= EMPLOYEE HISTORY HI MY NAME IS OMAIRA=================

const getEmployeeLeaveHistory =
async (employeeId) => {

    if (!employeeId) {

        const error =
        new Error(
            RESPONSE.AUDIT.INVALID_EMPLOYEE_ID
        );

        error.status = 400;

        throw error;

    }

    const employee =
    await model.employeeExists(
        employeeId
    );

    if (!employee) {

        const error =
        new Error(
            RESPONSE.AUDIT.EMPLOYEE_NOT_FOUND
        );

        error.status = 404;

        throw error;

    }

    const leaves =
    await model.getEmployeeLeaveHistory(
        employeeId
    );

    if (leaves.length === 0) {

        const error =
        new Error(
            RESPONSE.AUDIT.NO_LEAVE_HISTORY
        );

        error.status = 404;

        throw error;

    }

    return leaves;

};

// ================= HR HISTORY =================

const getAllLeaveHistory =
async () => {

    return await model
    .getAllLeaveHistory();

};

// ================= LEAVE LOGS =================

const getLeaveLogs =
async () => {

    return await model
    .getLeaveLogs();

};

// ================= EMPLOYEE STATUS HISTORY =================

const getEmployeeHistory =
async (employeeId) => {

    if (!employeeId) {

        const error =
        new Error(
            RESPONSE.AUDIT.INVALID_EMPLOYEE_ID
        );

        error.status = 400;

        throw error;

    }

    const employee =
    await model.employeeExists(
        employeeId
    );

    if (!employee) {

        const error =
        new Error(
            RESPONSE.AUDIT.EMPLOYEE_NOT_FOUND
        );

        error.status = 404;

        throw error;

    }

    const history =
    await model.getEmployeeHistory(
        employeeId
    );

    if (history.length === 0) {

        const error =
        new Error(
            RESPONSE.AUDIT.NO_HISTORY_FOUND
        );

        error.status = 404;

        throw error;

    }

    return history;

};


// ================= BALANCES =================

const getEmployeeBalances =
async (employeeId) => {

    if (!employeeId) {

        const error =
        new Error(
            RESPONSE.AUDIT.INVALID_EMPLOYEE_ID
        );

        error.status = 400;

        throw error;

    }

    const employee =
    await model.employeeExists(
        employeeId
    );

    if (!employee) {

        const error =
        new Error(
            RESPONSE.AUDIT.EMPLOYEE_NOT_FOUND
        );

        error.status = 404;

        throw error;

    }


    const balances =
    await model.getEmployeeBalances(
        employeeId
    );

    if (balances.length === 0) {

        const error =
        new Error(
            RESPONSE.AUDIT.NO_BALANCES_FOUND
        );

        error.status = 404;

        throw error;

    }

    return balances;

};

module.exports = {

    getEmployeeLeaveHistory,

    getAllLeaveHistory,

    getLeaveLogs,

    getEmployeeHistory,

    getEmployeeBalances

};