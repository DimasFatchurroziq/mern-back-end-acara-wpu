import { Express } from "express";
import swaggerUi from "swagger-ui-express";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const swaggerOutput = require("./swagger_output.json");
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url"; // Import ini untuk menangani __dirname di ESM
import { dirname } from "path"; 

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default function docs(app: Express){
const css = fs.readFileSync(path.resolve(__dirname, "../../node_modules/swagger-ui-dist/swagger-ui.css"), "utf-8");

    app.use(
        "/api-docs",
        swaggerUi.serve,
        swaggerUi.setup(swaggerOutput, {
            customCss: css,
        })
    )
}