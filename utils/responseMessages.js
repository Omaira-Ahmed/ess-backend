const RESPONSE = {

    COMMON: {
        SERVER_ERROR: "Server error",
        INTERNAL_SERVER_ERROR: "Internal server error"
    },

    AUDIT: {

        INVALID_EMPLOYEE_ID:
            "Invalid employee id",

        EMPLOYEE_NOT_FOUND:
            "Employee not found",

        NO_LEAVE_HISTORY:
            "No leave history found",

        NO_HISTORY_FOUND:
            "No employee history found",

        NO_BALANCES_FOUND:
            "No leave balances found"

    },

    AUTH: {
        EMAIL_PASSWORD_REQUIRED:
            "Email and password required",

        USER_ALREADY_EXISTS:
            "User already exists",

        USER_NOT_FOUND:
            "User not found",

        INVALID_CREDENTIALS:
            "Invalid credentials",

        LOGIN_SUCCESS:
            "Login successful",

        REGISTER_SUCCESS:
            "User registered successfully"
    },

    CAUSE: {

        REQUIRED_FIELDS:
            "code, description and leave_type_id are required",

        NOT_FOUND:
            "Cause not found",

        DEACTIVATED:
            "Cause deactivated"

    },
    DEPARTMENT: {

        REQUIRED_FIELDS:
            "Code and department name are required",

        CREATED:
            "Department created successfully"

    },

    DESIGNATION: {

        REQUIRED_FIELDS:
            "Code and designation name are required",

        CREATED:
            "Designation created successfully"

    },

    EMPLOYEE: {

        CREATED:
            "Employee created successfully",

        NOT_FOUND:
            "Employee not found"

    },

    EMPLOYEE_LEAVE_SETUP: {

        REQUIRED_FIELDS:
            "employee_id, leave_type_id, year are required",

        NOT_FOUND:
            "Employee leave setup not found",

        CREATED:
            "Employee leave setup created successfully",

        DEACTIVATED:
            "Employee leave setup deactivated successfully"

    },

    LEAVE_APPLICATION: {

        CREATED:
            "Leave application created successfully",

        REQUIRED_FIELDS:
            "Missing required fields",

        LEAVE_TYPE_NOT_FOUND:
            "Leave type not found",

        NOT_FOUND:
            "Application not found",

        INVALID_STATUS:
            "Invalid status",

        CANCELLATION_REASON_REQUIRED:
            "Cancellation reason is required",

        ALREADY_CANCELLED:
            "Cancellation already requested",

        REJECTED_CANNOT_CANCEL:
            "Rejected leave cannot be cancelled",

        OVERLAP:
            "Leave dates overlap with an existing application",

        INVALID_DATE_RANGE:
            "End date cannot be before start date",

        INVALID_TIME_RANGE:
            "Invalid leave time range",

        BALANCE_NOT_FOUND:
            "Leave balance not found",

        INSUFFICIENT_BALANCE:
            "Insufficient leave balance",

    },

    LEAVE_APPROVAL: {


        REJECTED:
            "Leave rejected successfully",

        PENDING_FETCHED:
            "Pending requests fetched",

        APPROVED:
            "Leave approved successfully",

        HISTORY_FETCHED:
            "Approval history fetched",

        NOT_FOUND:
            "Application not found",

        ALREADY_PROCESSED:
            "Leave already processed",

        LEAVE_TYPE_NOT_FOUND:
            "Leave type not found",

        BALANCE_NOT_FOUND:
            "Leave balance not found",

        INSUFFICIENT_BALANCE:
            "Insufficient leave balance",

        INVALID_APPLICATION_ID:
            "Invalid application id"
    },

    LEAVE_BALANCE: {

        INVALID_EMPLOYEE_ID:
            "Invalid employee id",

        LEAVE_DAYS_REQUIRED:
            "leave_days required",

        NOT_FOUND:
            "Balance record not found",

        FETCHED:
            "Leave balance fetched",

        UPDATED:
            "Balance updated"

    },

    LEAVE_CANCELLATION: {

        APPLICATION_ID_REQUIRED:
            "applicationId is required",

        CANCELLED:
            "Leave cancelled successfully"

    },

    LEAVE_REGISTRATION: {

        INVALID_APPLICATION_ID:
            "Invalid application id",

        REGISTERED:
            "Leave registered successfully",

        NOT_FOUND:
            "Application not found",

        NOT_APPROVED:
            "Only approved leaves can be registered",

        ALREADY_REGISTERED:
            "Leave already registered"
    },

    LEAVE_TYPE: {

        REQUIRED_FIELDS:
            "Code and description are required",

        CREATED:
            "Leave type created successfully"

    },

    NO_SERIES: {

        CODE_REQUIRED:
            "Series code is required",

        NOT_FOUND:
            "Series not found"

    },

    SECTION: {

        REQUIRED_FIELDS:
            "Code, section name and department id are required"

    },

};

module.exports = RESPONSE;