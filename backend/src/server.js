import { app } from "./app.js";

const PORT = 4000;

const server = app.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`);
})