const logger = require("../utils/logger");

const service =
require("../services/leaveApprovalService");

const RESPONSE =
require("../utils/responseMessages");

const audit =
require("../utils/auditLogger");

// ================= GET PENDING =================
const getPendingRequests = async (req, res, next) => {
    try {
        const managerId = parseInt(req.params.managerId);

        const requests = await service.getPendingRequests(
            managerId
        );

        res.status(200).json({
            message: RESPONSE.LEAVE_APPROVAL.PENDING_FETCHED,
            data: requests
        });

    } catch (error) {
        next(error);
    }
};

// ================= APPROVE =================
const approveLeave = async (req, res, next) => {
    try {
        const applicationId = parseInt(req.params.applicationId);
        const remarks = req.body.remarks || "";
        const userId = req.user.user_id;

        const result = await service.approveLeave(
            applicationId,
            userId,
            remarks
        );

        audit(
            `Leave approved: Application ${applicationId} by User ${userId}`
        );

        res.status(200).json({
            message: RESPONSE.LEAVE_APPROVAL.APPROVED,
            data: result
        });

    } catch (error) {
        next(error);
    }
};

// ================= REJECT =================
const rejectLeave = async (req, res, next) => {
    try {
        const applicationId = parseInt(req.params.applicationId);
        const remarks = req.body.remarks || "";
        const userId = req.user.user_id;

        const result = await service.rejectLeave(
            applicationId,
            userId,
            remarks
        );

        audit(
            `Leave rejected: Application ${applicationId} by User ${userId}`
        );

        res.status(200).json(result);

    } catch (error) {
        next(error);
    }
};

// ================= HISTORY =================
const getApprovalHistory = async (req, res, next) => {
    try {
        const applicationId = parseInt(req.params.applicationId);

        const history =
        await service.getApprovalHistory(
            applicationId
        );

        res.status(200).json({
            message: RESPONSE.LEAVE_APPROVAL.HISTORY_FETCHED,
            data: history
        });

    } catch (error) {
        next(error);
    }
};

module.exports = {
    getPendingRequests,
    approveLeave,
    rejectLeave,
    getApprovalHistory
};