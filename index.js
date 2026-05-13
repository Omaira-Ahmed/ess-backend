const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const employeeRoutes = require("./routes/employeeRoutes");
const departmentRoutes = require("./routes/departmentRoutes");
const sectionRoutes = require("./routes/sectionRoutes");
const designationRoutes = require("./routes/designationRoutes");
const causeRoutes = require("./routes/causeOfAbsenceRoutes");
const employeeLeaveSetupRoutes = require("./routes/employeeLeaveSetupRoutes");
const leaveApplicationRoutes = require("./routes/leaveApplicationRoutes");
const leaveApprovalRoutes = require("./routes/leaveApprovalRoutes");
const leaveRegistrationRoutes = require("./routes/leaveRegistrationRoutes");
const leaveCancellationRoutes = require("./routes/leaveCancellationRoutes");
const leaveBalanceRoutes = require("./routes/leaveBalanceRoutes");
const noSeriesRoutes = require("./routes/noSeriesRoutes");
const auditRoutes = require("./routes/auditRoutes");



const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/sections", sectionRoutes);
app.use("/api/designations", designationRoutes);
app.use("/api/cause-of-absence", causeRoutes);
app.use("/api/employee-leave-setup", employeeLeaveSetupRoutes);
app.use("/api/leave-applications", leaveApplicationRoutes);
app.use("/api/leave-approvals", leaveApprovalRoutes);
console.log("REGISTER ROUTES:", leaveRegistrationRoutes);
console.log("DEBUG leaveRegistrationRoutes:", leaveRegistrationRoutes);
app.use("/api/leave-register", leaveRegistrationRoutes);
app.use("/api/leave-cancellations", leaveCancellationRoutes);
app.use("/api/leave-balance", leaveBalanceRoutes);
app.use("/api/no-series", noSeriesRoutes);
app.use("/api", auditRoutes);
const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


