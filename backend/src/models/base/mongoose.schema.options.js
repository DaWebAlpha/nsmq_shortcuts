import { SENSITIVE_FIELDS } from "../../constants/index.js";
import { config } from "../../config/index.js";

/**
 * Mongoose `toJSON`/`toObject` transform shared by every model built on
 * this base. Turns a raw Mongoose document into clean, predictable output:
 * swaps `_id` for a plain string `id`, strips the internal `__v`, deletes
 * any field listed in `SENSITIVE_FIELDS`, and drops nullish or
 * blank-string fields so the frontend never sees MongoDB internals or
 * placeholder empties.
 *
 * @param {object} _document - The original Mongoose document (unused; required by Mongoose's transform signature).
 * @param {object} returnedObject - The plain object Mongoose is about to serialize, mutated in place.
 * @returns {object} The same object, cleaned up.
 */
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

/**
 * Options passed to both `toJSON` and `toObject` so serialized output is
 * identical either way: include virtuals, and run every document through
 * `transformDocument`.
 */
const serializationOptions = Object.freeze({
    virtuals: true,
    transform: transformDocument,
})

/**
 * Base `mongoose.Schema` options every model in this app spreads into its
 * own schema — timestamps, strict validation, optimistic concurrency, and
 * consistent serialization — so each model only has to declare what makes
 * it unique.
 */
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
