const winston = require("winston");

const auditLogger = winston.createLogger({

    level: process.env.LOG_LEVEL || "info",

    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),

    transports: [
        new winston.transports.File({
            filename: "logs/audit.log"
        })
    ]

});

const audit = (message) => {

    auditLogger.info({
        type: "AUDIT",
        message
    });

};

audit.info = (message) => {

    auditLogger.info({
        type: "AUDIT",
        message
    });

};

audit.warn = (message) => {

    auditLogger.warn({
        type: "AUDIT",
        message
    });

};

audit.error = (message) => {

    auditLogger.error({
        type: "AUDIT",
        message
    });

};

module.exports = audit;