const leaveApprovalModel = require(
    "../models/leaveApprovalModel"
);

// ================= GET PENDING =================
const getPendingRequests = async (req, res) => {
    try {
        const { managerId } = req.params;

        const requests =
            await leaveApprovalModel.getPendingRequests(
                managerId
            );

        res.status(200).json(requests);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

// ================= APPROVE =================
const approveLeave = async (req, res) => {
    try {
        const { applicationId } = req.params;

        const {
            performed_by,
            remarks
        } = req.body;

        const updated =
            await leaveApprovalModel.updateLeaveStatus(
                applicationId,
                "APPROVED"
            );

        await leaveApprovalModel.insertActionLog(
            applicationId,
            "APPROVED",
            performed_by,
            remarks
        );

        res.status(200).json({
            message: "Leave approved successfully",
            data: updated
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

// ================= REJECT =================
const rejectLeave = async (req, res) => {
    try {
        const { applicationId } = req.params;

        const {
            performed_by,
            remarks
        } = req.body;

        const updated =
            await leaveApprovalModel.updateLeaveStatus(
                applicationId,
                "REJECTED"
            );

        await leaveApprovalModel.insertActionLog(
            applicationId,
            "REJECTED",
            performed_by,
            remarks
        );

        res.status(200).json({
            message: "Leave rejected",
            data: updated
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

// ================= HISTORY =================
const getApprovalHistory = async (req, res) => {
    try {
        const { applicationId } = req.params;

        const history =
            await leaveApprovalModel.getApprovalHistory(
                applicationId
            );

        res.status(200).json(history);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

module.exports = {
    getPendingRequests,
    approveLeave,
    rejectLeave,
    getApprovalHistory
};