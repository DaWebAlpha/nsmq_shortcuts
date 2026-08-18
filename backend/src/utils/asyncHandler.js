/**
 * Wraps an async Express route handler so a rejected promise is forwarded
 * to `next(error)` instead of crashing the process or hanging the request —
 * Express doesn't catch async rejections on its own.
 *
 * @param {Function} fn - An async (or promise-returning) Express route handler.
 * @returns {Function} A new handler with the same signature that catches rejections automatically.
 */
const asyncHandler = (fn) => (request, response, next) => {
    return Promise.resolve(fn(request, response, next)).catch(next);
}

export { asyncHandler };