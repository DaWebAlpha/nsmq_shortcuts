import { HTTP_STATUS } from "../constants/index.js";
import { AppError } from "./app.error.js";

/**
 * 500 Internal Server Error — an unexpected failure that isn't the caller's
 * fault, as opposed to the anticipated 4xx errors elsewhere in this folder.
 *
 * @extends AppError
 */
class InternalServerError extends AppError{
    /**
     * @param {object} [options]
     * @param {string} [options.message="Internal server error"] - Human-readable error message.
     * @param {string} [options.code] - Optional machine-readable error code.
     */
    constructor({
        message = "Internal server error",
        code,
    } = {}){
        super({
            message,
            statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
            code,
        })
    }
}

export { InternalServerError };
