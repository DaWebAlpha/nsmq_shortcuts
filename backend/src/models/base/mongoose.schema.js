import mongoose from "mongoose";

import {
    softDeleteDocument,
    restoreDocument,
    paginateCollection,
} from "./helpers/index.js";

import {
    mongooseSchemaOptions
} from "./mongoose.schema.options.js";

import { auditFields } from "./auditFields.js";

/**
 * Builds a mongoose Schema pre-wired with audit fields (see `auditFields`),
 * the shared serialization/consistency options (see `mongooseSchemaOptions`),
 * and soft-delete/restore/pagination methods backed by the Step 3 helpers —
 * every model built with this factory gets all of it for free instead of
 * repeating the setup per model.
 *
 * @param {object} schemaDefinitions - The model's own field definitions.
 * @param {object} [options] - Extra schema options, merged over `mongooseSchemaOptions`.
 * @returns {import("mongoose").Schema}
 */
const createSchema = (schemaDefinitions, options) => {
    const schema = new mongoose.Schema(
        {
            ...schemaDefinitions,
            ...auditFields,
        },
        {
            ...mongooseSchemaOptions,
            ...options
        }
    )

    /**
     * Instance method: soft-deletes this document.
     * @see softDeleteDocument
     * @param {object} [options]
     * @param {string|import("mongoose").Types.ObjectId} [options.deletedByUserId] - User performing the deletion.
     * @param {string} [options.reason] - Optional justification for the deletion.
     * @param {import("mongoose").ClientSession} [options.session] - Transaction session, if any.
     * @returns {Promise<import("mongoose").Document>}
     */
    schema.methods.softDelete = function({
        deletedByUserId,
        reason,
        session
    } = {}){
        return softDeleteDocument({
            document: this,
            deletedByUserId,
            reason,
            session
        })
    }

    /**
     * Instance method: restores this soft-deleted document.
     * @see restoreDocument
     * @param {object} [options]
     * @param {string|import("mongoose").Types.ObjectId} [options.restoredByUserId] - User performing the restore.
     * @param {string} [options.reason] - Optional justification for the restore.
     * @param {import("mongoose").ClientSession} [options.session] - Transaction session, if any.
     * @returns {Promise<import("mongoose").Document>}
     */
    schema.methods.restore = function({
        restoredByUserId,
        reason,
        session
    } = {}){
        return restoreDocument({
            document: this,
            restoredByUserId,
            reason,
            session
        })
    }

    /**
     * Static method: paginates this model's collection. Note this is a
     * *static* (`Model.paginate(...)`), not an instance method — pagination
     * operates on the whole collection, not a single document, so `this`
     * needs to be the Model itself.
     * @see paginateCollection
     * @param {object} [params] - Same options as paginateCollection, minus `model`.
     * @returns {Promise<object>}
     */
    schema.statics.paginate = function(params = {}){
        return paginateCollection({model: this, ...params})
    }
    return schema;
}

export {
    createSchema
}