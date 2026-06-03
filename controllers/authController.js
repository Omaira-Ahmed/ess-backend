require("dotenv").config();
const logger = require("../utils/logger");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const model = require("../models/userModel");

const JWT_SECRET = process.env.JWT_SECRET;

// ================= REGISTER =================
const register = async (req, res) => {
    try {

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password required"
            });
        }

        const existingUser =
            await model.findUserByEmail(email);

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        const hashedPassword =
            await bcrypt.hash(password, 10);

        const user =
            await model.createUser(
                email,
                hashedPassword
            );

        res.status(201).json({
            message: "User registered successfully",
            data: user
        });

    } catch (err) {

        logger.error(err);

        res.status(500).json({
            message: "Server error",
            error: err.message
        });

    }
};

// ================= LOGIN =================
const login = async (req, res) => {
    try {

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password required"
            });
        }

        const user =
            await model.findUserByEmail(email);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const isMatch =
            await bcrypt.compare(
                password,
                user.password_hash
            );

        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid credentials"
            });
        }

        const token = jwt.sign(
            {
                user_id: user.user_id,
                email: user.email,
                role: user.role
            },
            JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );

        res.status(200).json({
            message: "Login successful",
            token
        });

    } catch (err) {

        console.error(err);

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