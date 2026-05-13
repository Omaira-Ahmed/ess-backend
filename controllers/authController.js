const jwt = require("jsonwebtoken");
const model = require("../models/userModel");

const JWT_SECRET = "mysecretkey";

// ================= REGISTER =================
const register = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await model.createUser(email, password);

        res.status(201).json({
            message: "User registered",
            data: user
        });

    } catch (err) {
        res.status(500).json({
            message: "Server error",
            error: err.message
        });
    }
};

// ================= LOGIN =================
const login = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await model.findUserByEmail(email);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const token = jwt.sign(
            {
                user_id: user.user_id,
                email: user.email,
                role: user.role   // 🔥 THIS IS NOW REAL
            },
            JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.json({
            message: "Login successful",
            token
        });

    } catch (err) {
        res.status(500).json({
            message: "Server error",
            error: err.message
        });
    }
};

module.exports = {
    register,
    login
};