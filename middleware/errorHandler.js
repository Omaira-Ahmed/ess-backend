const logger = require("../utils/logger");
const RESPONSE =
require("../utils/responseMessages");
const errorHandler = (err, req, res, next) => {

    logger.error({
        message: err.message,
        stack: err.stack,
        path: req.originalUrl,
        method: req.method
    });

    res.status(err.status || 500).json({
        success: false,
        message:
            err.message ||
            RESPONSE.COMMON.INTERNAL_SERVER_ERROR
    });

};

module.exports = errorHandler;