/**
 * Central map of HTTP status codes used across the app, so routes and error
 * classes reference a name (`HTTP_STATUS.NOT_FOUND`) instead of a bare
 * number that's easy to typo or misread.
 */
const HTTP_STATUS = Object.freeze({
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHENTICATED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    INTERNAL_SERVER_ERROR: 500,
})

export { HTTP_STATUS };

