import mongoose from "mongoose";
import { config } from "./index.js";
import { MONGOOSE_OPTIONS } from "../constants/index.js"; 
import { systemLogger } from "../logger/pino.logger.js";

/**
 * Opens the Mongoose connection to MongoDB using the URI from {@link config}
 * and the pool/timeout options from `MONGOOSE_OPTIONS`.
 *
 * Logs and re-throws on failure rather than swallowing it — it's the
 * caller's job (see `server.js`) to decide whether a failed connection
 * should stop the app from starting.
 *
 * @returns {Promise<void>}
 * @throws Re-throws whatever error Mongoose threw while connecting.
 */
const connectDatabase = async() => {
    try{
        await mongoose
              .connect(
                config.mongoUri,
                MONGOOSE_OPTIONS
            )
    }catch(error){
       systemLogger.error({err: error}, "Database connection error");
       throw error;
    }
}


/**
 * Mongoose keeps one persistent connection open behind the scenes — these
 * listeners make sure connection-lifecycle events after the initial
 * `connect()` (e.g. a dropped network link) still reach the logs instead of
 * failing silently.
 */
mongoose.connection.on("connected", () => {
    systemLogger.info(`Database has been connected`);
})

mongoose.connection.on("disconnected", () => {
    systemLogger.warn("Database has been disconnected");
})

mongoose.connection.on("error", (err)=> {
    systemLogger.error({err}, "Database connection error");
})


export {
    connectDatabase
}