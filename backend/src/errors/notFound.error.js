import { HTTP_STATUS } from "../constants/index.js";
import { AppError } from "./app.error.js";

/**
 * 404 Not Found — the requested resource doesn't exist.
 *
 * @extends AppError
 */
class NotFoundError extends AppError{
    /**
     * @param {object} [options]
     * @param {string} [options.message="Not found error"] - Human-readable error message.
     * @param {string} [options.code] - Optional machine-readable error code.
     */
    constructor({
        message = "Not found error",
        code
    } = {}){
        super({
            message,
            statusCode: HTTP_STATUS.NOT_FOUND,
            code
        })
    }
}

export { NotFoundError };
