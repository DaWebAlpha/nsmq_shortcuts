import { HTTP_STATUS } from "../constants/index.js";
import { AppError } from "./app.error.js";


/**
 * 403 Forbidden — the caller is authenticated but not allowed to perform
 * this action.
 *
 * @extends AppError
 */
class ForbiddenError extends AppError{
    /**
     * @param {object} [options]
     * @param {string} [options.message="Forbidden error"] - Human-readable error message.
     * @param {string} [options.code] - Optional machine-readable error code.
     */
    constructor({
        message = "Forbidden error",
        code
    } = {}){
        super({
            message,
            statusCode: HTTP_STATUS.FORBIDDEN,
            code
        })
    }
}

export { ForbiddenError };
