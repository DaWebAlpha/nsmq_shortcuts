/**
 * The Express app shell: security/body-parsing middleware, the EJS view
 * engine, static assets, routes, and finally the 404/error handlers that
 * must be registered last. `server.js` imports `app` from here and starts
 * listening on it.
 */

import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import helmet from "helmet";
import cookieParser from "cookie-parser";

import {
    notFound,
    errorHandler
} from "./middlewares/index.js";


const app = express();


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(helmet());
app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({extended: true}));


app.get("/", (request, response) => {
    return response.status(200).render("pages/home", {
        success: true,
        title: "home",
        message: "rendering page"
    })
})
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "..", "..", "frontend", "views"));
app.use(express.static(path.join(__dirname, "..", "..", "frontend", "public")));

app.use(notFound);
app.use(errorHandler);

export { app };