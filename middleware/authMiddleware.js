const jwt = require("jsonwebtoken");

const JWT_SECRET = "mysecretkey";

const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.header("Authorization");

        if (!authHeader) {
            return res.status(401).json({
                message: "No token, access denied"
            });
        }

        const parts = authHeader.split(" ");

        if (parts.length !== 2) {
            return res.status(401).json({
                message: "Invalid token format"
            });
        }

        const token = parts[1];

        const verified = jwt.verify(token, JWT_SECRET);

        console.log("DECODED USER:", verified); // 🔥 DEBUG

        req.user = verified;

        next();

    } catch (err) {
        return res.status(401).json({
            message: "Invalid token",
            error: err.message
        });
    }
};

module.exports = authMiddleware;