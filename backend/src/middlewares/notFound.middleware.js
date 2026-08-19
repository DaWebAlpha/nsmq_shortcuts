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

    const wantsJson = request.accepts(["html", "json"]) === "json";

    if(wantsJson){
        return response.status(HTTP_STATUS.NOT_FOUND).json({
            success: false,
            title: "404 Error page",
            message: `The requested resource ${request.originalUrl} could not be found on the server`,
        })
    }

    return response.status(HTTP_STATUS.NOT_FOUND).render('404',{
        success: false,
        title: "404 Error page",
        message: `The requested resource ${request.originalUrl} could not be found on the server`,
    })
}

export {
    notFound,
}
