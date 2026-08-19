import crypto from "node:crypto";
import { config } from "../config/index.js";

const OAUTH_STATE_COOKIE = "oauth_state";
const STATE_MAX_AGE_MS = 5 * 60 * 1000;

/**
 * Generates a random CSRF-protection value for the OAuth redirect flow and
 * stores it in a short-lived httpOnly cookie. The same value is also sent
 * as the `state` query param to the provider; the callback route rejects
 * the flow if the two don't match, so an attacker can't complete a login
 * by tricking a victim into visiting a crafted callback URL.
 * @param {import("express").Response} response
 * @returns {string} The generated state value.
 */
const issueOAuthState = (response) => {
    const state = crypto.randomBytes(24).toString("hex");

    response.cookie(OAUTH_STATE_COOKIE, state, {
        httpOnly: true,
        secure: config.nodeEnv === "production",
        sameSite: "lax",
        maxAge: STATE_MAX_AGE_MS,
    });

    return state;
};

/**
 * Confirms the `state` query param returned by the provider matches the
 * value issued in `issueOAuthState`, then clears the cookie either way —
 * it's single-use.
 * @param {import("express").Request} request
 * @param {import("express").Response} response
 * @returns {boolean} True if a state cookie was present and matches the query param.
 */
const verifyOAuthState = (request, response) => {
    const expected = request.cookies?.[OAUTH_STATE_COOKIE];
    const received = request.query?.state;

    response.clearCookie(OAUTH_STATE_COOKIE);

    return Boolean(expected) && expected === received;
};

export { issueOAuthState, verifyOAuthState, OAUTH_STATE_COOKIE };
