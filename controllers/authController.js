
const logger = require("../utils/logger");
const authService =
require("../services/authService");
const RESPONSE =
require("../utils/responseMessages");

const auditLogger =
require("../utils/auditLogger");

// ================= REGISTER =================
const register = async (req, res, next) => {
    try {

        const { email, password } = req.body;

        const user =
        await authService.register({
            email,
            password
        });

        auditLogger.info({
            action: "REGISTER",
            email
        });

        res.status(201).json({
            message:
            RESPONSE.AUTH.REGISTER_SUCCESS,
            data: user
        });

    } catch (err) {

        next(err);

    }
};

// ================= LOGIN =================
const login = async (req, res, next) => {
    try {

        const { email, password } = req.body;
     
        const result =
        await authService.login({
            email,
            password
        });

        auditLogger.info({
            action: "LOGIN",
            email
        });

        res.status(200).json({
            message:
            RESPONSE.AUTH.LOGIN_SUCCESS,

            token:
            result.token
        });

    } catch (err) {

        next(err);

    }
};

module.exports = {
    register,
    login
};

