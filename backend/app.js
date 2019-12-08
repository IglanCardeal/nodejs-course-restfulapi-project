import express from "express";
import bodyParser from "body-parser";
import { join } from "path";
import dotenv from "dotenv";
import helmet from "helmet";

import appRoutes from "./routes/app.routes";

import errorHandler from "./middleware/error-handler";
import multerFileStorage from "./middleware/multer-filestorage";
import databaseConnection from "./config/database-connection";
import cors from "./middleware/cors";

dotenv.config();

const PORT = process.env.APP_SERVER_PORT || 8080;
const app = express();

app.use(bodyParser.json());
app.use(multerFileStorage);
app.use("/images", express.static(join(__dirname, "images")));
app.use(helmet());
app.use(cors);

app.use(appRoutes);
app.use(errorHandler);

databaseConnection(() => {
  const server = app.listen(PORT);

  require("./middleware/socket").init(server);

  console.log("Server running on port:", PORT);
  console.info("Enviroment: " + process.env.NODE_ENV);
});
