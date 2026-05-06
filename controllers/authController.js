const pool = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// 🔐 SECRET KEY (later move to .env)
const JWT_SECRET = "mysecretkey";

// ================= REGISTER =================
const register = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Check if user exists
        const userCheck = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );

        if (userCheck.rows.length > 0) {
            return res.status(400).json({ message: "User already exists" });
        }

        // 2. Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 3. Insert user
        const newUser = await pool.query(
            "INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING user_id, email",
            [email, hashedPassword]
        );

        res.status(201).json({
            message: "User registered successfully",
            user: newUser.rows[0],
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server error" });
    }
};

// ================= LOGIN =================
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Check user
        const user = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );

        if (user.rows.length === 0) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // 2. Compare password
        const validPassword = await bcrypt.compare(
            password,
            user.rows[0].password_hash
        );

        if (!validPassword) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // 3. Create token
        const token = jwt.sign(
            { user_id: user.rows[0].user_id },
            JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.json({
            message: "Login successful",
            token,
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = { register, login };