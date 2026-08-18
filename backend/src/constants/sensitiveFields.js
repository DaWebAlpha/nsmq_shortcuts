/**
 * Pino `redact` paths for values that must never be written to a log file —
 * passwords, tokens, cookies, and auth headers. Fields are listed both at
 * the top level of a logged object and nested one level down (the
 * `*.`-prefixed entries), since real log calls hit both shapes.
 * @see https://getpino.io/#/docs/redaction
 */
const SENSITIVE_FIELDS = Object.freeze([
    "password",
    "*.password",
    "token",
    "*.token",
    "access_token",
    "refresh_token",
    "*.access_token",
    "*.refresh_token",
    "accessToken",
    "*.accessToken",
    "refreshToken",
    "*.refreshToken",
    "apiKey",
    "*.apiKey",
    "authorization",
    "*.authorization",
    "headers.authorization",
    "*.headers.authorization",
    "cookie",
    "*.cookie",
    "headers.cookie",
    "*.headers.cookie",
    "req.headers.authorization",
    "req.headers.cookie",
])

export { SENSITIVE_FIELDS };