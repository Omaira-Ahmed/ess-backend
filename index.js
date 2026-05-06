const express = require("express");
const app = express();

app.use(express.json());

console.log("🔥 INDEX.JS IS RUNNING");

// routes
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

const userRoutes = require("./routes/userRoutes");
app.use("/api/user", userRoutes);

const employeeRoutes = require("./routes/employeeRoutes");
app.use("/api/employees", employeeRoutes);

// test route
app.get("/test", (req, res) => {
    res.send("TEST ROUTE WORKING");
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});