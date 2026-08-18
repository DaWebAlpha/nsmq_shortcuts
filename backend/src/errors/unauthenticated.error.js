import { HTTP_STATUS } from "../constants/index.js";
import { AppError } from "./app.error.js";


/**
 * 401 Unauthenticated — the request has no valid credentials.
 *
 * @extends AppError
 */
class UnauthenticatedError extends AppError{
    /**
     * @param {object} [options]
     * @param {string} [options.message="Unauthenticated error"] - Human-readable error message.
     * @param {string} [options.code] - Optional machine-readable error code.
     */
    constructor({
        message = "Unauthenticated error",
        code,
    } = {}){
        super({
            message,
            statusCode: HTTP_STATUS.UNAUTHENTICATED,
            code
        })
    }
}

export {
    UnauthenticatedError,
};
