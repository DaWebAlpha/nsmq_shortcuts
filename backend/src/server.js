import { app } from "./app.js";
import { connectDatabase } from "./config/database.js";
import { config } from "./config/index.js";


const startServer = async() => {
    try{
        await connectDatabase();

        const server = app.listen(config.port, () => {
            console.log(`Listening on port: ${config.port}`);
        })
    }catch(error){
        console.error({err: error}, "Server connection error");
        process.exit(1);
    }
}

startServer()