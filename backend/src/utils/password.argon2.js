import argon2 from "argon2";
import { systemLogger } from "../logger/pino.logger.js";
import {
    BadRequestError,
    InternalServerError
} from "../errors/index.js";


/** Argon2id hashing parameters used by {@link hashPassword}. */
const ARGON_CONFIG = {
    type: argon2.argon2id,
    memoryCost: 2 ** 16,
    timeCost: 3,
    parallelism: 2,
    hashLength: 32,
};


/**
 * Validates and hashes a plaintext password with Argon2id.
 * @param {string} password - The plaintext password to hash.
 * @returns {Promise<string>} The Argon2 hash string.
 * @throws {BadRequestError} If `password` isn't a string, is empty, or is under 8 characters.
 * @throws {InternalServerError} If Argon2 itself fails to hash (logged first, original error not leaked).
 */
const hashPassword = async(password) => {
    if(typeof password !== "string"){
        throw new BadRequestError({
            message: "Password must be a string",
            code: "PASSWORD_NOT_STRING"
        });
    };

    if(password.length === 0){
        throw new BadRequestError({
            message: "Password is required",
            code: "PASSWORD_REQUIRED"
        })
    };

    if(password.length < 8){
        throw new BadRequestError({
            message: "Password must be at least 8 characters long",
            code: "PASSWORD_LESS_THAN_8_CHARACTERS"
        })
    }

    try{

        return await argon2.hash(password, ARGON_CONFIG);
    }catch(error){
        systemLogger.error(
            {err: error},
            "Security: Password hashing failed",
        );

        throw new InternalServerError({
            message: "Internal security error",
            code: "INTERNAL_SECURITY_ERROR",
        })
    }
}

/**
 * Verifies a plaintext password against an Argon2 hash. Returns `false`
 * instead of throwing for malformed input or a verification failure —
 * only a genuinely unexpected Argon2 error gets logged; a normal
 * "wrong password" is not an error, just a `false` result.
 * @param {string} plainPassword - The plaintext password to check.
 * @param {string} hashedPassword - The stored Argon2 hash to check against.
 * @returns {Promise<boolean>} True if `plainPassword` matches `hashedPassword`.
 */
const verifyPassword = async(plainPassword, hashedPassword) => {
    if(
        typeof plainPassword !== "string" ||
        typeof hashedPassword !== "string" ||
        plainPassword.length === 0 ||
        hashedPassword.length === 0
    ){
        return false;
    }

    try{
        return await argon2.verify(hashedPassword, plainPassword)
    }catch(error){
        systemLogger.error(
            {err: error},
            "Security: Password verification failed"
        )
    }
    return false;
}

export {
    hashPassword,
    verifyPassword
}