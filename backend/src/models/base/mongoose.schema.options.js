import { SENSITIVE_FIELDS } from "../../constants/index.js";
import { config } from "../../config/index.js";

const transformDocument = (_document, returnedObject) => {
    if(returnedObject._id){
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
    }

    delete returnedObject.__v;

    for (const key of SENSITIVE_FIELDS){
        delete returnedObject[key];
    }

    for(const key in returnedObject){
        const value = returnedObject[key];

        if(
            value === null ||
            value === undefined ||
            (typeof value === "string" && value.trim() === "")
        ){
            delete returnedObject[key]
        }
    }

    return returnedObject
}

const serializationOptions = Object.freeze({
    virtuals: true,
    transform: transformDocument,
})

const mongooseSchemaOptions = Object.freeze({
    timestamps: true,
    id: false,
    strict: true,
    strictQuery: true,
    minimize: false,
    optimisticConcurrency: true,
    autoIndex: config.nodeEnv === "development",
    toJSON: serializationOptions,
    toObject: serializationOptions,
})

export {
    mongooseSchemaOptions
}
