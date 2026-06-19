require("dotenv").config();

const bcrypt =
require("bcrypt");

const jwt =
require("jsonwebtoken");

const RESPONSE =
require("../utils/responseMessages");

const repository =
require("../repositories/userRepository");

const JWT_SECRET =
process.env.JWT_SECRET;

// ================= REGISTER =================

const register =
async ({ email, password }) => {


    if (!email || !password) {

        const error =
        new Error(
            RESPONSE.AUTH.EMAIL_PASSWORD_REQUIRED
        );

        error.status = 400;

        throw error;
    }

    const existingUser =
    await repository.findUserByEmail(
        email
    );

    if (existingUser) {

        const error =
        new Error(
            RESPONSE.AUTH.USER_ALREADY_EXISTS
        );

        error.status = 400;

        throw error;

    }

    const hashedPassword =
    await bcrypt.hash(
        password,
        10
    );

    const user =
    await repository.createUser(

        email,

        hashedPassword

    );

    return user;
};

// ================= LOGIN =================

const login =
async ({ email, password }) => {

    if (!email || !password) {

        const error =
        new Error(
            RESPONSE.AUTH.EMAIL_PASSWORD_REQUIRED
        );

        error.status = 400;

        throw error;
    }

    const user =
    await repository.findUserByEmail(
        email
    );

    if (!user) {

        const error =
        new Error(
            RESPONSE.AUTH.USER_NOT_FOUND
        );

        error.status = 404;

        throw error;

    }

    const isMatch =
    await bcrypt.compare(

        password,

        user.password_hash

    );

    if (!isMatch) {

        const error =
        new Error(
            RESPONSE.AUTH.INVALID_CREDENTIALS
        );

        error.status = 401;

        throw error;

    }

    const token =
    jwt.sign(

        {
            user_id: user.user_id,
            employee_id: user.employee_id,
            email: user.email,
            role: user.role
        },

        JWT_SECRET,

        {
            expiresIn: "1d"
        }

    );

    return { token };
};

module.exports = {

    register,

    login

};

