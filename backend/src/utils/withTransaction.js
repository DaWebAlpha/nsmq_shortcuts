import mongoose from "mongoose";
import { systemLogger } from "../logger/pino.logger.js";

const MAX_TRANSACTION_ATTEMPTS = 3;

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Detects MongoDB's TransientTransactionError label — the documented,
 * expected error MongoDB returns when two transactions touch the same
 * document at (almost) the same time. This is not a bug or a real
 * failure; it's MongoDB's way of saying "retry me."
 * @param {*} error - The caught error to inspect.
 * @returns {boolean} True if this error is safe to retry.
 */
const isTransientTransactionError = (error) => {
    if (typeof error?.hasErrorLabel === "function") {
        return error.hasErrorLabel("TransientTransactionError");
    }

    return Boolean(error?.errorLabels?.includes?.("TransientTransactionError"));
};

/**
 * Runs `work(session)` inside a transaction, retrying on MongoDB's
 * TransientTransactionError (the documented, expected error when two
 * transactions touch the same document at once) with linear backoff.
 * The callback is re-run from scratch on each retry, not just the write —
 * any reads it does should be re-read fresh too, so a losing attempt
 * correctly sees the winner's committed state instead of acting on stale data.
 * @param {(session: import("mongoose").ClientSession) => Promise<*>} work - Receives the active session; do every read/write for this unit of work through it.
 * @param {object} [options]
 * @param {number} [options.maxAttempts=3] - How many times to retry a transient failure before giving up.
 * @returns {Promise<*>} Whatever `work` returns, once the transaction commits.
 * @throws {*} Re-throws the callback's error immediately if it isn't a transient one, or after maxAttempts is exhausted.
 */
const withTransaction = async (work, { maxAttempts = MAX_TRANSACTION_ATTEMPTS } = {}) => {
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        const session = await mongoose.startSession();

        try {
            session.startTransaction();

            const result = await work(session);

            await session.commitTransaction();

            return result;
        } catch (error) {
            try {
                if (session.inTransaction?.() ?? true) {
                    await session.abortTransaction();
                }
            } catch (abortError) {
                systemLogger.error(
                    { err: abortError, originalError: error },
                    "Database transaction abort failed"
                );
            }

            if (isTransientTransactionError(error) && attempt < maxAttempts) {
                await wait(50 * attempt);
                continue;
            }

            throw error;
        } finally {
            try {
                await session.endSession();
            } catch (endSessionError) {
                systemLogger.error(
                    { err: endSessionError },
                    "Database session cleanup failed"
                );
            }
        }
    }
};

export { withTransaction, isTransientTransactionError };

