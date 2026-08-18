import { HTTP_STATUS } from "../constants/index.js";

/**
 * Catch-all 404 handler — registered after every real route, so it only
 * runs when nothing else matched the request. Renders the `404` view
 * rather than calling `next()`, ending the request-response cycle here.
 *
 * @param {import("express").Request} request
 * @param {import("express").Response} response
 * @param {import("express").NextFunction} next
 * @returns {void}
 */
const notFound = (request, response, next) => {
    return response.status(HTTP_STATUS.NOT_FOUND).render('404',{
        success: false,
        message: `The requested resource ${request.originalUrl} could not be found on the server`,
    })
}

export {
    notFound,
}
