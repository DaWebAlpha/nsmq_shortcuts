import { app } from "./app.js";
import { connectDatabase } from "./config/database.js";
import { config } from "./config/index.js";
import { systemLogger} from "./logger/pino.logger.js";


/**
 * Entry point: connects to the database before starting the HTTP server,
 * so the app never accepts requests it can't actually serve. Exits the
 * process on any startup failure rather than starting in a broken state.
 * @returns {Promise<void>}
 */
const startServer = async() => {
    try{
        await connectDatabase();

        const server = app.listen(config.port, () => {
            systemLogger.info(`Listening on port: ${config.port}`);
        })
    }catch(error){
        systemLogger.error({err: error}, "Server connection error");
        process.exit(1);
    }
}

startServer()