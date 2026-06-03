require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const logger = require("./utils/logger");

const app = express(); // ✅ MUST BE FIRST

// ================= SECURITY =================
app.set("trust proxy", 1); // ✅ FIXED POSITION

app.use(helmet());

// ================= CORS =================
app.use(
    cors({
        origin: process.env.CLIENT_URL,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
        credentials: true
    })
);

// ================= BODY =================
app.use(express.json());

// ================= ROUTES =================
app.use("/api/v1/auth", require("./routes/authRoutes"));
app.use("/api/v1/employees", require("./routes/employeeRoutes"));
app.use("/api/v1/departments", require("./routes/departmentRoutes"));
app.use("/api/v1/sections", require("./routes/sectionRoutes"));
app.use("/api/v1/designations", require("./routes/designationRoutes"));
app.use("/api/v1/cause-of-absence", require("./routes/causeOfAbsenceRoutes"));
app.use("/api/v1/employee-leave-setup", require("./routes/employeeLeaveSetupRoutes"));
app.use("/api/v1/leave-applications", require("./routes/leaveApplicationRoutes"));
app.use("/api/v1/leave-approvals", require("./routes/leaveApprovalRoutes"));
app.use("/api/v1/leave-register", require("./routes/leaveRegistrationRoutes"));
app.use("/api/v1/leave-cancellations", require("./routes/leaveCancellationRoutes"));
app.use("/api/v1/leave-balance", require("./routes/leaveBalanceRoutes"));
app.use("/api/v1/no-series", require("./routes/noSeriesRoutes"));
app.use("/api/v1/audit", require("./routes/auditRoutes"));

// ================= HEALTH =================
app.get("/health", (req, res) => {
    res.status(200).json({
        status: "UP",
        message: "ESS Backend running",
        timestamp: new Date()
    });
});

// ================= 404 =================
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found"
    });
});

// ================= ERROR HANDLER =================
app.use((err, req, res, next) => {

    logger.error(err.message);

    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Internal server error"
    });

});

module.exports = app;