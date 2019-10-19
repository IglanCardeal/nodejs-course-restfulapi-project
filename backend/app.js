import path from "path";
import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import multer from "multer";
import feedRoutes from "./routes/feed";
import crypto from "crypto";

const PORT = process.env.PORT || 8080;
const app = express();

const fileStorage = multer.diskStorage({
  destination: (res, file, callback) => {
    callback(null, "images");
  },
  filename: (req, file, callback) => {
    // cria uma string alfanumerica aleatoria para nomear um arquivo. ex: 0f41a14a7dcc8494f95b893ababd18351569273703561
    const randomFileName = crypto.randomBytes(16).toString("hex") + Date.now();
    callback(null, randomFileName + ".png");
    // callback(null, Date.now().toString() + "-" + file.originalname);
  }
});
const fileFilter = (req, file, callback) => {
  const validImageFileFormat = Boolean(
    file.mimetype === "image/png" ||
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/jpg"
  );
  if (validImageFileFormat) {  
    callback(null, true);
  } else {
    callback(null, false);
  }
};

app.use(bodyParser.json());
app.use(
  multer({
    storage: fileStorage,
    fileFilter: fileFilter
  }).single("image")
);
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

app.use("/feed", feedRoutes);
app.use((error, req, res, next) => {
  // tratamento geral de erros, executa sempre que tiver um next(error).
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.statusCode
    ? error.message
    : "Internal Server Error! We are working to solve that, sorry. :(";
  res.status(status).json({ message });
});

const mongoPort = 27017;
const database = "my-api";
const mongoUrl = `mongodb://localhost:${mongoPort}/${database}`;

mongoose.connect(mongoUrl, { useNewUrlParser: true }, error => {
  if (error) {
    console.log(error);
    process.exit(1);
  }
  app.listen(PORT, () => {
    console.log(`MongoDB connection successful!\nURL = ${mongoUrl}\n`);
    console.log(`API Server running on port: ${PORT}`);
  });
});
