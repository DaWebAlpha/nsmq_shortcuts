import { HTTP_STATUS } from "../constants/index.js";

/**
 * Base class for all operational application errors.
 *
 * Extends the built-in `Error` with an HTTP status code, an optional
 * machine-readable `code`, and an `isOperational` flag that marks it as an
 * anticipated, handled error rather than an unexpected bug — error-handling
 * middleware uses that flag to decide whether it's safe to show `message`
 * to the client verbatim.
 *
 * @extends Error
 */
class AppError extends Error{
    /**
     * @param {object} [options]
     * @param {string} [options.message="Internal server error"] - Human-readable error message.
     * @param {number} [options.statusCode=HTTP_STATUS.INTERNAL_SERVER_ERROR] - HTTP status code to send in the response.
     * @param {string} [options.code] - Optional machine-readable error code (e.g. "USER_NOT_FOUND").
     */
    constructor({
        message = "Internal server error",
        statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR,
        code
    } = {}){
        super(message);
        this.statusCode = statusCode;
        this.code = code;
        this.isOperational = true;
        if(Error.captureStackTrace){
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export {
    AppError
}
