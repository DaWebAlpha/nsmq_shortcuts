/**
 * Reads and validates every environment variable the app needs, once, and
 * exports a single frozen `config` object — the rest of the app imports
 * this instead of reading `process.env` directly.
 */

import dotenv from "dotenv";

dotenv.config();

const {
    PORT,
    MONGO_URI,
    NODE_ENV,
    LOG_LEVEL,
    LOG_DIRECTORY,
    SERVICE,
    JWT_ACCESS_SECRET,
    ACCESS_TOKEN_EXPIRES_IN_SECONDS,
    REFRESH_TOKEN_EXPIRES_IN_DAYS,
    ACCESS_TOKEN_COOKIE_NAME,
    REFRESH_TOKEN_COOKIE_NAME,
    MAIL_HOST,
    MAIL_PORT,
    MAIL_SECURE,
    MAIL_USER,
    MAIL_PASS,
    MAIL_FROM,
    PASSWORD_RESET_TOKEN_EXPIRY_MINUTES,
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_REDIRECT_URI,
} = process.env;

const requiredEnvs = {
    MONGO_URI,
    JWT_ACCESS_SECRET,
}

for (const [key, value] of Object.entries(requiredEnvs)){
    if(typeof value !== "string" ||
        value.trim() === "" ||
        !value
    ){
        throw new Error(
          `Missing .env value: ${key}`
        )
    }
}

if(JWT_ACCESS_SECRET.length < 32){
    throw new Error("JWT_ACCESS_SECRET must be at least 32 characters");
}

/**
 * Coerces a raw (always-string) env var into a positive number.
 * @param {string|undefined} value - The raw env var value.
 * @param {number} fallback - Value to use if `value` is missing or not a positive finite number.
 * @returns {number}
 */
const toNumber = (value, fallback) => {
    if(!value){
        return fallback;
    }

    const validNumber = Number(value);

    return Number.isFinite(validNumber) &&
           validNumber > 0 ?
           validNumber : 
           fallback
}


const allowedNodeEnvs = [
    "development", 
    "test", 
    "production"
];

let resolvedNodeEnvs;

if (
    NODE_ENV === undefined || 
    NODE_ENV.trim() === ""
) {
    resolvedNodeEnvs = "development";
} else if (allowedNodeEnvs.includes(NODE_ENV)) {
    resolvedNodeEnvs = NODE_ENV;
} else {
    throw new Error(
        `Invalid NODE_ENV: "${NODE_ENV}". Must be one of: ${allowedNodeEnvs.join(", ")}`
    );
}

const allowedLogLevels = [ 
    "trace",
    "debug",
    "info",
    "warn",
    "error",
    "fatal",
    ];

let resolvedLogLevels;

if (LOG_LEVEL === undefined || LOG_LEVEL.trim() === "") {
    resolvedLogLevels = "info";
} else if (allowedLogLevels.includes(LOG_LEVEL)) {
    resolvedLogLevels = LOG_LEVEL;
} else {
    throw new Error(
        `Invalid LOG_LEVEL: "${LOG_LEVEL}". Must be one of: ${allowedLogLevels.join(", ")}`
    );
}


/**
 * The app's single source of truth for runtime settings. Frozen so no
 * other file can accidentally mutate shared config at runtime.
 * @property {number} port
 * @property {string} mongoUri
 * @property {"development"|"test"|"production"} nodeEnv
 * @property {"trace"|"debug"|"info"|"warn"|"error"|"fatal"} logLevel
 * @property {string} logDirectory
 * @property {string|undefined} service
 * @property {string} jwtAccessSecret
 * @property {number} jwtAccessExpirySeconds
 * @property {number} jwtRefreshExpiryDays
 * @property {number} jwtRefreshExpiryMs
 * @property {string} accessTokenCookie
 * @property {string} refreshTokenCookie
 * @property {string|undefined} mailHost
 * @property {number} mailPort
 * @property {boolean} mailSecure
 * @property {string|undefined} mailUser
 * @property {string|undefined} mailPass
 * @property {string|undefined} mailFrom
 * @property {number} passwordResetTokenExpiryMinutes
 * @property {string|undefined} googleClientId
 * @property {string|undefined} googleClientSecret
 * @property {string|undefined} googleRedirectUri
 */
const config = Object.freeze({
    port: toNumber(PORT, 4000),
    mongoUri: MONGO_URI,
    nodeEnv: resolvedNodeEnvs,
    logLevel: resolvedLogLevels,
    logDirectory: LOG_DIRECTORY || "logs",
    service: SERVICE,
    jwtAccessSecret: JWT_ACCESS_SECRET,
    jwtAccessExpirySeconds: toNumber(ACCESS_TOKEN_EXPIRES_IN_SECONDS, 15 * 60),
    jwtRefreshExpiryDays: toNumber(REFRESH_TOKEN_EXPIRES_IN_DAYS, 7),
    jwtRefreshExpiryMs: toNumber(REFRESH_TOKEN_EXPIRES_IN_DAYS, 7) * 24 * 60 * 60 * 1000,
    accessTokenCookie: ACCESS_TOKEN_COOKIE_NAME || "access_token",
    refreshTokenCookie: REFRESH_TOKEN_COOKIE_NAME || "refresh_token",
    mailHost: MAIL_HOST,
    mailPort: toNumber(MAIL_PORT, 587),
    mailSecure: MAIL_SECURE === "true",
    mailUser: MAIL_USER,
    mailPass: MAIL_PASS,
    mailFrom: MAIL_FROM || MAIL_USER,
    passwordResetTokenExpiryMinutes: toNumber(PASSWORD_RESET_TOKEN_EXPIRY_MINUTES, 30),
    googleClientId: GOOGLE_CLIENT_ID,
    googleClientSecret: GOOGLE_CLIENT_SECRET,
    googleRedirectUri: GOOGLE_REDIRECT_URI,
})


export {
    config,
}