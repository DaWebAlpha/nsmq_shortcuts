import { HTTP_STATUS } from "../constants/index.js";
import { AppError } from "./app.error.js";

/**
 * 400 Bad Request — the request was malformed or failed validation.
 *
 * @extends AppError
 */
class BadRequestError extends AppError{
    /**
     * @param {object} [options]
     * @param {string} [options.message="Bad request error"] - Human-readable error message.
     * @param {string} [options.code] - Optional machine-readable error code.
     */
    constructor({
        message = "Bad request error",
        code,
    } = {}){
        super({
            message,
            statusCode: HTTP_STATUS.BAD_REQUEST,
            code,
        })
    }
}

export { BadRequestError };
