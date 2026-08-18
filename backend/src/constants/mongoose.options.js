const MONGOOSE_OPTIONS = Object.freeze({
    minPoolSize: 5,
    maxPoolSize: 50,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000
})

export {
    MONGOOSE_OPTIONS
}