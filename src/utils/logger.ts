import winston = require("winston");

export const logError = (message: string, error = {}) => {
    logger.log("error", message, {
        error: enumerateErrorFormat(error),
    });
};

export const logWarning = (message: string, error = {}) => {
    logger.log("warn", message, {
        error: enumerateErrorFormat(error),
    });
};

export const logger = winston.createLogger({
    level: "info",
    transports: [
        new winston.transports.Console(),
    ],
});

export const enumerateErrorFormat = winston.format((info: any) => {
    if (info.message instanceof Error) {
        info.message = Object.assign(
            {
                message: info?.message?.message ?? "no-message",
                stack: info?.message?.stack ?? "no-stack",
            },
            info.message
        );
    }

    if (info instanceof Error) {
        return Object.assign(
            {
                message: info.message,
                stack: info.stack,
            },
            info
        );
    }

    return info;
});
