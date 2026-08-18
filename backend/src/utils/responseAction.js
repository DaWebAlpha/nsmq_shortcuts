/**
 * Standard response for a "mutate, then go back to where you were" action
 * (ban/suspend/delete a user, create/edit a note, cancel a subscription, …).
 *
 * A plain HTML form submission gets the original redirect-with-flash
 * behavior (progressive enhancement / no-JS fallback). A request that asks
 * for JSON (the app's shared AJAX layer always does) instead gets
 * `{ success, message, redirectTo }`. `redirectTo` is included either way —
 * a form using data-ajax="stay" simply ignores it and refreshes in place,
 * while data-ajax="navigate" (e.g. deleting the user you're currently
 * viewing the details page for) needs it to know where to go next.
 * @param {import("express").Request} request
 * @param {import("express").Response} response
 * @param {object} params
 * @param {boolean} params.success
 * @param {string} params.message
 * @param {string} params.redirectTo - Where to go next, for both the plain-form redirect and AJAX "navigate" mode.
 * @param {number} [params.status] - Explicit HTTP status; defaults to 200 on success, 400 on failure.
 */
const respondAction = (request, response, { success, message, redirectTo, status }) => {
    const wantsJson = request.accepts(["html", "json"]) === "json";
    const statusCode = status ?? (success ? 200 : 400);

    if (wantsJson) {
        return response.status(statusCode).json({ success, message, redirectTo });
    }

    request.flash?.(success ? "success" : "error", message);

    return response.redirect(redirectTo);
};

export { respondAction };
export default respondAction;
