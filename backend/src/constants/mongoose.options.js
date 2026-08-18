/**
 * Options passed as the second argument to `mongoose.connect(...)` —
 * connection-pool sizing and timeouts, kept separate from connection logic
 * so they can be tuned or reused without touching `database.js`.
 */
const MONGOOSE_OPTIONS = Object.freeze({
    minPoolSize: 5,
    maxPoolSize: 50,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000
})

export {
    MONGOOSE_OPTIONS
}
