/**
 * Barrel file re-exporting every shared utility.
 */
export { asyncHandler } from "./asyncHandler.js";

export {
    hashPassword,
    verifyPassword
} from "./password.argon2.js";

export {
    withTransaction,
    isTransientTransactionError
} from "./withTransaction.js";

export {
    throwErrorOnEmptyInput
} from "./throwErrorOnEmptyInput.js";

export {
    normalizeString,
    normalizeEmail,
    normalizeCountry,
    normalizeText
} from "./normalizer.js";

export {
    getClientIP,
    getUserAgent,
    getDeviceName,
    getDeviceId
} from "./request.js";

export {
    gracefulShutdown
} from "./gracefulShutdown.js";

export {
    respondAction
} from "./responseAction.js";

export {
    normalizePhoneNumber
} from "./phone.js";

export {
    generateAccessToken,
    verifyAccessToken
} from "./jwt.js";

export {
    setAuthCookies,
    clearAuthCookies,
    ACCESS_TOKEN_COOKIE,
    REFRESH_TOKEN_COOKIE
} from "./authCookies.js";

export {
    buildSearchFilter
} from "./buildSearchFilter.js";

export {
    fetchOrNotFound
} from "./fetchOrNotFound.js";

// refreshTokenUtils.js isn't re-exported here yet -- it imports
// RefreshToken from ../models/auth/refreshToken.model.js, which doesn't
// exist yet. Adding it to this barrel before that model exists would
// break every other export in this file too, not just this one.
