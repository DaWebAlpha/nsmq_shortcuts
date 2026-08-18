/**
 * Structured, file-backed logging built on pino. Exports three independent
 * loggers (`systemLogger`, `auditLogger`, `accessLogger`) so general app
 * logs, audit trails, and HTTP access logs can be filtered, retained, and
 * shipped separately instead of interleaving in one stream.
 */

import pino from "pino";
import path from "node:path";
import fs from "node:fs";

import { config } from "../config/index.js";
import { SENSITIVE_FIELDS } from "../constants/index.js";

const isDevelopment = 
        config.nodeEnv === "development";

const logLevel = isDevelopment ? 
                "debug" :
                "info";

const logDirectory = path.resolve(config.logDirectory);

if(!fs.existsSync(logDirectory)){
    fs.mkdirSync(logDirectory, {recursive: true});
}


/**
 * Builds a single `pino-roll` file transport target: a daily-rolled,
 * size-capped log file under `logDirectory`, with older files pruned once
 * `retentionCount` is exceeded.
 *
 * @param {string} fileLocation - Path (relative to `logDirectory`) for the rolled log file, e.g. "system/app-info".
 * @param {string} frequency - Roll frequency accepted by pino-roll, e.g. "daily".
 * @param {string} fileSize - Max file size before rolling to a new file, e.g. "20m".
 * @param {string} [minLevel=logLevel] - Minimum pino level written to this target.
 * @param {number} retentionCount - How many rolled files to keep before older ones are deleted.
 * @returns {object} A pino.transport target descriptor.
 */
const buildTransportTarget = (
    fileLocation,
    frequency,
    fileSize,
    minLevel = logLevel,
    retentionCount
) => ({
    target: "pino-roll",
    level: minLevel,
    options: {
        file: path.join(logDirectory, fileLocation),
        extension: ".json",
        frequency,
        size: fileSize,
        mkdir: true,
        dateFormat: "yyyy-MM-dd",
        sync: false,
        limit: {
            count: retentionCount
        },
    }
})

/**
 * In development, mirror every log line to the terminal via pino-pretty; in
 * production this is an empty array, so each transport writes only its
 * file target.
 */
const terminalTargets = isDevelopment
    ? [
        {
            target: "pino-pretty",
            options: {
                colorize: true,
                ignore: "pid, hostname",
                translateTime: "SYS:yyyy-MM-dd HH:mm:ss",
            }
        }
    ] :
    [];


/** General application info/error logs, split into separate files, both kept 90 days. */
const systemTransport = pino.transport({
    targets: [
        buildTransportTarget(
            "system/app-info", 
            "daily",
            "20m",
            "info",
            90,
        ),
        buildTransportTarget(
            "system/app-error",
            "daily",
            "20m",
            "error",
            90
        ),
        ...terminalTargets,
    ],
});


/** Audit trail logs — kept longer (180 days) than system logs. */
const auditTransport = pino.transport({
    targets: [
        buildTransportTarget(
            "audit/app-audit",
            "daily",
            "20m",
            "info",
            180
        ),
        ...terminalTargets
    ],
});


/** HTTP access logs — high-volume, so kept for a shorter window (30 days). */
const accessTransport = pino.transport({
    targets: [
        buildTransportTarget(
            "access/app-access",
            "daily",
            "20m",
            "info",
            30
        ),
        ...terminalTargets
    ],
});

/**
 * Builds the pino options shared by all three loggers: level, ISO
 * timestamps, a fixed `service`/`environment` base object, sensitive-field
 * redaction, and a `level_label` mixin so every log line carries a
 * readable level name alongside the numeric one.
 *
 * @returns {object} Options passed as the first argument to `pino(...)`.
 */
const getBaseConfig = () => ({
    level: logLevel,
    timestamp: pino.stdTimeFunctions.isoTime,

    base: {
        service: config.service,
        environment: config.nodeEnv,
    },

    redact: {
        paths: [
            ...SENSITIVE_FIELDS
        ],
        remove: true
    },
    mixin(_context, levelNumber){
        const labels = {
            10: "trace",
            20: "debug",
            30: "info",
            40: "warn",
            50: "error",
            60: "fatal"
        };

        return {
            level_label: labels[levelNumber] || logLevel,
        }
    },
});


/** General application logs (info/error), split into daily rolled files. */
export const systemLogger = pino(
    getBaseConfig(),
    systemTransport
);

/** Audit trail logs, kept longer than system logs (180 vs 90 days). */
export const auditLogger = pino(
    getBaseConfig(),
    auditTransport,
)

/** HTTP access logs. */
export const accessLogger = pino(
    getBaseConfig(),
    accessTransport
)

/** Convenience bundle of all three loggers. */
export const loggers = {
    systemLogger,
    auditLogger,
    accessLogger
}