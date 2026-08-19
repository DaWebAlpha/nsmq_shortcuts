import { HTTP_STATUS } from "../constants/index.js";
import { config } from "../config/index.js";
import { systemLogger } from "../logger/pino.logger.js";


/**
 * Express error-handling middleware — must be registered last, after every
 * route and other middleware, and must keep exactly four parameters
 * `(error, request, response, next)` since Express identifies an error
 * handler by that arity alone.
 *
 * Logs the full error (real message, stack, and request context) via
 * `systemLogger` regardless of environment, then sends a JSON error
 * response instead of Express's default HTML error page: operational
 * errors (see the `errors/` classes) show their own message verbatim,
 * anything else falls back to a generic message so unexpected failures
 * don't leak internals to the client. The stack trace in that *response*
 * (as opposed to the log) is only included outside production.
 *
 * @param {Error & {statusCode?: number, code?: string, isOperational?: boolean}} error
 * @param {import("express").Request} request
 * @param {import("express").Response} response
 * @param {import("express").NextFunction} next
 * @returns {void}
 */
const errorHandler = (error, request, response, next) => {
    if (response.headersSent) {
        return next(error);
    }

    const code = error.code;
    const statusCode = error.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;
    const isOperational = error.isOperational || false;

    systemLogger.error(
        {
            err: error,
            statusCode,
            isOperational,
            method: request.method,
            url: request.originalUrl,
        },
        "An error occurred during request processing"
    );

    const message = isOperational ? error.message : "Something went wrong";
    const wantsJson = request.accepts(["html", "json"]) === "json";

    if (wantsJson) {
        return response.status(statusCode).json({
            success: false,
            message,
            code,
            stack: config.nodeEnv === "development" ?
                error.stack :
                "",
        });
    }

    return response.status(statusCode).render("errorPage", {
        statusCode,
        message,
        code,
    });
}

export { errorHandler };