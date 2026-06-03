require("dotenv").config();

const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

const authMiddleware = (req, res, next) => {

    try {

        const authHeader =
            req.header("Authorization");

        if (!authHeader) {

            return res.status(401).json({
                message: "No token provided"
            });

        }

        const parts =
            authHeader.split(" ");

        if (parts.length !== 2) {

            return res.status(401).json({
                message:
                "Invalid token format"
            });

        }

        const token = parts[1];

        const decoded =
            jwt.verify(
                token,
                JWT_SECRET
            );

        req.user = decoded;

        next();

    }

    catch (err) {

        return res.status(401).json({

            message:
            "Invalid or expired token",

            error:
            err.message

        });

    }

};

module.exports =
authMiddleware;