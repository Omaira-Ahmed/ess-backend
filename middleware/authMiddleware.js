const jwt = require("jsonwebtoken");

const JWT_SECRET = "mysecretkey";

const authMiddleware = (req, res, next) => {
    try {
        const token = req.header("Authorization");

        if (!token) {
            return res.status(401).json({ message: "No token, access denied" });
        }

        // Format: Bearer TOKEN
        const actualToken = token.split(" ")[1];

        const verified = jwt.verify(actualToken, JWT_SECRET);

        req.user = verified;

        next();

    } catch (err) {
        res.status(401).json({ message: "Invalid token" });
    }
};

module.exports = authMiddleware;