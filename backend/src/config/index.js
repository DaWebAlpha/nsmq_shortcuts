import dotenv from "dotenv";

dotenv.config();

const {
    PORT,
    MONGO_URI,
    NODE_ENV,
    LOG_LEVEL
} = process.env;

const requiredEnvs = {
    MONGO_URI,
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

const resolvedNodeEnvs = allowedNodeEnvs.includes(NODE_ENV) ? 
                         NODE_ENV : "development";

const allowedLogLevels = [ 
    "trace",
    "debug",
    "info",
    "warn",
    "error",
    "fatal",
    ];

const resolvedLogLevels = allowedLogLevels
                          .includes(LOG_LEVEL) ?
                          LOG_LEVEL : "info";


const config = Object.freeze({
    port: toNumber(PORT, 4000),
    mongoUri: MONGO_URI,
    nodeEnv: resolvedNodeEnvs,
    logLevel: resolvedLogLevels,
})


export {
    config,
}