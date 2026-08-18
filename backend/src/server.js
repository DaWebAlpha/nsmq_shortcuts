import { app } from "./app.js";
import { connectDatabase } from "./config/database.js";
import { config } from "./config/index.js";
import { systemLogger} from "./logger/pino.logger.js";


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