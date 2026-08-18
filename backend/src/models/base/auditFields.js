import mongoose from "mongoose";

const { ObjectId } = mongoose.Schema.Types;

const fieldOptions = Object.freeze({
    type: ObjectId,
    ref: "User",
    default: null,
})

const dateOptions = ({
    type: Date,
    default: null
})

const reasonOptions = {
    type: String,
    default: null,
}

const booleanOptions = ({
    type: Boolean,
    default: false,
})

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