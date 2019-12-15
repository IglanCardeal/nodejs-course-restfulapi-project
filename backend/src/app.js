import express from "express";
import bodyParser from "body-parser";
import { join } from "path";
import dotenv from "dotenv";
import helmet from "helmet";

import appRoutes from "./routes/app.routes";

import errorHandler from "./middleware/error-handler";
import multerFileStorage from "./middleware/multer-filestorage";

import cors from "./middleware/cors";

dotenv.config();

const app = express();

app.use(bodyParser.json());
app.use(multerFileStorage);
app.use("/src/images", express.static(join(__dirname, "images")));
app.use(helmet());
app.use(cors);

app.use(appRoutes);
app.use(errorHandler);

export default app;
