import { HTTP_STATUS } from "../constants/index.js";
import { AppError } from "./app.error.js";

/**
 * 409 Conflict — the request conflicts with the current state of the
 * resource (e.g. a duplicate email on signup).
 *
 * @extends AppError
 */
class ConflictError extends AppError{
    /**
     * @param {object} [options]
     * @param {string} [options.message="Conflict error"] - Human-readable error message.
     * @param {string} [options.code] - Optional machine-readable error code.
     */
    constructor({
        message = "Conflict error",
        code,
    } = {}){
        super({
            message,
            statusCode: HTTP_STATUS.CONFLICT,
            code,
        })
    }
}

export { ConflictError };
