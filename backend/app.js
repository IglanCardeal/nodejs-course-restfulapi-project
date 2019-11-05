import express from "express";
import bodyParser from "body-parser";
import path from "path";
import dotenv from "dotenv";

import feedRoutes from "./routes/feed";
import authRoutes from "./routes/auth";

import errorHandler from "./middleware/error-handler";
import multerFileStorage from "./middleware/multer-filestorage";

import databaseConnection from "./config/database-connection";

dotenv.config();

const PORT = process.env.APP_SERVER_PORT || 8080;
const app = express();

app.use(bodyParser.json());
app.use(multerFileStorage);
app.use("/images", express.static(path.join(__dirname, "images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); // permite request de todas as origens.
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, DELETE, PUT, PATCH" // metodos de request aceitos.
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization"); // headers de request aceitos.
  return next();
});

app.use("/auth", authRoutes);
app.use("/feed", feedRoutes);
app.use(errorHandler);

databaseConnection(() => {
  if (process.env.NODE_ENV !== "DEVELOPMENT") {
    console.log("Definir ambiente NODE_ENV como 'DEVELOPMENT' no aqruivo .env");
    process.exit(1);
  }
  app.listen(PORT, () => {
    console.log(`SERVER STARTED!\nAPI Server running on port: ${PORT}
    `);
  });
});