import mongoose from "mongoose";

const { ObjectId } = mongoose.Schema.Types;

/** Reference to the User who performed an audit-tracked action, nullable until set. */
const fieldOptions = Object.freeze({
    type: ObjectId,
    ref: "User",
    default: null,
})

/** A nullable timestamp for an audit event (e.g. when a document was deleted or restored). */
const dateOptions = ({
    type: Date,
    default: null
})

/** A nullable free-text reason attached to an audit action. */
const reasonOptions = {
    type: String,
    default: null,
}

/** A boolean audit flag, defaulting to false. */
const booleanOptions = ({
    type: Boolean,
    default: false,
})

/**
 * Schema fields every soft-deletable, audit-tracked model shares: who
 * created/updated/deleted/restored a document, when, why, and whether it's
 * currently soft-deleted. Meant to be spread into a model's own schema
 * definition rather than used standalone.
 */
const auditFields = Object.freeze({
    createdBy: fieldOptions,
    updatedBy: fieldOptions,
    deletedBy: fieldOptions,
    restoredBy: fieldOptions,

    deletedAt: dateOptions,
    restoredAt: dateOptions,

    isDeleted: booleanOptions,

    restoreReason: reasonOptions,
    deleteReason: reasonOptions,
});

export {
    auditFields
}