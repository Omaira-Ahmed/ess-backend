const logger = require("../utils/logger");

const service =
require("../services/leaveApprovalService");

// ================= GET PENDING =================
const getPendingRequests = async (req, res) => {
    try {
        const managerId = parseInt(req.params.managerId);

        const requests = await service.getPendingRequests(
            managerId
        );

        res.status(200).json({
            message: "Pending requests fetched",
            data: requests
        });

    } catch (error) {
        logger.error(error);

        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

// ================= APPROVE =================
const approveLeave = async (req, res) => {
    try {
        const applicationId = parseInt(req.params.applicationId);
        const remarks = req.body.remarks || "";
        const userId = req.user.user_id;

        const result = await service.approveLeave(
            applicationId,
            userId,
            remarks
        );

        res.status(200).json({
            message: "Leave approved successfully",
            data: result
        });

    } catch (error) {
        logger.error(error);

        res.status(400).json({
            message: error.message
        });
    }
};

// ================= REJECT =================
const rejectLeave = async (req, res) => {
    try {
        const applicationId = parseInt(req.params.applicationId);
        const remarks = req.body.remarks || "";
        const userId = req.user.user_id;

        const result = await service.rejectLeave(
            applicationId,
            userId,
            remarks
        );

        res.status(200).json(result);

    } catch (error) {
        logger.error(error);

        res.status(400).json({
            message: error.message
        });
    }
};

// ================= HISTORY =================
const getApprovalHistory = async (req, res) => {
    try {
        const applicationId = parseInt(req.params.applicationId);

        const history =
        await service.getApprovalHistory(
            applicationId
        );

        res.status(200).json({
            message: "History fetched",
            data: history
        });

    } catch (error) {
        logger.error(error);

        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

module.exports = {
    getPendingRequests,
    approveLeave,
    rejectLeave,
    getApprovalHistory
};